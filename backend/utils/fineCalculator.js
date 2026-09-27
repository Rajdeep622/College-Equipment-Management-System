/**
 * Calculates overdue days and penalty fine on backend.
 * Formula: Fine = overdueDays * finePerDay * quantity
 * 
 * @param {Date|String} dueDate - Promised return date
 * @param {Date|String} returnDate - Actual return date (or today's date if checking active status)
 * @param {Number} quantity - Issued item quantity
 * @param {Number} ratePerDay - Daily fine rate per item (default ₹10)
 * @returns {Object} { overdueDays, totalFine, status }
 */
const calculateFine = (dueDate, returnDate = new Date(), quantity = 1, ratePerDay = 10) => {
  const due = new Date(dueDate);
  const ret = new Date(returnDate);

  // Strip time component for pure day comparison
  due.setHours(0, 0, 0, 0);
  ret.setHours(0, 0, 0, 0);

  if (ret <= due) {
    return {
      overdueDays: 0,
      totalFine: 0,
      isOverdue: false
    };
  }

  const diffTime = ret.getTime() - due.getTime();
  const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const rate = Number(process.env.FINE_PER_DAY) || ratePerDay || 10;
  const totalFine = overdueDays * rate * Math.max(1, quantity);

  return {
    overdueDays,
    totalFine,
    isOverdue: true
  };
};

module.exports = { calculateFine };
