require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neoconnect');

    const adminExists = await User.findOne({ email: 'admin@neoconnect.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@neoconnect.com',
      password: 'password123',
      role: 'Admin',
      department: 'IT',
    });

    await adminUser.save();

    console.log('Admin user seeded successfully!');
    console.log('Email: admin@neoconnect.com');
    console.log('Password: password123');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
