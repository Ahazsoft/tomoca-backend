const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.atlas
dotenv.config({ path: path.join(__dirname, '.env.atlas') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI not found in .env.atlas');
  process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB Atlas!");

    const db = client.db("tomocadb");

    // Clear existing data
    console.log("Cleaning existing collections...");
    const collections = ['products', 'blogs', 'storelocations', 'testimonials', 'categories', 'events', 'comments'];
    for (const col of collections) {
      await db.collection(col).deleteMany({});
    }

    // ─────────────────────────────────────────────────────────────
    // PRODUCTS
    // ─────────────────────────────────────────────────────────────
    const sampleProducts = [
      {
        id: 1,
        title: 'Tin Can Ground Coffee',
        subtitle: '200 grm',
        price: 72,
        discount: 0,
        status: 'in-stock',
        parent: 'Coffee',
        children: 'ground',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/1.jpg' }],
        description: 'Packed in an iconic tin can, this 200g ground coffee preserves Tomoca\'s freshest roast profile.',
        category: 'Coffee',
        stock: 50,
        featured: true,
        bgColor: '#D35F44',
      },
      {
        id: 2,
        title: 'Beans / Ground Coffee',
        subtitle: '100 grm',
        price: 98,
        discount: 0,
        status: 'in-stock',
        parent: 'Coffee',
        children: 'beans',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/2.jpg' }],
        description: 'Available as whole beans or pre-ground, this compact 100g pack is perfect for single-cup brewers.',
        category: 'Coffee',
        stock: 50,
        featured: true,
        bgColor: '#DB6C2F',
      },
      {
        id: 3,
        title: 'Beans / Ground Coffee',
        subtitle: '375 grm',
        price: 133,
        discount: 0,
        status: 'in-stock',
        parent: 'Coffee',
        children: 'ground',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/3.jpg' }],
        description: 'A generous 375g package offering Tomoca\'s signature medium-roast blend.',
        category: 'Coffee',
        stock: 50,
        featured: true,
        bgColor: '#E14829',
      },
      {
        id: 4,
        title: 'Bean / Ground Coffee',
        subtitle: '500 grm',
        price: 110,
        discount: 0,
        status: 'in-stock',
        parent: 'Coffee',
        children: 'ground',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/4.jpg' }],
        description: 'Our largest standard package — 500g of premium Tomoca coffee.',
        category: 'Coffee',
        stock: 50,
        featured: true,
        bgColor: '#D35F44',
      },
      {
        id: 5,
        title: 'Tote Bag',
        subtitle: 'Canvas Print',
        price: 110,
        discount: 0,
        status: 'in-stock',
        parent: 'Accessories',
        children: 'merchandise',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/5.jpg' }],
        description: 'Stylish canvas tote bag featuring floral Tomoca artwork.',
        category: 'Accessories',
        stock: 50,
        featured: true,
        bgColor: '#3B2314',
      },
      {
        id: 6,
        title: 'TShirt',
        subtitle: 'Cotton Blend',
        price: 110,
        discount: 0,
        status: 'in-stock',
        parent: 'Accessories',
        children: 'merchandise',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/6.jpg' }],
        description: 'Comfortable premium cotton T-shirt with the Tomoca heritage roast graphic.',
        category: 'Accessories',
        stock: 50,
        featured: true,
        bgColor: '#CB9458',
      },
      {
        id: 7,
        title: 'Bialetti',
        subtitle: 'Moka Pot',
        price: 110,
        discount: 0,
        status: 'in-stock',
        parent: 'Accessories',
        children: 'brewing',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/7.jpg' }],
        description: 'Classic Bialetti moka pot for authentic stovetop espresso.',
        category: 'Accessories',
        stock: 50,
        featured: true,
        bgColor: '#D4A96A',
      },
      {
        id: 8,
        title: 'Tote Bag #1',
        subtitle: 'Limited Edition',
        price: 110,
        discount: 0,
        status: 'in-stock',
        parent: 'Accessories',
        children: 'merchandise',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/8.jpg' }],
        description: 'Specially designed tote bag celebrating Tomoca\'s 1953 legacy.',
        category: 'Accessories',
        stock: 50,
        featured: true,
        bgColor: '#8D5534',
      },
      {
        id: 9,
        title: 'Tote Bag #2',
        subtitle: 'Artist Series',
        price: 110,
        discount: 0,
        status: 'in-stock',
        parent: 'Accessories',
        children: 'merchandise',
        brand: { name: 'Tomoca' },
        imageURLs: [{ img: '/assets/img/product/featured/9.jpg' }],
        description: 'A vibrant tote bag from our artist collaboration series.',
        category: 'Accessories',
        stock: 50,
        featured: true,
        bgColor: '#461C12',
      },
    ];

    const productResult = await db.collection("products").insertMany(sampleProducts);
    console.log(`✓ Products seeded: ${productResult.insertedCount}`);

    // mapping IDs for categories
    const products = await db.collection("products").find({}).toArray();
    const coffeeIds = products.filter(p => p.category === 'Coffee').map(p => p._id);
    const accessoryIds = products.filter(p => p.category === 'Accessories').map(p => p._id);

    // ─────────────────────────────────────────────────────────────
    // CATEGORIES
    // ─────────────────────────────────────────────────────────────
    const sampleCategories = [
      {
        id: 1,
        parent: 'Coffee',
        type: 'coffee',
        img: '/assets/img/category/category-1.jpg',
        products: coffeeIds,
      },
      {
        id: 2,
        parent: 'Accessories',
        type: 'accessories',
        img: '/assets/img/category/category-6.jpg',
        products: accessoryIds,
      },
    ];
    await db.collection("categories").insertMany(sampleCategories);
    console.log(`✓ Categories seeded: ${sampleCategories.length}`);

    // ─────────────────────────────────────────────────────────────
    // STORE LOCATIONS
    // ─────────────────────────────────────────────────────────────
    const locations = [
      {
        id: 1,
        name: 'Tomoca Piassa (Historical)',
        address: 'Piassa, Addis Ababa',
        img: '/assets/img/locations/Historical.jpg',
        coordinates: { lat: 9.0309, lng: 38.7507 },
        hours: '7:00 AM - 9:00 PM',
        contact: '+251 11 111 2222',
        description: 'The original Tomoca location since 1953.',
      },
      {
        id: 2,
        name: 'Tomoca Welo Sefer (Bole)',
        address: 'Welo Sefer, Bole Rd, Addis Ababa',
        img: '/assets/img/locations/Sefer.jpg',
        coordinates: { lat: 8.9958, lng: 38.7861 },
        hours: '6:30 AM - 10:00 PM',
        contact: '+251 11 333 4444',
        description: 'Convenient Bole Road branch for the business district.',
      },
      {
        id: 3,
        name: 'Tomoca Bishoftu',
        address: 'Bishoftu, Oromia, Ethiopia',
        img: '/assets/img/locations/.jpg',
        coordinates: { lat: 8.7514, lng: 38.9642 },
        hours: '6:30 AM - 9:30 PM',
        contact: '+251 11 555 6666',
        description: 'Serving the Bishoftu community with premium Ethiopian coffee.',
      },
    ];
    await db.collection("storelocations").insertMany(locations);
    console.log(`✓ Store locations seeded: ${locations.length}`);

    // ─────────────────────────────────────────────────────────────
    // BLOGS
    // ─────────────────────────────────────────────────────────────
    const blogs = [
      {
        id: 1,
        img: '/assets/img/blog/blog1.png',
        date: "14 January, 2023",
        author: 'Mark Smith',
        title: "In the Depths of the Roast: Celebrating Tomoca’s Bar Type Dark Roast",
        tags: ["Tablet", "News"],
        category: 'electronics',
        comments: 2,
        sm_desc: "The world is an amazing place providing an incredible assortment of interesting locations across.",
        blog: "electronics",
      },
      {
        id: 2,
        img: '/assets/img/blog/blog3.png',
        date: "18 February, 2023",
        author: 'Naim Ahmed',
        title: "From Bean to Brew: The Artistry Behind Tomoca’s Signature Blend",
        tags: ["Monitor", "Technology"],
        category: 'electronics',
        comments: 4,
        sm_desc: "The world is an amazing place providing an incredible assortment of interesting locations across.",
        blog: "electronics",
      },
      {
        id: 3,
        img: '/assets/img/blog/blog4.png',
        date: "20 January, 2023",
        author: 'Salim Rana',
        title: "Awakening the Senses: Why Tomoca’s Coffee is a Journey, Not Just a Drink",
        tags: ["Microphone", "Computer"],
        category: 'electronics',
        comments: 5,
        sm_desc: "The world is an amazing place providing an incredible assortment of interesting locations across.",
        blog: "electronics",
      },
      {
        id: 4,
        img: '/assets/img/blog/2/blog-1.jpg',
        date: "20 July, 2023",
        author: 'John Smith',
        title: "The 'Boomerang' Employees Returning After Quitting",
        tags: ["Fashion", "Lift Style", "News"],
        category: 'fashion',
        comments: 6,
        sm_desc: "The world is an amazing place providing an incredible assortment of interesting locations across.",
        blog: "fashion",
      },
      {
        id: 5,
        img: '/assets/img/blog/2/blog-2.jpg',
        date: "18 March, 2023",
        author: 'John Smith',
        title: "In the Depths of the Roast: Celebrating Tomoca’s Bar Type Dark Roast",
        tags: ["Fashion", "Lift Style", "News"],
        category: 'fashion',
        comments: 3,
        sm_desc: "The world is an amazing place providing an incredible assortment of interesting locations across.",
        blog: "fashion",
      },
      {
        id: 6,
        img: '/assets/img/blog/2/blog-3.jpg',
        date: "15 February, 2023",
        author: 'John Smith',
        title: "The Sound Of Fashion: Malcolm McLaren Words",
        tags: ["Fashion", "Lift Style", "News"],
        category: 'fashion',
        comments: 8,
        sm_desc: "The world is an amazing place providing an incredible assortment of interesting locations across.",
        blog: "fashion",
      },
      {
        id: 7,
        img: '/assets/img/blog/blog1.png',
        date: 'July 21, 2023',
        author: 'John Smith',
        comments: 2,
        tags: ["Fashion", "Lift Style", "News"],
        category: 'Beauty',
        title: 'In the Depths of the Roast: Celebrating Tomoca’s Bar Type Dark Roast',
        desc: 'There’s a certain magic in darkness. Quiet, confident, and unapologetically bold, darkness draws you in, and nowhere is that more true than in a cup of Tomoca’s Bar Type dark roast',
        blog: 'blog-postbox',
        featured: true,
      },
      {
        id: 8,
        img: '/assets/img/blog/blog2.png',
        date: 'April 18, 2023',
        author: 'Mark Smith',
        comments: 5,
        tags: ["Fashion", "Lift Style", "News"],
        category: 'Beauty',
        title: 'The Heartbeat of Ethiopian Coffee: Discovering Tomoca’s Legacy',
        desc: 'In the bustling streets of Addis Ababa, a legend brews quietly but powerfully—Tomoca Coffee. More than just a brand, Tomoca embodies the rich heritage of Ethiopian coffee culture, offering every cup as a heartfelt tribute to tradition, passion, and quality.',
        blog: 'blog-postbox'
      },
      {
        id: 9,
        date: 'March 15, 2023',
        comments: 8,
        tags: ["Fashion", "Lift Style", "News"],
        category: 'Beauty',
        title: 'A Legacy Brewed in Ethiopia',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
        blockquote: true,
        blog: 'blog-postbox'
      },
      {
        id: 10,
        img: '/assets/img/blog/blog3.png',
        date: 'January 20, 2023',
        author: 'Salim Rana',
        comments: 10,
        tags: ["Fashion", "Lift Style", "News"],
        category: 'Beauty',
        title: 'From Bean to Brew: The Artistry Behind Tomoca’s Signature Blend',
        desc: 'Crafting the perfect cup of coffee is an art—and Tomoca masters it with every roast. From carefully selected beans to meticulous roasting techniques, Tomoca’s signature blend tells a story of dedication, flavor, and an unwavering commitment to excellence.',
        blog: 'blog-postbox'
      },
      {
        id: 11,
        img: '/assets/img/blog/blog4.png',
        date: 'February 20, 2023',
        author: 'Smith Mark',
        comments: 12,
        tags: ["Fashion", "Lift Style", "News"],
        category: 'Beauty',
        title: 'Awakening the Senses: Why Tomoca’s Coffee is a Journey, Not Just a Drink',
        desc: 'Coffee is more than a morning ritual—it’s a sensory experience. Tomoca transforms every sip into a journey through Ethiopia’s lush coffee landscapes, capturing the essence of its origin and awakening flavors that linger long after the last drop.',
        blog: 'blog-postbox'
      },
      {
        id: 12,
        img: '/assets/img/blog/grid/blog-grid-1.jpg',
        date: 'January 8, 2023',
        author: 'John Smith',
        comments: 5,
        tags: ["Fashion", "Lift Style", "News"],
        category: 'Beauty',
        title: 'Hiring the Right Sales Team at the Right Time',
        desc: 'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
        blog: 'blog-grid'
      },
      {
        id: 13,
        img: '/assets/img/blog/grid/blog-grid-2.jpg',
        date: 'February 12, 2023',
        author: 'Salim Rana',
        comments: 0,
        tags: ["Fashion", "Lift Style", "News"],
        category: 'Beauty',
        title: 'Fully Embrace the Return of 90s fashion',
        desc: 'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
        blog: 'blog-grid'
      },
    ];
    await db.collection("blogs").insertMany(blogs);
    console.log(`✓ Blogs seeded: ${blogs.length}`);

    // ─────────────────────────────────────────────────────────────
    // TESTIMONIALS
    // ─────────────────────────────────────────────────────────────
    await db.collection("testimonials").insertMany([
      {
        id: 1,
        review: 5,
        desc: '"Simply the best coffee in Ethiopia."',
        name: 'Selamawit T.',
        designation: 'Regular Customer',
      }
    ]);
    console.log("✓ Testimonials seeded.");

    // ─────────────────────────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────────────────────────
    await db.collection("events").insertMany([
      {
        id: 1,
        title: 'ጊዜ በቶሞካ (Gize BeTomoca)',
        description: 'Nestled within the historic Legehar Train Station, ጊዜ በቶሞካ is an experience like no other...',
        image: '/assets/img/events/GizebeTomoca.jpg',
        buttonText: 'RSVP',
        date: 'Thursday, October 10, 2025',
        time: '5:00 PM to 7:00 PM',
        location: 'Addis Ababa, 4 Kilo, Next to Abrhot Library',
        color: '#3B2314',
        textColor: '#FFF4E6',
      },
      {
        id: 2,
        title: 'Piassa Stories',
        description: 'Jazz-filled nights and heritage tales from Addis’ iconic Piassa district.',
        image: '/assets/img/events/CoffeeforCare.jpg',
        buttonText: 'RSVP',
        date: 'Friday, October 17, 2025',
        time: '6:30 PM to 9:00 PM',
        location: 'Tomoca Piassa Branch',
        color: '#1A2F23',
        textColor: '#E8F5E9',
      },
      {
        id: 3,
        title: 'Coffee & Culture',
        description: 'Tomoca’s finest brews paired with poetry and music. A warm blend of aroma and artistry.',
        image: '/assets/img/events/EdgarDegas.jpg',
        buttonText: 'RSVP',
        date: 'Saturday, October 25, 2025',
        time: '4:00 PM to 6:00 PM',
        location: 'Tomoca, Kazanchis Branch',
        color: '#4A2B1D',
        textColor: '#FFE0B2',
      },
      {
        id: 4,
        title: 'Steam & Stitch',
        description: 'Where espresso meets art—explore Ethiopia’s young creative minds in motion.',
        image: '/assets/img/events/SteamandStitch.jpg',
        buttonText: 'RSVP',
        date: 'Wednesday, November 5, 2025',
        time: '5:00 PM to 8:00 PM',
        location: 'Addis Ababa, Design Week Tent',
        color: '#2D3436',
        textColor: '#DFE6E9',
      }
    ]);
    console.log("✓ Events seeded.");

    // ─────────────────────────────────────────────────────────────
    // COMMENTS
    // ─────────────────────────────────────────────────────────────
    const sampleComments = [
      {
        id: 1,
        name: 'Abebe Solomon',
        date: '12 April, 2023 at 3.50pm',
        comment: 'By defining and following internal and external processes, your team will have clarity on resources to attract and retain customers for your business.',
        blogId: 7,
        user: '/assets/img/users/user-2.jpg',
        children: {
          name: 'Selamawit Tesfaye',
          date: '15 April, 2023 at 5.50pm',
          comment: 'By defining and following internal and external processes, your team will have clarity on resources to attract and retain customers for your business.',
          user: '/assets/img/users/user-3.jpg'
        }
      },
      {
        id: 2,
        name: 'Elias Leulseged',
        date: '20 April, 2023 at 3.50pm',
        comment: 'By defining and following internal and external processes, your team will have clarity on resources to attract and retain customers for your business.',
        blogId: 7,
        user: '/assets/img/users/user-4.jpg'
      }
    ];
    await db.collection("comments").insertMany(sampleComments);
    console.log(`✓ Comments seeded: ${sampleComments.length}`);

    console.log("\n Atlas Seed Data successfully populated!");

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
