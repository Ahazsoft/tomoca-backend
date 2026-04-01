const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, onSale, popular, sortBy, brand, status, search } = req.query;

    // Build dynamic filter object
    const filter = {};

    if (category) {
      // Match against parent, children, or category field
      filter.$or = [
        { parent: { $regex: new RegExp(category, 'i') } },
        { children: { $regex: new RegExp(category, 'i') } },
        { category: { $regex: new RegExp(category, 'i') } },
      ];
    }

    if (onSale === 'true') {
      filter.discount = { $gt: 0 };
    }

    if (status) {
      filter.status = status;
    }

    if (brand) {
      filter['brand.name'] = { $regex: new RegExp(brand, 'i') };
    }

    if (search) {
      const searchFilter = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
      // Merge with existing $or if present
      filter.$or = filter.$or ? [...filter.$or, ...searchFilter] : searchFilter;
    }

    // Build sort options
    let sort = { createdAt: -1 }; // default: newest first

    if (sortBy === 'rating') {
      // Since we don't have ratings stored, sort by price desc as a proxy
      sort = { price: -1 };
    } else if (sortBy === 'price_asc') {
      sort = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sort = { price: -1 };
    }

    // popular flag — in absence of a popularity score, return discounted items
    if (popular === 'true') {
      filter.discount = { ...(filter.discount || {}), $gte: 0 };
      sort = { discount: -1, createdAt: -1 };
    }

    const products = await Product.find(filter).sort(sort);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};