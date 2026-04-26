const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOneAndUpdate(
            { email: 'john@gmail.com' },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log(`✅ User ${user.email} promoted to ADMIN successfully!`);
        } else {
            console.log('❌ User not found.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

promoteUser();
