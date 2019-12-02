const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForUser, uploadForVendor} = require('../upload');

// Load Product model
const Product = require('../../models/Product');

module.exports = router;

router.get('/', (req, res) => {
    
    Product.find({}, async (err,data) => {
        if(data){

            var total;
            var outOfStock;

            await Product
                .countDocuments({}, (err, count) => {
                    total = count;
                });

            await Product
                .countDocuments({status: false, quantity: {$eq: 0}}, (err, count) => {
                    outOfStock = count;
                });

            res.status(200).json({
                user: req.user, 
                total: total,
                outOfStock: outOfStock,
                products: data,
            })
        } else {
            res.status(200).json({
                user: req.user, 
                total: 0,
                outOfStock: 0,
                products: null,
            })
        }
    });
});

router.delete('/', (req, res) => {
    
    Product.deleteOne({_id: req.body.id}, (err, product) => {
        if(err) {
            return res.json({
                "error":  true,
                "message": "something wrong"
            })
        } else {
            return res.json({
                "error": false,
                "message": "successfully delete"
            })
        }
    });

});


router.post('/', uploadProduct.array('images'), async (req, res) => {
    
    const sku = req.body.sku, name = req.body.name, description = req.body.description;
    const quantity = req.body.quantity, regularPrice = req.body.regularPrice; 
    const discountPrice = req.body.discountPrice, tags = req.body.tags.split(',');
    const categories = req.body.categories.split(','), colors = req.body.colors.split(','), measures = req.body.measures.split(',');
    const images = req.files;
    let imageUrl = [];    

    for(var idx in images){
        imageUrl.push('../../images/uploads/' + images[idx].originalname);
    }

    const newProduct = new Product({
        sku:sku, name: name, description: description, quantity: quantity, regularPrice: regularPrice,
        discountPrice: discountPrice, tags: tags, categories: categories, colors: colors, measures: measures, imageUrl: imageUrl
    });

    newProduct.save().then(product => {
        return res.json({
            "error": false,
            "message": "Successful added",
            "product": product
        })
    }).catch(err => {
        return res.json({
            "error": true,
            "message": "Something wrong"
        })
    });
 
});


router.get('/:id', (req, res) => {

    Product.findOne({_id: req.params.id}, async (err, product) => {
        if(err){
            return res.json({
                error: true,
                message: 'something wrong!'
            })
        }
        
        return res.json({
            error: false,
            message: 'successfully found!',
            product: product,
        });
    });
    
});
