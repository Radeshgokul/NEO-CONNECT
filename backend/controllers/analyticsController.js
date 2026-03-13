const Case = require('../models/Case');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Secretariat, Admin
const getAnalytics = async (req, res) => {
  // Aggregate Cases by Department
  const casesByDept = await Case.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } }
  ]);

  // Aggregate Cases by Status
  const casesByStatus = await Case.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Aggregate Cases by Category
  const casesByCategory = await Case.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  // Hotspot Detection (5+ cases, same dept + category)
  const hotspotsData = await Case.aggregate([
    { $group: { 
        _id: { department: '$department', category: '$category' }, 
        count: { $sum: 1 } 
      } 
    },
    { $match: { count: { $gte: 5 } } }
  ]);

  const hotspots = hotspotsData.map(h => ({
    department: h._id.department,
    category: h._id.category,
    count: h.count
  }));

  res.json({
    casesByDept: casesByDept.map(c => ({ name: c._id, value: c.count })),
    casesByStatus: casesByStatus.map(c => ({ name: c._id, value: c.count })),
    casesByCategory: casesByCategory.map(c => ({ name: c._id, value: c.count })),
    hotspots
  });
};

module.exports = { getAnalytics };
