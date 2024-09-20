// utilizado para armazenar dados no cachê da API
const NodeCache = require('node-cache');
require('dotenv').config();

exports.cache = new NodeCache({stdTTL: 1800});