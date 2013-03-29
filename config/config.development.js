var config = require('./config.global');

config.rdio = {};
config.rdio.key = process.env.RDIO_KEY;
config.rdio.secret = process.env.RDIO_SECRET;
module.exports = config;