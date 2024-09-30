// utilizado para armazenar dados no cachê da API
const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({});
module.exports = cache; 