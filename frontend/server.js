const express = require('express'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const data = require('./data');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Product = mongoose.model(
  'products',
  new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    price: Number,
    category: String,
  })
);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // only start the server AFTER connection is ready
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// routes
app.get('/api/products/seed', async (req, res) => {
  try {
    const products = await Product.insertMany(data.products);
    res.send({ products });
  } catch (err) {
    console.error('Insert failed:', err);
    res.status(500).send({ message: 'Failed to insert products', error: err.message });
  }
});

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
    res.status(500).send({ message: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.send(savedProduct);
});

app.get('/api/categories', (req, res) => {
  res.send(data.categories);
});
