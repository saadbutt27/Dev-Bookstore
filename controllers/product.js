const formidable = require('formidable');
const fs=require('fs');
const _ = require('lodash');
const { Readable } = require('stream'); // Import Readable from stream
// Product Schema
const Product = require('../models/product');
// Handle database error
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.getRecommendations = async (req, res) => {
    const bookName = req.query.book_name;
    if (!bookName) {
        return res.status(400).send({ error: 'No book name provided' });
    }
    
    try {
        const response = await axios.get(`http://localhost:5000/recommend?book_name=${bookName}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to get recommendations' });
    }
};


// Find product by id
exports.productById = async(req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .exec((err, product) => {
        if(err || !product)
        {
            return res.status(400).json({msg: 'Product not found'});
        }

        req.product = product;
        next();
    });
};

// Backend route handler to fetch and stream PDF
exports.getPDF = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: "Product not found"
                });
            }
            if (!product.pdfFile.data) {
                return res.status(400).json({
                    error: "PDF not found"
                });
            }
            
            // Stream the PDF data directly to the response
            res.set('Content-Type', product.pdfFile.contentType);
            const stream = Readable.from(product.pdfFile.data); // Assuming product.pdfFile.data is a Buffer or streamable data
            stream.pipe(res);
        });
};


// Get a single product
exports.read = async(req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

// Create a new product
exports.create = async (req, res) => {
    // Formidable is used to handle form data. We are using it to handle file uploads.
    let form = new formidable.IncomingForm();
    form.keepExtensions = true; // Keep file extensions for uploaded files

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ msg: 'Image could not be uploaded' });
        }

        // Check for all required fields
        const { name, description, price, quantity, category, shipping } = fields;
        if (!name || !description || !price || !quantity || !category || !shipping) {
            return res.status(400).json({ err: 'All fields are required' });
        }

        // Create a new product instance
        let product = new Product(fields);

        // Handle photo file upload
        if (files.photo) {
            // console.log("Photo")
            // Validate file size less than 1 MB
            if (files.photo.size > 1000000) {
                return res.status(400).json({ msg: 'Photo file size should be less than 1 MB' });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        
        // Handle PDF file upload
        if (files.pdfFile) {
            // console.log("Pdf file")
            // Validate file size less than 10 MB (adjust as per your requirement)
            if (files.pdfFile.size > 10000000) {
                return res.status(400).json({ msg: 'PDF file size should be less than 10 MB' });
            }
            product.pdfFile.data = fs.readFileSync(files.pdfFile.path);
            product.pdfFile.contentType = files.pdfFile.type;
        }

        // Save the new product to MongoDB
        product.save((err, data) => {
            if (err) {
                return res.status(400).json({ msg: 'Failed to save product', error: err });
            }
            res.json({ product: data });
        });
    });
};

// Update a product
exports.update = async(req, res) => {
    // Formidable is used to handle form data. we are using it to handle image upload
    let form = new formidable.IncomingForm();
    form.keepExtensions = true // Extension for images

    form.parse(req, (err, fields, files) => {
        if(err)
        {
            return res.status(400).json({msg: 'Image could not be uploaded'});
        }

        // Update product
        let product = req.product;
        product = _.extend(product, fields);

        // Handle files
        if(files.photo)
        {
            // Validate file size less than 1 MB
            if(files.photo.size > 1000000)
            {
                return res.status(400).json({
                    msg: "File size should be less than 1 mb"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        // Save the new product
        product.save((err, data) => {
            if(err)
            return res.status(400).json({msg: errorHandler(err)});

            res.json({
                product: data
            });
        });

    });

}

// Delete a product
exports.remove = async(req, res) => {
    let product = req.product;

    // Remove from DB
    product.remove((err, deletedProduct) => {
        if(err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        res.json({
            msg: "Product successfully deleted"
        })
    });

};


// RETURN PRODUCTS BY QUERY

/*
 * sell/arrival
 * by sale = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params specified, then all products are returned  
 */

 // Get all products
 exports.list = async(req, res) => {
     // query parameter
     let order = req.query.order ? req.query.order : 'asc';
     let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
     let limit = req.query.limit ? parseInt(req.query.limit) : 6;

     await Product.find()
            .select("-photo")
            .populate("category")
            .sort([[sortBy, order]])
            .limit(limit)
            .exec((err, data) => {
                if(err)
                {
                    return res.status(400).json({
                        msg: "Products not found"
                    })
                }

                return res.json(data);
            });
 };

 
 // Get related products (same category)
 exports.listRelated = async(req, res) => {
    
    // query parameter
    console.log(req.query.limit);
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    // find all products of same category except same category
    await Product.find({_id: {$ne: req.product}, category: req.product.category})
           .populate("category", "_id name") // populate only id and name
           .limit(limit)
           .exec((err, data) => {
               if(err)
               {
                   return res.status(400).json({
                       msg: "Products not found"
                   })
               }

               return res.json(data);
           });
};

// List product categories
exports.listCategories = async(req, res) => {
    Product.distinct("category", {}, (err, data) => {
        if(err)
        {
            return res.status(400).json({
                msg: "Categories not found"
            })
        }

        return res.json(data);
 
    })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

// Return product photo
exports.photo = async(req, res, next) => {
    if(req.product.photo.data)
    {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }

    next();
}

// Return products by query params
exports.listSearch = async(req, res) => {
    // create query object to hold search value and category value
    const query = {};
    
    // Assign search value to query.name
    if(req.query.search)
    {
        query.name = {$regex: req.query.search, $options: 'i'}  //  i is for case insenstivity
        // Assign category value to query.category
        if(req.query.category && req.query.category !== 'All')
        {
            query.category = req.query.category
        }

        // find the product based on query object with 2 properties
        // search and category
        await Product.find(query, (err, products) => {
            if(err)
            {
                return res.status(400).json({
                    err: errorHandler(err)
                })
            }

            res.json(products);
        }).select('-photo')
    }
}

// Decrease products quantity when item is sold
exports.decreaseQuantity = async(req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    });

    Product.bulkWrite(bulkOps, {}, (err, products) => {
        if(err)
        {
            return res.status(400).json({
                error: 'Could not update product'
            })
        }

        next();
    })
}