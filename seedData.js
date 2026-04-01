const mongoose = require('mongoose');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const StoreLocation = require('./models/StoreLocation');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tomocadb');
    
    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      Blog.deleteMany({}),
      StoreLocation.deleteMany({})
    ]);
    
    // Insert sample products
    const sampleProducts = [
      {
        title: "Tin Can Ground Coffee",
        subtitle: "200 grm",
        price: 72,
        discount: 0,
        status: "in-stock",
        parent: "Coffee",
        children: "ground",
        brand: { name: "Tomoca" },
        imageURLs: [{ img: 'path/to/coffee1.jpg', color: { name: "brown", clrCode: "#5C4033" } }],
        description: "Premium ground coffee in a convenient tin package",
        category: "Coffee",
        stock: 50
      },
      {
        title: "Beans / Ground Coffee",
        subtitle: "100 grm",
        price: 98,
        discount: 10,
        status: "in-stock",
        parent: "Coffee",
        children: "beans",
        brand: { name: "Tomoca" },
        imageURLs: [{ img: 'path/to/coffee2.jpg', color: { name: "dark", clrCode: "#333333" } }],
        description: "Fresh roasted coffee beans, available in both whole bean and ground options",
        category: "Coffee",
        stock: 30
      },
      {
        title: "Beans / Ground Coffee",
        subtitle: "375 grm",
        price: 133,
        discount: 0,
        status: "in-stock",
        parent: "Coffee",
        children: "ground",
        brand: { name: "Tomoca" },
        imageURLs: [{ img: 'path/to/coffee3.jpg', color: { name: "black", clrCode: "#000000" } }],
        description: "Premium 375g package of ground coffee",
        category: "Coffee",
        stock: 40
      }
    ];
    
    await Product.insertMany(sampleProducts);
    console.log('Sample products added to database');
    
    // Insert sample blogs
    const sampleBlogs = [
      {
        id: 10,
        img: 'path/to/blog1.jpg',
        date: 'January 20, 2023',
        author: 'Salim Rana',
        comments: 10,
        tags: ["Coffee", "Ethiopia", "News"],
        category: 'Coffee Culture',
        title: 'From Bean to Brew: The Artistry Behind Tomoca’s Signature Blend',
        desc: 'Crafting the perfect cup of coffee is an art—and Tomoca masters it with every roast. From carefully selected beans to meticulous roasting techniques, Tomoca’s signature blend tells a story of dedication, flavor, and an unwavering commitment to excellence.',
        blog: 'blog-postbox',
        featured: true
      },
      {
        id: 11,
        img: 'path/to/blog2.jpg',
        date: 'February 20, 2023',
        author: 'Smith Mark',
        comments: 12,
        tags: ["Coffee", "Sensory", "Experience"],
        category: 'Coffee Culture',
        title: 'Awakening the Senses: Why Tomoca’s Coffee is a Journey, Not Just a Drink',
        desc: 'Coffee is more than a morning ritual—it’s a sensory experience. Tomoca transforms every sip into a journey through Ethiopia’s lush coffee landscapes, capturing the essence of its origin and awakening flavors that linger long after the last drop.',
        blog: 'blog-postbox',
        featured: true
      }
    ];
    
    await Blog.insertMany(sampleBlogs);
    console.log('Sample blogs added to database');
    
    // Insert sample locations
    const sampleLocations = [
      {
        name: "Tomoca Central Store",
        address: "Bole Road, Addis Ababa, Ethiopia",
        coordinates: { lat: 9.03, lng: 38.74 },
        hours: "7:00 AM - 9:00 PM",
        contact: "+251 11 123 4567",
        description: "Our flagship store in the heart of Addis Ababa"
      },
      {
        name: "Tomoca Piazza",
        address: "Piazza, Addis Ababa, Ethiopia",
        coordinates: { lat: 9.02, lng: 38.75 },
        hours: "6:00 AM - 10:00 PM",
        contact: "+251 11 987 6543",
        description: "Historic Tomoca location with traditional atmosphere"
      }
    ];
    
    await StoreLocation.insertMany(sampleLocations);
    console.log('Sample store locations added to database');
    
    console.log('Seed data successfully inserted!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;