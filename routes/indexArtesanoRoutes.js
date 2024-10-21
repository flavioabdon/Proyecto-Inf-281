const express = require('express');
const router = express.Router();

router.get('/indexArtesano', (req, res) => {
    res.render('artesano/indexArtesanoView', { currentPage: "indexArtesano" });
});

module.exports = router;

