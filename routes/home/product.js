const express = require('express');
const router = express.Router();

//Load Product model
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Tag = require('../../models/Tag');
const Color = require('../../models/Color');
const Measurement = require('../../models/Measurement');

var cats = async function(){
	var result;
	await Category
		.find({}, (err, c) => {
						result = c;
					});
	return result;
};

var tags = async function(){
	var result;
	await Tag
		.find({}, (err, t) => {
						result = t;
					});
	return result;
};

var colors = async function(){
	var result;
	await Color
		.find({}, (err, c) => {
						result = c;
					});
	return result;
};

var measurement = async function(){
	var result;
	await Measurement
		.find({}, (err, m) => {
						result = m;
					});
	return result;
};


var prods = async function(status, isSale, query){
	var result;
	await Product
		.find({status: status, isSale: isSale}, null, query, (err, p) => {
						result = p;
					});
	return result;
};

var prodsByCat = async function(status, category, query){
	var result;
	await Product
		.find({status: status, categories: category}, null, query, (err, p) => {
						result = p;
					});
	return result;
};

var prodsByTag = async function(status, tag, query){
	var result;
	await Product
		.find({status: status, tags: tag}, null, query, (err, p) => {
						result = p;
					});
	return result;
};

var prodsByColor = async function(status, color, query){
	var result;
	await Product
		.find({status: status, colors: color}, null, query, (err, p) => {
						result = p;
					});
	return result;
};

var prodsByMeasure = async function(status, measure, query){
	var result;
	await Product
		.find({status: status, measure: measure}, null, query, (err, p) => {
						result = p;
					});
	return result;
};
var totalCount = async function(status, isSale){
	var count;
	await Product
		.countDocuments({status: status, isSale: isSale}, (err, c) => {
			count = c;	
		});
	return count;
};

//All Available Products
router.get('/', async (req, res) => {
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;
	
	var count = 0, categories = [], products = [], allTags = [], allColors = [], allMeasurement = [];
	
	await cats().then(result => categories = result);
	
	await prods(true, false, query).then(result => products = result);	
	
	await tags().then(result => allTags = result);

	await colors().then(result => allColors = result);

	await measurement().then(result => allMeasurement = result);

	await totalCount(true, false).then(result => count = result);

	res.status(200).render('./home/products', {
		user: req.user,
		products: products === undefined ? [] : products,
		categories: categories === undefined ? [] : categories,
		tags: allTags === undefined ? [] : allTags,
		colors: allColors === undefined ? [] : allColors,
		measurements: allMeasurement === undefined ? [] : allMeasurement,
		pages: Math.ceil(count / size),
		currentPage: pageNum
	})
})

//Specific Product
router.get('/pid/:id', (req, res) => {

    Product.findById(req.params.id, (err, product) => {
        if(err) {
            console.log('Error while loading product')
        } else {
            Product.find({categories: product.categories}, (err, products) => {
                res.status(200).render('./home/product-detail', {
                    user: req.user,
                    relatedProducts: products,
                    product: product
                })
            })
        }
    });
})

//Sale
router.get('/onSale', async (req, res) => {

    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

	var count = 0, categories = [], products = [], allTags = [], allColors = [], allMeasurement = [];

	await cats().then(result => categories = result);

	await prods(true, true, query).then(result => products = result);

	await tags().then(result => allTags = result);

	await colors().then(result => allColors = result);

	await measurement().then(result => allMeasurement = result);

	await totalCount(true, true).then(result => count = result);

	res.status(200).render('./home/products', {
		user: req.user,
		products: products === undefined ? [] : products,
		categories: categories === undefined ? [] : categories,
		tags: allTags === undefined ? [] : allTags,
		colors: allColors === undefined ? [] : allColors,
		measurements: allMeasurement === undefined ? [] : allMeasurement,
		pages: Math.ceil(count / size),
		currentPage: pageNum
	})
});

//Find by category
router.get("/categories", async (req, res) => {
    var category = req.query.category;
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

	var count = 0, categories = [], products = [], allTags = [], allColors = [], allMeasurement = [];

	await cats().then(result => categories = result);

	await prodsByCat(true, category, query).then(result => products = result);

	await tags().then(result => allTags = result);

	await colors().then(result => allColors = result);

	await measurement().then(result => allMeasurement = result);

	await totalCount(true, true).then(result => count = result);

	res.status(200).render('./home/products', {
		user: req.user,
		products: products === undefined ? [] : products,
		categories: categories === undefined ? [] : categories,
		tags: allTags === undefined ? [] : allTags,
		colors: allColors === undefined ? [] : allColors,
		measurements: allMeasurement === undefined ? [] : allMeasurement,
		pages: Math.ceil(count / size),
		currentPage: pageNum
	})
});

//Find by tag
router.get("/tags", async (req, res) => {
    var tag = req.query.tag;
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

	var count = 0, categories = [], products = [], allTags = [], allColors = [], allMeasurement = [];

	await cats().then(result => categories = result);

	await prodsByTag(true, tag, query).then(result => products = result);

	await tags().then(result => allTags = result);

	await colors().then(result => allColors = result);

	await measurement().then(result => allMeasurement = result);

	await totalCount(true, true).then(result => count = result);

	res.status(200).render('./home/products', {
		user: req.user,
		products: products === undefined ? [] : products,
		categories: categories === undefined ? [] : categories,
		tags: allTags === undefined ? [] : allTags,
		colors: allColors === undefined ? [] : allColors,
		measurements: allMeasurement === undefined ? [] : allMeasurement,
		pages: Math.ceil(count / size),
		currentPage: pageNum
	})
});

//Find by colors
router.get("/colors", async (req, res) => {
    var color = req.query.color;
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

	var count = 0, categories = [], products = [], allTags = [], allColors = [], allMeasurement = [];

	await cats().then(result => categories = result);

	await prodsByColor(true, color, query).then(result => products = result);

	await tags().then(result => allTags = result);

	await colors().then(result => allColors = result);

	await measurement().then(result => allMeasurement = result);

	await totalCount(true, true).then(result => count = result);

	res.status(200).render('./home/products', {
		user: req.user,
		products: products === undefined ? [] : products,
		categories: categories === undefined ? [] : categories,
		tags: allTags === undefined ? [] : allTags,
		colors: allColors === undefined ? [] : allColors,
		measurements: allMeasurement === undefined ? [] : allMeasurement,
		pages: Math.ceil(count / size),
		currentPage: pageNum
	})
});

//Find by measurements
router.get("/measurements", async (req, res) => {
    var measure = req.query.measure;
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

	var count = 0, categories = [], products = [], allTags = [], allColors = [], allMeasurement = [];

	await cats().then(result => categories = result);

	await prodsByMeasure(true, measure, query).then(result => products = result);

	await tags().then(result => allTags = result);

	await colors().then(result => allColors = result);

	await measurement().then(result => allMeasurement = result);

	await totalCount(true, true).then(result => count = result);

	res.status(200).render('./home/products', {
		user: req.user,
		products: products === undefined ? [] : products,
		categories: categories === undefined ? [] : categories,
		tags: allTags === undefined ? [] : allTags,
		colors: allColors === undefined ? [] : allColors,
		measurements: allMeasurement === undefined ? [] : allMeasurement,
		pages: Math.ceil(count / size),
		currentPage: pageNum
	})
});

module.exports = router;
