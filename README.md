# Tomoca Backend API

Backend API for the Tomoca Coffee website - a modern coffee shop platform built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- MongoDB integration with Mongoose ODM
- CORS support
- Environment configuration
- Data seeding functionality
- Comprehensive data models for products, blogs, testimonials, and store locations

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or cloud instance)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tomoca-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory and define the following environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tomocadb
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seeding Sample Data
To populate the database with sample products, blogs, and store locations:
```bash
npm run seed
```

## API Endpoints

The API is served from the `/api` base path:

- `GET /api` - Health check endpoint
- Products: `/api/products`
- Blogs: `/api/blogs`
- Store Locations: `/api/locations`
- Testimonials: `/api/testimonials`

## Project Structure

```
tomoca-backend/
├── controllers/     # Request handlers
├── models/          # Mongoose models
├── routes/          # API route definitions
├── seedData.js      # Data seeding script
├── index.js         # Main server file
└── README.md
```

## Models

- **Product**: Coffee products with details like title, price, description, images, etc.
- **Blog**: Blog posts about coffee culture and news
- **StoreLocation**: Physical store locations with coordinates and contact info
- **Testimonial**: Customer reviews and feedback

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue in the repository.