const app  = require('./config/express')();
const port = app.get('port');
const cors = require('cors');
const router = require('./API/routes/route');
app.use(cors())


app.use(router)
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});