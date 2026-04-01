const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const blogController = require('../controllers/blogController');
const locationController = require('../controllers/locationController');
const testimonialController = require('../controllers/testimonialController');

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);

// Blog routes
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlogById);

// Location routes
router.get('/store-locations', locationController.getAllStoreLocations);

// Testimonial routes
router.get('/testimonials', testimonialController.getAllTestimonials);
router.get('/testimonials/:id', testimonialController.getTestimonialById);

module.exports = router;