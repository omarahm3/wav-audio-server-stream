const router      = require('express').Router();
const mainRoutes  = require('./mainRoutes');

router.use('/', mainRoutes);

module.exports = router;