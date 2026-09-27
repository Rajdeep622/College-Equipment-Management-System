const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: String,
      required: [true, 'Equipment ID is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Equipment Name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Academic', 'Electronics', 'Lab Tools', 'Computer Hardware', 'Networking', 'Books', 'Other'],
      default: 'Academic'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available Quantity is required'],
      min: [0, 'Available quantity cannot be negative']
    },
    issuedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Issued quantity cannot be negative']
    },
    maxDays: {
      type: Number,
      required: [true, 'Maximum Issue Duration in days is required'],
      default: 7,
      min: [1, 'Maximum issue duration must be at least 1 day']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500'
    },
    status: {
      type: String,
      enum: ['Available', 'Maintenance', 'Deactivated'],
      default: 'Available'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
