const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentId: {
      type: String,
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    equipmentId: {
      type: String,
      required: true
    },
    equipmentName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['Issued', 'Returned', 'Overdue', 'Lost', 'Damaged'],
      default: 'Issued'
    },
    condition: {
      type: String,
      enum: ['Good', 'Damaged', 'Lost'],
      default: 'Good'
    },
    finePerDay: {
      type: Number,
      default: 10
    },
    overdueDays: {
      type: Number,
      default: 0
    },
    totalFine: {
      type: Number,
      default: 0
    },
    purpose: {
      type: String,
      default: 'Academic / Lab Work'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
