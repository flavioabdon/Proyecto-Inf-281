const express = require('express');
const router = express.Router();

router.get('/indexDelivery', (req, res) => {
    res.render('delivery/indexDeliveryView', { currentPage: "indexDelivery" });
});

module.exports = router;

