const express = require('express');
const router = express.Router();
const validation = require('validator');
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true});
// Load Measurement model
const Measurement = require('../../models/Measurement');

module.exports = router;

router.delete('/:measure', (req, res) => {
    
    Measurement.deleteOne({measure: req.params.measure}, (err, measurement) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.measure + ' deleted');
            res.redirect('/admin/Measurements');
        }
    });
});

router.use(csrfProtection);

router.get('/', (req, res) => {
    Measurement.find({}, (err, doc) => {
        res.status(200).render('./admin/viewMeasurement', {
            user: req.user,
            doc: doc,
            link: "/admin/Measurements/",
            csrfToken: req.csrfToken()
        })
    })
})

router.post('/addMeasurement', (req, res) => {
    let measure = req.body.measure;
    let errors = [];

    if(!measure) {
        errors.push({msg: 'Please enter Measurement name.'});
    }

    //sanitize input
    measure = validation.escape(measure);

    if (errors.length > 0) {
        res.render('./admin/viewMeasurement', {
            user: req.user, 
            errors,
            measure,
            csrfToken: req.csrfToken()
        });
    } else {
        Measurement.findOne({ measure: measure }).then(measurement => {
            if(measurement){
                errors.push({ msg: 'Measurement name already exists.' });
                res.render('./admin/viewMeasurement', {
                    user: req.user, 
                    errors,
                    measure,
                    csrfToken: req.csrfToken()
                });
            } else {
                const newMeasurement = new Measurement({
                    measure: measure
                });
                newMeasurement.save().then(measurement => {
                    req.flash(
                        'success_msg',
                        'Measurement ' + measurement.measure +' is created.'
                    );
                    res.redirect('/admin/Measurements');
                }).catch(err => console.log(err));
            }
        });
    }
});
