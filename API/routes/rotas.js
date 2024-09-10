const { Router }       = require ("express");
const  checkToken      = require ('../controllers/check.controller')
const  password   = require ('../controllers/forgetPassword.controller');
const  deletes         = require ('../controllers/delete.controller');
const  forget  = require ('../controllers/forget.controller');
const  profile         = require ('../controllers/profile.controller');
const  login           = require ('../controllers/login.controller');
const  register        = require ('../controllers/registrar.controller');
const  update          = require ('../controllers/update.controller');
const  dicaDiaria      = require ('../controllers/dica.controller');
const  updateUser      = require ('../controllers/updateUser.controller');
const  createUser      = require ('../controllers/createUser.controller')
const confirmEmailUpdate = require('../controllers/confirmUpdateEmail.controller')
const rotas = Router();

rotas.post('/register',register.postRegistro);
rotas.post('/login',login.postLogin);
rotas.delete('/delete',checkToken.checkToken,deletes.delete);
rotas.get('/profile',checkToken.checkToken,profile.getPerfil);
rotas.get('/checkEmail',checkEmail.checkEmail);
rotas.get('/forget',forgetPassword.getForget);
rotas.put('/update',checkToken.checkToken,update.update)
rotas.get('/dica-diaria', dicaDiaria.getDicaDoDia);
rotas.get('/password',checkToken.checkToken,password.password);
rotas.get('/forget',forget.getForget);
rotas.put('/update',checkToken.checkToken,update.update);
rotas.put('/updateUser',checkToken.checkToken,updateUser.updateUser);
rotas.post('/createUser',createUser.CreateUser);
rotas.put('/confirmUpdateEmail',checkToken.checkToken,confirmEmailUpdate.updateEmail);


module.exports = rotas;