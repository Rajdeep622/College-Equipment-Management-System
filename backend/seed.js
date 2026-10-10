const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env if present
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const Transaction = require('./models/Transaction');

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college_management_system';

// Safe sample seed data (using non-production placeholder credentials)
const sampleUsers = [
  {
    name: 'Campus Administrator',
    studentId: 'ADMIN001',
    email: 'admin@campus.edu',
    phone: '9876543210',
    address: 'Campus Administration Building, Room 101',
    passwordHash: 'Admin@123', // Will be hashed by User pre-save hook
    role: 'admin',
    department: 'Administration',
    semester: 'Staff',
    status: 'Active'
  },
  {
    name: 'Rajdeep Patel',
    studentId: '24102C0043',
    email: 'rajdeep.patel@campus.edu',
    phone: '9876543211',
    address: 'Campus Hostel Block A, Room 302',
    passwordHash: 'Student@123',
    role: 'student',
    department: 'Computer Engineering',
    semester: '6th Semester',
    status: 'Active'
  },
  {
    name: 'Prem Tarange',
    studentId: '24102C0044',
    email: 'prem.tarange@campus.edu',
    phone: '9876543212',
    address: 'Campus Hostel Block B, Room 204',
    passwordHash: 'Student@123',
    role: 'student',
    department: 'Information Technology',
    semester: '4th Semester',
    status: 'Active'
  }
];

const sampleEquipment = [
  {
    equipmentId: 'EQ-001',
    name: 'Textbook: Data Structures & Algorithms',
    category: 'Academic',
    description: 'Advanced Data Structures & Algorithms (8th Edition). Essential reference for CSE core courses.',
    totalQuantity: 45,
    availableQuantity: 38,
    issuedQuantity: 7,
    maxDays: 14,
    location: 'Main Library - Section B2',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=500',
    status: 'Available',
    active: true
  },
  {
    equipmentId: 'EQ-002',
    name: 'Scientific Calculator Casio FX-991EX',
    category: 'Academic',
    description: 'Casio FX-991EX ClassWiz with matrix and polynomial solver capabilities.',
    totalQuantity: 30,
    availableQuantity: 22,
    issuedQuantity: 8,
    maxDays: 7,
    location: 'Academic Block - Lab 102',
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?auto=format&fit=crop&q=80&w=500',
    status: 'Available',
    active: true
  },
  {
    equipmentId: 'EQ-003',
    name: 'Cotton Laboratory Coat',
    category: 'Lab Tools',
    description: '100% Cotton anti-static white laboratory coat with press-stud fastings.',
    totalQuantity: 50,
    availableQuantity: 41,
    issuedQuantity: 9,
    maxDays: 30,
    location: 'Chemistry Store Room',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=500',
    status: 'Available',
    active: true
  },
  {
    equipmentId: 'EQ-004',
    name: 'Digital Multimeter True-RMS',
    category: 'Electronics',
    description: 'True-RMS digital multimeter with auto-ranging, temperature, and continuity test functions.',
    totalQuantity: 25,
    availableQuantity: 15,
    issuedQuantity: 10,
    maxDays: 5,
    location: 'EE Lab - Rack 4',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500',
    status: 'Available',
    active: true
  },
  {
    equipmentId: 'EQ-005',
    name: 'Arduino UNO Starter Kit',
    category: 'Electronics',
    description: 'Arduino UNO Rev3 Starter Pack complete with sensors, jumper wires, and breadboard.',
    totalQuantity: 20,
    availableQuantity: 12,
    issuedQuantity: 8,
    maxDays: 7,
    location: 'Robotics Workshop',
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=500',
    status: 'Available',
    active: true
  }
];

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('[Seed] Database connection established.');

    // Clear existing collections
    await User.deleteMany();
    await Equipment.deleteMany();
    await Transaction.deleteMany();
    console.log('[Seed] Cleared existing Users, Equipment, and Transactions.');

    // Insert sample users (using User.create to trigger password hash pre-save hook)
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`[Seed] Seeded ${createdUsers.length} sample users.`);

    // Insert sample equipment
    const createdEquipment = await Equipment.insertMany(sampleEquipment);
    console.log(`[Seed] Seeded ${createdEquipment.length} sample equipment items.`);

    // Create a sample transaction linking student to equipment
    const studentUser = createdUsers.find(u => u.role === 'student');
    const sampleItem = createdEquipment[0];

    if (studentUser && sampleItem) {
      const sampleTransaction = {
        transactionId: 'TXN-2026-001',
        student: studentUser._id,
        studentId: studentUser.studentId,
        studentName: studentUser.name,
        equipment: sampleItem._id,
        equipmentId: sampleItem.equipmentId,
        equipmentName: sampleItem.name,
        quantity: 1,
        issueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // in 11 days
        status: 'Issued',
        condition: 'Good',
        finePerDay: Number(process.env.FINE_PER_DAY) || 10,
        purpose: 'Coursework Study'
      };

      await Transaction.create(sampleTransaction);
      console.log('[Seed] Seeded 1 sample equipment transaction.');
    }

    console.log('[Seed] Database seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB for cleanup...');
    await mongoose.connect(mongoURI);
    await User.deleteMany();
    await Equipment.deleteMany();
    await Transaction.deleteMany();
    console.log('[Seed] All database records destroyed.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
  destroyData();
} else {
  seedData();
}
