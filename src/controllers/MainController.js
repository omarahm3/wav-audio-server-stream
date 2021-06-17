const logger = require('../services/logger');

exports.MainPage = async (req, res) => {
  return res.render('index')
}