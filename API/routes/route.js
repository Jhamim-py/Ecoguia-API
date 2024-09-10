// controle de rotas na URL e funções utilizadas
const { Router }       = require ("express");

// rotas de SISTEMA
const viewTip       = require('../controllers/Functions System/read/viewTip');

// rotas de USUÁRIO
const registerUser  = require('../controllers/Functions User/create/registerUser');
const createUser    = require('../controllers/Functions User/create/createUser');

const deleteUser    = require('../controllers/Functions User/delete/deleteUser');

const forgetPwd     = require('../controllers/Functions User/forget/(Jhamim)forgetPassword.controller');
const generateToken = require('../controllers/Functions User/forget/generateToken');

const loginUser     = require('../controllers/Functions User/login/loginUser');
const checkToken    = require('../controllers/Functions User/login/(Jhamim)check.controller');

const viewProfile   = require('../controllers/Functions User/read/viewProfile');

const updateUser    = require('../controllers/Functions User/update/(Jhamim)updateUser.controller');
const updateProfile = require('../controllers/Functions User/update/updateProfile');
const updateEmail   = require('../controllers/Functions User/update/(Jhamim)confirmUpdateEmail.controller');

const routes = Router();

routes.post  ('/user/register', registerUser.postRegister);
routes.post  ('/user',         createUser.createUser);

routes.delete('/user',         deleteUser.deleteUser);

routes.post  ('/user/pwd',        forgetPwd.password);
routes.post  ('/user/pwd/token',  checkToken.checkToken);

routes.get   ('/user');

rotas.post('/register',register.postRegistro);
rotas.post('/login',login.postLogin);
rotas.get('/profile',checkToken.checkToken,profile.getPerfil);
rotas.put('/update',checkToken.checkToken,update.update);
rotas.put('/updateUser',checkToken.checkToken,updateUser.updateUser);
rotas.put('/confirmUpdateEmail',checkToken.checkToken,confirmEmailUpdate.updateEmail);
rotas.get('/dica-diaria', dicaDiaria.getDicaDoDia);


module.exports = routes;