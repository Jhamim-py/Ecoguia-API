// Obriga o aplicativo a utilizar o express para realizar requisições
const express    =     require('express');
const config     =     require('config');

// adiconar swagger
// trocar para import

module.exports = () => {
    const app = express();
    app.use(express.json());
    app.set('port', process.env.PORT || config.get('server.port'));
    return app;
};