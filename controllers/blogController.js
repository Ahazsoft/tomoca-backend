const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
  try {
    const { category, tag, search, featured } = req.query;

    // Build dynamic filter object
    const filter = {};

    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    if (tag) {
      filter.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { desc: { $regex: new RegExp(search, 'i') } },
        { author: { $regex: new RegExp(search, 'i') } },
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    // Try to find by both _id (MongoDB default) and id (from seed data)
    const blog = await Blog.findOne({
      $or: [
        { _id: req.params.id },
        { id: parseInt(req.params.id) } // in case the id is numeric
      ]
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: error.message });
  }
};