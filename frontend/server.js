const express = require('express'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const data = require('./data');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// MongoDB connection
mongoose.set('strictQuery', true); // avoids deprecation warnings
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: { type: Number, required: true },
  category: String,
});

const Product = mongoose.model('products', productSchema);

// Routes

// Seed products
app.get('/api/products/seed', async (req, res) => {
  try {
    console.log('Seeding products...');
    const products = await Product.insertMany(data.products);
    res.send({ products });
  } catch (err) {
    console.error('Insert failed:', err);
    res.status(500).send({ message: 'Failed to insert products', error: err.message });
  }
});

// Get products
app.get('/api/products', async (req, res) => {
  const category = req.query.category;
  try {
    let products;
    if (category) {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }
    res.send(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send({ message: 'Failed to fetch products', error: err.message });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  try {
    console.log('Adding new product:', req.body);
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.send(savedProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).send({ message: 'Failed to save product', error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});



app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Catch-all route for unknown endpoints
app.use((req, res) => {
  res.status(404).send({ message: 'Endpoint not found' });
});
