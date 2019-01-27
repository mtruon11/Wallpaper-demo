const express = require('express');
const router = express.Router();

const Order = require('../../models/Order')
module.exports = router;

router.get('/', (req, res) => {

    Order.find({}, async (err, orders) => {
        if(orders) {
            var today, thisMonth, lastMonth, allTime;

            var options = {month: 'long'};

            var d = new Date();

            var tMonth = new Date(d.getFullYear(), d.getMonth());

            var lMonth= new Date(d.getFullYear(), d.getMonth() - 1);

            await Order.countDocuments({orderedDate: {$gte: d.toDateString()}}, (err, count) => {
                today = count;
            });

            await Order.countDocuments({orderedDate: {$gte: tMonth, $lte: d}}, (err, count) => {
                thisMonth= count;
            });
 
            await Order.countDocuments({orderedDate: {$gte: lMonth, $lt: tMonth}}, (err, count) => {
                lastMonth = count;
            });
            await Order.countDocuments({}, (err, count) => {
                allTime = count;
            });
            
            res.render('./admin/viewOrder', {
                user: req.user,
                data: orders,
                today: today,
                thisMonth: thisMonth,
                lastMonth: lastMonth,
                allTime: allTime,
                link: "/admin/orders"
            })
        } else {
            res.render('./admin/viewOrder', {
                user: req.user,
                data: null,
                today: 0,
                thisMonth: 0,
                lastMonth: 0,
                allTime: 0,
                link: "/admin/orders"
            })
        }
        
    })

})