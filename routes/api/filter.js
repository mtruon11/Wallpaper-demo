const express = require('express');
const router = express.Router();

//Load Product model
const Product = require('../../models/Product');
const Categories = require('../../models/Category');
const Tag = require('../../models/Tag');
const Color = require('../../models/Color');
const Measurement = require('../../models/Measurement');

router.post('/', async function(req, res){
    var pageNum = parseInt(req.params.pageNum);
    var size = parseInt(req.params.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

    await Product.countDocuments({}, (err, totalCount) => {
        if(err) {
            console.log("Error while counting total products");
        } else {
            Product.find({
                            status: true,
                            categories: {"$in": req.body.categories}, 
                            colors:{"$in": req.body.colors}, 
                            tags: {"$in": req.body.tags}, 
                            measurements: {"$in": req.body.measures}
        }, null, query, (err, products) => {
                if(err){
                    console.log('Error while loading products');
                } else {
                    Categories.find({}, (err, categories) => {
                        if(err) {
                            console.log('Error while loading categories');
                        } else {
                            Tag.find({}, (err, tags) => {
                                if (err) {
                                    console.log('Error while loading tags');
                                } else {
                                    Color.find({}, (err, colors) => {
                                        if (err) {
                                            console.log('Error while loading colors');
                                        } else {
                                            Measurement.find({}, (err, measurements) => {
                                                if (err) {
                                                    console.log('Error while loading measurements');
                                                } else {
                                                    var totalPages = Math.ceil(totalCount / size);
                                                    res.status(200).json({
                                                        user: req.user,
                                                        products: products,
                                                        categories: categories,
                                                        tags: tags,
                                                        colors: colors,
                                                        measurements: measurements,
                                                        pages: totalPages,
                                                        currentPage: pageNum
                                                    })
                                                } 
                                            });               
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    })
})

module.exports = router;