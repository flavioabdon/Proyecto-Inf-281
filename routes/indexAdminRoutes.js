const express = require('express');
const router = express.Router();

router.get('/indexAdmin', (req, res) => {
    res.render('administrador/indexAdminView', { currentPage: "indexAdmin" });
});

module.exports = router;

