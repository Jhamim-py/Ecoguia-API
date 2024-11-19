//obriga o aplicativo a utilizar o express para realizar requisições
import express from 'express';
import config  from 'config';


const app = express();
app.use(express.json());
app.set('port', process.env.PORT || config.get('server.port'));

export default app;