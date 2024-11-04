const app  = require('./config/express')();

const port = app.get('port');
const cors = require('cors');

const bodyParser = require('body-parser');
const swaggerUi  = require('swagger-ui-express');

const swaggerFile = require('./swagger-output.json');
const router      = require('./API/routes/route');

app.use(cors());
app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Documentação: /docs`);
});