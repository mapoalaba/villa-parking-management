const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('GET request to the example endpoint');
});

module.exports = router;
