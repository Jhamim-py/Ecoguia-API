// controle de rotas na URL e funções utilizadas
const { Router }    = require ("express");

// rotas de ADMIN
const createQuest = require('../controllers/Functions-Admin/create/createQuest');

const createArticle = require('../controllers/Functions-Admin/create/createArticle');

const createTip     = require('../controllers/Functions-Admin/create/createTip');

const updateQuest   = require('../controllers/Functions-Admin/update/updateQuest');

const updateArticle = require('../controllers/Functions-Admin/update/updateArticle');

const updateAvatar  = require('../controllers/Functions-Admin/update/updateAvatar');

const updateTip     = require('../controllers/Functions-Admin/update/updateTip');

const deleteQuest   = require('../controllers/Functions-Admin/delete/deleteQuest');

const deleteArticle = require('../controllers/Functions-Admin/delete/deleteArticle');

const deleteTip     = require('../controllers/Functions-Admin/delete/deleteTip');


// rotas de SISTEMA
const viewPickupTime= require('../controllers/Functions-System/read/viewPickupTime');
const viewTip       = require('../controllers/Functions-System/read/viewTip');
const viewArticles  = require('../controllers/Functions-System/read/viewArticles');
const viewRank      = require('../controllers/Functions-System/read/viewRank');
const viewAvatars   = require('../controllers/Functions-System/read/viewAvatar');
const selectArticle = require('../controllers/Functions-System/read/selectArticle');
const viewAllTips   = require('../controllers/Functions-System/read/viewAllTips')


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
const updateLevel  = require('../controllers/Functions-User/update/updateLevel');
const updateProfile = require('../controllers/Functions-User/update/updateProfile');
const registerUpdateEmail = require('../controllers/Functions-User/update/registerUpdateEmail')
const updateEmail   = require('../controllers/Functions-User/update/updateEmail');

// composição da requisições
const routes = Router();

// HTTPS de ADMIN

// POST || CREATE

//criar uma nova quest com a entrada das informações
routes.post('/createQuest', createQuest.createQuest);

//cria artigo manualmente com os dados de entrada
routes.post('/createArticle',createArticle.createArticle);

//cria uma nova dica com a entrada da descrição
routes.post('/createTips', createTip.createTip);

// PUT || UPDATE

//modificar três missões e uma badge de acordo com o o ID de entrada
//sendo ele aquele que detém o badge
routes.put('/updateQuest', updateQuest.updateQuest);
//modificar um artigo de acordo com o ID de entrada
routes.put('/updateArticle', updateArticle.updateArticle);

//modificar um avatar de acordo com o ID de entrada e o ID do novo avatar
routes.put('/updateAvatar', updateAvatar.updateAvatar);

//modificar uma dica de acordo com o ID de entrada
routes.put('/updateTip', updateTip.updateTip);

// DELETE || DELETE
//excluiri uma quest de acordo com o ID de entrada
routes.delete('/deleteQuest', deleteQuest.deleteQuest);

//excluir um artigo de acordo com o ID e título de entrada
routes.delete('/deleteArticle', deleteArticle.deleteArticle);

//Excluir uma dica de acordo com o ID de entrada
routes.delete('/deleteTip', deleteTip.deleteTip);


// HTTPS de SISTEMA

//GET || READ
//visualiza horário de coleta
routes.post('/pickupTime', viewPickupTime.pickupTime);

//visualiza a dica diária
routes.get('/tip', viewTip.getTip);

//visualizar todas as dicas
routes.get('/AllTips',viewAllTips.getAllTips);

//visualiza os artigos
routes.get('/articles', viewArticles.viewArticles);

//visualiza um artigo
routes.get('/selectArticle', selectArticle.selectArticle);

//visualiza o ranking de usuários por XP
routes.get('/rank',checkToken.checkToken,viewRank.viewRank);

//visializar todos os avatares
routes.get('/avatars', viewAvatars.viewAvatar);
// HTTPS de USUÁRIO

// POST || CREATE
//criar usuário
routes.post('/user/register',     registerUser.postRegister);
routes.post('/user/create',       createUser.createUser);

//autenticação de conta
routes.post('/user/token',        generateToken.getForget);
routes.post('/user/login',        loginUser.postLogin);
routes.post('/user/auth/google/callback',       googleAuth.authGoogleCallback);

//recuperação de conta
routes.post('/user/pwd',          forgetPwd.password);


//PUT || UPDATE
routes.put   ('/user/profile',    checkToken.checkToken, updateProfile.updateProfile);
routes.put   ('/user/levelup',    checkToken.checkToken, updateLevel.updateLevel);
routes.put   ('/user/pwd',        checkToken.checkToken, updateUser.updateUser);
routes.put   ('/user/email',      checkToken.checkToken, updateEmail.updateEmail);
routes.put   ('/user/registerEmail',registerUpdateEmail.registerUpdateEmail);


//GET || READ
//visualizar dados do perfil do usuário
routes.get   ('/user/profile',    checkToken.checkToken, viewProfile.getPerfil);

//???
routes.get   ('/user/auth/google', googleAuth.authGoogle);


// DELETE || DELETE
//excluir conta de usuário
routes.delete('/user',checkToken.checkToken,deleteUser.deleteUser);


module.exports = routes;