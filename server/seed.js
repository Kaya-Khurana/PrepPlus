const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // 1. Demote any other admins first (if you want only one)
        await User.updateMany({ email: { $ne: 'admin@prepplus.com' } }, { role: 'student' });

        // 2. Upsert the master admin
        const adminEmail = 'admin@prepplus.com';
        const adminPass = 'adminprepplus.123';
        
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            existingAdmin.password = adminPass;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log(`✅ Master Admin updated: ${adminEmail}`);
        } else {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPass,
                role: 'admin'
            });
            console.log(`✅ Master Admin created: ${adminEmail}`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
