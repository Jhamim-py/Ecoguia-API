const { Router }       = require ("express");
const  checkToken      = require ('../controllers/check.controller')
const  checkEmail      = require ('../controllers/checkEmail.controller');
const  deletes         = require ('../controllers/delete.controller');
const  forgetPassword  = require ('../controllers/forget.controller');
const  profile         = require ('../controllers/profile.controller');
const  login           = require ('../controllers/login.controller');
const  register        = require ('../controllers/registrar.controller');
const  update          = require ('../controllers/update.controller');
const  dicaDiaria      = require ('../controllers/dica.controller');


const rotas = Router();

rotas.post('/register',register.postRegistro);
rotas.post('/login',login.postLogin);
rotas.delete('/delete',checkToken.checkToken,deletes.delete);
rotas.get('/profile',checkToken.checkToken,profile.getPerfil);
rotas.get('/checkEmail',checkEmail.checkEmail);
rotas.get('/forget',forgetPassword.getForget);
rotas.put('/update',checkToken.checkToken,update.update)
rotas.get('/dica-diaria', dicaDiaria.getDicaDoDia);


module.exports = rotas;