// utilizado para armazenar dados no cachê da API
const NodeCache = require('node-cache');
require('dotenv').config();

const cacheTemp = new NodeCache({stdTTL: 1800});
module.exports = cacheTemp; 