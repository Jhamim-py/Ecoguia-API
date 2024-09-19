// controle de rotas na URL e funções utilizadas
const { Router }       = require ("express");

// rotas de SISTEMA
const viewTip       = require('../controllers/Functions-System/read/viewTip');

const createArticle    = require('../controllers/Functions-System/create/createArticles');

const deleteArticle    = require('../controllers/Functions-System/delete/deleteArticle');

const viewArticles     = require('../controllers/Functions-System/read/viewArticles');
const selectArticle    = require('../controllers/Functions-System/read/selectArticle');
const viewRank           = require('../controllers/Functions-System/read/viewRank')
const updateArticle    = require('../controllers/Functions-System/update/updateArticle');




//rotas de USUÁRIO
const registerUser  = require('../controllers/Functions-User/create/registerUser');
const createUser    = require('../controllers/Functions-User/create/createUser');

const deleteUser    = require('../controllers/Functions-User/delete/deleteUser');

const forgetPwd     = require('../controllers/Functions-User/forget/forgetPassword');
const generateToken = require('../controllers/Functions-User/forget/generateToken');

const loginUser     = require('../controllers/Functions-User/login/loginUser');
const checkToken    = require('../controllers/Functions-User/login/checkToken');
const googleAuth    = require('../controllers/Functions-User/login/authGoogle');

const viewProfile   = require('../controllers/Functions-User/read/viewProfile');

const updateUser    = require('../controllers/Functions-User/update/updateUser');
const updateProfile = require('../controllers/Functions-User/update/updateProfile');
const updateEmail   = require('../controllers/Functions-User/update/updateEmail');

const routes = Router();

//Usuario -------------------

//Rota Delete
routes.delete('/user',              deleteUser.deleteUser);

//Rotas Post
routes.post('/user/register',    registerUser.postRegister);
routes.post('/user',             createUser.createUser);
routes.post('/user/pwd',          forgetPwd.password);
routes.post('/user/token',        generateToken.getForget);
routes.post('/user/login',        loginUser.postLogin);
routes.post('/user/auth/google/callback', googleAuth.authGoogleCallback);

//Rota Get
routes.get   ('/user',              checkToken.checkToken,viewProfile.getPerfil);
routes.get   ('/user/auth/google',        googleAuth.authGoogle);

//Rotas Put
routes.put   ('/user',              checkToken.checkToken,updateProfile.updateProfile)
routes.put   ('/user/pwd',          checkToken.checkToken,updateUser.updateUser)
routes.put   ('/user/email',        checkToken.checkToken,updateEmail.updateEmail)


//Sistema --------------------

//Rota delete
routes.delete('/deleteArticle', deleteArticle.deleteArticle);

//Rota post
routes.post('/createArticles', createArticle.createArticle);

//Rotas get
routes.get('/tips', viewTip.getTip)
routes.get('/articles', viewArticles.viewArticles);
routes.get('/selectArticle', selectArticle.selectArticle);
routes.get('/rank',viewRank.viewRank)

//Rota put
routes.put('/updateArticle', updateArticle.updateArticle);





module.exports = routes;