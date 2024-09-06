// controle de rotas na URL e funções utilizadas
const { Router }       = require ("express");
const  checkToken      = require ('../controllers/Functions User/check.controller')
const  password        = require ('../controllers/Functions User/forgetPassword.controller');
const  deletes         = require ('../controllers/Functions User/delete.controller');
const  forget          = require ('../controllers/Functions User/forget.controller');
const  profile         = require ('../controllers/Functions User/profile.controller');
const  login           = require ('../controllers/Functions User/login.controller');
const  register        = require ('../controllers/Functions User/registerUser');
const  update          = require ('../controllers/Functions User/update.controller');
const  updateUser      = require ('../controllers/Functions User/updateUser.controller');
const  createUser      = require ('../controllers/Functions User/createUser.controller')
const confirmEmailUpdate = require('../controllers/Functions User/confirmUpdateEmail.controller')
const rotas = Router();

rotas.post('/register',register.postRegistro);
rotas.post('/login',login.postLogin);
rotas.delete('/delete',checkToken.checkToken,deletes.delete);
rotas.get('/profile',checkToken.checkToken,profile.getPerfil);
rotas.get('/password',checkToken.checkToken,password.password);
rotas.get('/forget',forget.getForget);
rotas.put('/update',checkToken.checkToken,update.update);
rotas.put('/updateUser',checkToken.checkToken,updateUser.updateUser);
rotas.post('/createUser',createUser.CreateUser);
rotas.put('/confirmUpdateEmail',checkToken.checkToken,confirmEmailUpdate.updateEmail);



module.exports = rotas;