const express = require('express');
const router = express.Router();
const validation = require('validator')

const Measurement = require('../../models/Measurement');

module.exports = router;


router.get('/', function(req, res) {
    Measurement.find({}, (err, measurements) => {
        return res.json({
            "measurements": measurements
        })
    })
})

router.post('/', function(req, res){
    let measure = req.body.measure;

    if(!measure) {
        return res.json({
            'error': true,
            'message': 'Enter category name'
        })
    }

    //sanitize input
    measure = validation.escape(measure);

    const newMeasurement = new Measurement({
        measure: measure
    });
    newMeasurement.save().then(measurement => {
       return res.json({
            'error': false,
            'message': measurement.measure + 'added successfully!',
            'measurement': measurement
       }) 
    }).catch(err => {
        return res.json({
            'error': true,
            'message': 'some error'
        })
    });
})

router.delete('/', (req, res) => {
    let id = req.body.id;

    Measurement.deleteOne({_id: id}, (err, measurement) => {
        if(err) {
            return res.json({
                'error': true,
                'message': 'Category does not exist!'
            })
        } else {
            return res.json({
                'error': false,
                'message': 'Successfully delete!'
            });
        }
    });
});