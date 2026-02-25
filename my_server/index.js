const express = require('express');
const cors = require('cors');
const app = express()
const port = 3000

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// localhost:3000/127.0.0.1 => "Hello"
app.get("/", (req, res) => {
    res.send('Hello')
})
// localhost:3000/products => product list
// app.get('/products', (req, res) => {
    // res.send([
    //     {
    //         productCode: 1, productName: 'Heineken', productPrice: 19000
    //     },
    //     {
    //         productCode: 2, productName: 'Tiger', productPrice: 18000
    //     },
    //     {
    //         productCode: 3, productName: 'Sapporo', productPrice: 21000
    //     }

    // ])

    // Load Dâta from MongoDB
    // Product.find({})
    //     .then(data => res.json(data))
    //     .catch(err => res.status(500).json({ error: err.message }));
    // });

// Import Routes
const exampleRoute = require('./routes/example.router');
app.use('/api', exampleRoute);

app.listen(port, () => {
    console.log(`Example app listening port ${port}`)
})