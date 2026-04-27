const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({ role: 'admin' });
        console.log('Admins found:', users.map(u => u.email));
        
        const target = await User.findOne({ email: 'admin@prepplus.com' });
        if (target) {
            console.log('Target admin exists');
            // Test password
            const bcrypt = require('bcryptjs');
            const isMatch = await bcrypt.compare('adminprepplus.123', target.password);
            console.log('Password match test (adminprepplus.123):', isMatch);
        } else {
            console.log('Target admin DOES NOT exist');
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
