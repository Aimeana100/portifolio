const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    // res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    return res.status(200).json({"message": "this should route you homepage"});
});

module.exports = router;