import app  from './config/express.js';

import cors       from 'cors';
import bodyParser from 'body-parser';

import swaggerUi   from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' assert { type: 'json' };

import router from './API/routes/route.js';

const port = app.get('port');

app.use(cors());
app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Documentação: /docs`);
});