const express = require('express');
const router = express.Router();
const validation = require('validator');

// Load Color model
const Color = require('../../models/Color');

module.exports = router;

router.get('/', (req, res) => {
    Color.find({}, (err, doc) => {
        res.status(200).render('./admin/viewColor', {
            user: req.user,
            doc: doc,
            link: "/admin/colors/",
        })
    })
})
