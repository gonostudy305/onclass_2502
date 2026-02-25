const express = require("express")
const router = express.Router();

//Connect to MongoDB
const db = require('../config/db');
db.connect();

// Impert Product model
const Product = require('../models/product');

// Define routes here
router.get("/", (req, res) => {
        res.send("OK");
});

// Get all products
router.get("/products", (req, res) => {
    // Load data from MongoDB
    Product.find({})
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Get all products (2)
router.get("/allproduct", async (req, res) => {
    try {
        let products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by id
router.get("/:id", async(req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.json({ message: err.message });
    }
});
// Insert product
// Post product
router.post("/products", async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price
        });
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// UPDATE (PUT)
router.put("/products/:id", async (req, res) => {
    try {
        await Product.updateOne({ _id: req.params.id }, {$set: {name: req.body.name, price: req.body.price}});
        res.json({ message: "Product updated successfully" });
    }catch(err){
        res.json({ message: err.message });
    }
});

// UPDATE (PATCH)
router.patch("/products/:id", async (req, res) => {
    try {
        await Product.updateOne({ _id: req.params.id }, {$set: req.body});
        res.json({ message: "Product updated successfully" });
    }catch(err){
        res.json({ message: err.message });
    }
});

// DELETE
router.delete("/products/:id", async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;