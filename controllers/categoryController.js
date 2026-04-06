const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }
    const categories = await Category.find(query).populate('products');
    res.status(200).json({
      success: true,
      result: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategoryByType = async (req, res) => {
  try {
    const { type } = req.params;
    const categories = await Category.find({ type }).populate('products');
    res.status(200).json({
      success: true,
      result: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
