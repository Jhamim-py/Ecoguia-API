// utilizado para armazenar dados no cachê da API
import NodeCache from 'node-cache';
import 'dotenv/config';

const cache = new NodeCache({});

export default cache;