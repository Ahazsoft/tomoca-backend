const mongoose = require('mongoose');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const StoreLocation = require('./models/StoreLocation');
const Testimonial = require('./models/Testimonial');
const Category = require('./models/Category');
const Event = require('./models/Event');
const Comment = require('./models/Comment');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tomocadb');
    
    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      Blog.deleteMany({}),
      StoreLocation.deleteMany({}),
      Testimonial.deleteMany({}),
      Category.deleteMany({}),
      Event.deleteMany({}),
      Comment.deleteMany({})
    ]);
    
    // Insert sample products
    const sampleProducts = [
      {
        id: 1,
        title: "Tin Can Ground Coffee",
        subtitle: "200 grm",
        price: 72,
        discount: 0,
        status: "in-stock",
        parent: "Coffee",
        children: "ground",
        brand: { name: "Tomoca" },
        imageURLs: [{ img: '/assets/img/product/featured/1.jpg', color: { name: "brown", clrCode: "#5C4033" } }],
        description: "Premium ground coffee in a convenient tin package",
        category: "Coffee",
        stock: 50,
        featured: true,
        bgColor: '#D35F44',
        label: 'Limited Release',
        labelColor: '#DB6C2F'
      },
      {
        id: 2,
        title: "Beans / Ground Coffee",
        subtitle: "100 grm",
        price: 98,
        discount: 10,
        status: "in-stock",
        parent: "Coffee",
        children: "beans",
        brand: { name: "Tomoca" },
        imageURLs: [{ img: '/assets/img/product/featured/2.jpg', color: { name: "dark", clrCode: "#333333" } }],
        description: "Fresh roasted coffee beans, available in both whole bean and ground options",
        category: "Coffee",
        stock: 30,
        featured: true,
        bgColor: '#DB6C2F'
      },
      {
        id: 3,
        title: "Beans / Ground Coffee",
        subtitle: "375 grm",
        price: 133,
        discount: 0,
        status: "in-stock",
        parent: "Coffee",
        children: "ground",
        brand: { name: "Tomoca" },
        imageURLs: [{ img: '/assets/img/product/featured/3.jpg', color: { name: "black", clrCode: "#000000" } }],
        description: "Premium 375g package of ground coffee",
        category: "Coffee",
        stock: 40,
        featured: true,
        bgColor: '#E14829'
      },
      {
        id: 4,
        title: "Bean / Ground Coffee",
        subtitle: "500 grm",
        price: 110,
        discount: 0,
        status: "in-stock",
        parent: "Coffee",
        children: "ground",
        brand: { name: "Tomoca" },
        imageURLs: [{ img: '/assets/img/product/featured/4.jpg', color: { name: "brown", clrCode: "#5C4033" } }],
        description: "Our massive 500g package of signature coffee",
        category: "Coffee",
        stock: 25,
        featured: true,
        bgColor: '#D35F44',
        label: 'Best Seller',
        labelColor: '#DB6C2F'
      }
    ];
    
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log('Products added to database');
    
    // Insert sample categories
    const sampleCategories = [
      { id: 1, parent: "Dark Roast", type: "coffee", img: "/assets/img/category/category-1.jpg", products: [insertedProducts[0]._id, insertedProducts[1]._id] },
      { id: 2, parent: "Medium Roast", type: "coffee", img: "/assets/img/category/category-2.jpg", products: [insertedProducts[2]._id] },
      { id: 3, parent: "Light Roast", type: "coffee", img: "/assets/img/category/category-3.jpg", products: [insertedProducts[3]._id] },
      { id: 4, parent: "Specialty", type: "coffee", img: "/assets/img/category/category-4.jpg", products: [] },
    ];
    await Category.insertMany(sampleCategories);
    console.log('Categories added to database');

    // Insert sample events
    const sampleEvents = [
      {
        id: 1,
        title: 'Gize BeTomoca',
        description: 'A cultural journey at Legehar Train Station with curated music, history, and the finest Tomoca coffee.',
        image: '/assets/img/events/GizebeTomoca.jpg',
        color: '#CB9458',
        textColor: '#3B2314',
        buttonBgColor: '#3B2314',
        buttonText: 'Explore',
        link: '/events/gize-betomoca',
      },
      {
        id: 2,
        title: 'Piassa Stories',
        description: 'Jazz-filled nights and heritage tales from Addis iconic Piassa district.',
        image: '/assets/img/events/EdgarDegas.jpg',
        color: '#8D5534',
        textColor: '#FFF4E6',
        buttonBgColor: '#FFF4E6',
        buttonText: 'Reserve Spot',
        link: '/events/piassa-stories',
      },
      {
        id: 3,
        title: 'Coffee & Culture',
        description: 'Tomoca finest brews paired with poetry and music. A warm blend of aroma and artistry.',
        image: '/assets/img/events/SteamandStitch.jpg',
        color: '#461C12',
        textColor: '#F3E5DC',
        buttonBgColor: '#F3E5DC',
        buttonText: 'Join Now',
        link: '/event-details',
      },
    ];
    await Event.insertMany(sampleEvents);
    console.log('Events added to database');

    // Insert sample blogs
    const sampleBlogs = [
      {
        id: 7,
        img: '/assets/img/blog/blog1.png',
        date: 'July 21, 2023',
        author: 'John Smith',
        comments: 2,
        tags: ["Coffee", "Art", "Culture"],
        category: 'Coffee Culture',
        title: 'In the Depths of the Roast: Celebrating Tomoca’s Bar Type Dark Roast',
        desc: 'There’s a certain magic in darkness. Quiet, confident, and unapologetically bold, darkness draws you in, and nowhere is that more true than in a cup of Tomoca’s Bar Type dark roast',
        blog: 'blog-postbox'
      },
      {
        id: 8,
        img: '/assets/img/blog/blog2.png',
        date: 'April 18, 2023',
        author: 'Mark Smith',
        comments: 5,
        tags: ["History", "Heritage", "Ethiopia"],
        category: 'Legacy',
        title: 'The Heartbeat of Ethiopian Coffee: Discovering Tomoca’s Legacy',
        desc: 'In the bustling streets of Addis Ababa, a legend brews quietly but powerfully—Tomoca Coffee. More than just a brand, Tomoca embodies the rich heritage of Ethiopian coffee culture, offering every cup as a heartfelt tribute to tradition, passion, and quality.',
        blog: 'blog-postbox'
      }
    ];
    await Blog.insertMany(sampleBlogs);
    console.log('Blogs added to database');

    // Insert sample comments
    const sampleComments = [
      { id: 1, blogId: 7, name: 'Abebe Solomon', date: '12 April, 2023 at 3.50pm', comment: 'By defining and following internal and external processes, your team will have clarity on resources to attract and retain customers for your business.', user: '/assets/img/users/user-2.jpg' },
      { id: 2, blogId: 7, name: 'Elias Leulseged', date: '20 April, 2023 at 3.50pm', comment: 'By defining and following internal and external processes, your team will have clarity on resources to attract and retain customers for your business.', user: '/assets/img/users/user-4.jpg' }
    ];
    await Comment.insertMany(sampleComments);
    console.log('Comments added to database');
    
    // Insert sample testimonials
    const sampleTestimonials = [
      { id: 1, review: 5, desc: '“The best coffee beans I have ever tried. The dark roast is incredibly bold and flavorful.”', name: 'Theodore Handle', designation: 'Coffee Enthusiast', type: 'coffee' },
      { id: 2, review: 5, desc: '“Tomoca transformed my morning routine. Their historical Piassa location is a must-visit.”', name: 'Selamawit Tesfaye', designation: 'Regular Client', type: 'coffee' }
    ];
    await Testimonial.insertMany(sampleTestimonials);
    console.log('Testimonials added to database');

    // Insert sample locations
    const sampleLocations = [
      {
        id: 1,
        name: "Tomoca Piassa (Historical)",
        address: "Piassa, Addis Ababa",
        img: '/assets/img/locations/Lagare.jpg', // Reusing Lagare img as placeholder
        location: 'https://maps.app.goo.gl/1ACRd6TiTj5c3mCQ8',
        coordinates: { lat: 9.0309, lng: 38.7507 },
        hours: '7:00 AM - 9:00 PM',
        contact: '+251 11 111 2222',
        description: 'The original and most famous Tomoca location since 1953.'
      },
      {
        id: 2,
        name: "Tomoca Welo Sefer (Bole)",
        address: "Bole Rd, Addis Ababa",
        img: '/assets/img/locations/WeloSefer.jpg',
        location: 'https://maps.app.goo.gl/FhuPtSfrvczcw8tn9',
        coordinates: { lat: 8.9958, lng: 38.7861 },
        hours: '6:30 AM - 10:00 PM',
        contact: '+251 11 333 4444',
        description: 'Convenient Bole Road branch for the business district.'
      },
      {
        id: 3,
        name: "Tomoca Kazanchis",
        address: "Kazanchis, Addis Ababa",
        img: '/assets/img/locations/Lagare.jpg',
        location: 'https://maps.app.goo.gl/1ACRd6TiTj5c3mCQ8',
        coordinates: { lat: 9.0232, lng: 38.7674 },
        hours: '7:00 AM - 9:30 PM',
        contact: '+251 11 555 6666',
        description: 'Serving the vibrant Kazanchis area with premium brews.'
      }
    ];
    await StoreLocation.insertMany(sampleLocations);
    console.log('Store locations added to database');

    console.log('All seed data successfully inserted for Tomoca!');
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