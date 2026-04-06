const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const blogController = require('../controllers/blogController');
const locationController = require('../controllers/locationController');
const testimonialController = require('../controllers/testimonialController');
const categoryController = require('../controllers/categoryController');
const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');

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

// Category routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/show', categoryController.getAllCategories); // For compatibility with frontend's current call
router.get('/categories/show/:type', categoryController.getCategoryByType);

// Event routes
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);

// Comment routes
router.get('/comments', commentController.getAllComments);
router.post('/comments/add', commentController.addComment);

module.exports = router;