// controle de rotas na URL e funções utilizadas
const { Router }       = require ("express");

// rotas de ADMIN
const createArticle = require('../controllers/Functions-System/create/createArticles');

const updateArticle = require('../controllers/Functions-System/update/updateArticle');

const deleteArticle = require('../controllers/Functions-System/delete/deleteArticle');


// rotas de SISTEMA
const viewTip       = require('../controllers/Functions-System/read/viewTip');
const viewArticles  = require('../controllers/Functions-System/read/viewArticles');
const viewRank      = require('../controllers/Functions-System/read/viewRank');

const selectArticle = require('../controllers/Functions-System/read/selectArticle');


// rotas de USUÁRIO
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

// composição da requisições
const routes = Router();

// HTTPS de ADMIN

// POST || CREATE
//cria um novo artigo com os dados de entrada
routes.post('/createArticles', createArticle.createArticle);

// PUT || UPDATE
//modificar um artigo de acordo com o ID de entrada
routes.put('/updateArticle', updateArticle.updateArticle);

// DELETE || DELETE
//excluir um artigo de acordo com o ID e título de entrada
routes.delete('/deleteArticle', deleteArticle.deleteArticle);


// HTTPS de SISTEMA

//GET || READ
//visualiza a dica diária
routes.get('/tips', viewTip.getTip);

//visualiza os artigos
routes.get('/articles', viewArticles.viewArticles);

//visualiza um artigo
routes.get('/selectArticle', selectArticle.selectArticle);

//visualiza o ranking de usuários por XP
routes.get('/rank',viewRank.viewRank);


// HTTPS de USUÁRIO

// POST || CREATE
//criar usuário
routes.post('/user/register',     registerUser.postRegister);
routes.post('/user',              createUser.createUser);

//autenticação de conta
routes.post('/user/token',        generateToken.getForget);
routes.post('/user',              loginUser.postLogin);
routes.post('/user/google',       googleAuth.authGoogleCallback);

//recuperação de conta
routes.post('/user/pwd',          forgetPwd.password);


//PUT || UPDATE
routes.put   ('/user',            checkToken.checkToken, updateProfile.updateProfile);
routes.put   ('/user/pwd',        checkToken.checkToken, updateUser.updateUser);
routes.put   ('/user/email',      checkToken.checkToken, updateEmail.updateEmail);


//GET || READ
//visualizar dados do perfil do usuário
routes.get   ('/user',            checkToken.checkToken, viewProfile.getPerfil);

//???
routes.get   ('/user/auth/google', googleAuth.authGoogle);


// DELETE || DELETE
//excluir conta de usuário
routes.delete('/user',            deleteUser.deleteUser);



module.exports = routes;