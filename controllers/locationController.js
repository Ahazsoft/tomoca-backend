const StoreLocation = require('../models/StoreLocation');

const getAllLocations = async (req, res) => {
  try {
    const locations = await StoreLocation.find({});
    res.json(locations);
  } catch (error) {
    console.error('Error fetching store locations:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export both functions with the names used in the routes
exports.getAllLocations = getAllLocations;
exports.getAllStoreLocations = getAllLocations;