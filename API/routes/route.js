// controle de rotas na URL e funções utilizadas
const { Router } = require ("express");

// rotas de ADMIN
const createQuest      = require('../controllers/Functions-Admin/create/createQuest');
const createArticle    = require('../controllers/Functions-Admin/create/createArticle');
const createTip        = require('../controllers/Functions-Admin/create/createTip');
const createLevel      = require('../controllers/Functions-Admin/create/createLevel');
const updateQuest      = require('../controllers/Functions-Admin/update/updateQuest');
const updateArticle    = require('../controllers/Functions-Admin/update/updateArticle');
const updateAvatar     = require('../controllers/Functions-Admin/update/updateAvatar');
const updateTip        = require('../controllers/Functions-Admin/update/updateTip');
const deleteQuest      = require('../controllers/Functions-Admin/delete/deleteQuest');
const deleteArticle    = require('../controllers/Functions-Admin/delete/deleteArticle');
const deleteTip        = require('../controllers/Functions-Admin/delete/deleteTip');
const deleteLevel      = require('../controllers/Functions-Admin/delete/deleteLevel');

// rotas de SISTEMA
const viewPickupTime   = require('../controllers/Functions-System/read/viewPickupTime');
const viewTip          = require('../controllers/Functions-System/read/viewTip');
const viewArticles     = require('../controllers/Functions-System/read/viewArticles');
const viewAvatars      = require('../controllers/Functions-System/read/viewAvatar');
const viewArticle      = require('../controllers/Functions-System/read/viewArticle');
const viewTips         = require('../controllers/Functions-System/read/viewTips');
const viewLevels       = require('../controllers/Functions-System/read/viewLevel');
const viewQuests       = require('../controllers/Functions-System/read/viewQuests'); 

// rotas de USUÁRIO
const registerUser     = require('../controllers/Functions-User/create/registerUser');
const createUser       = require('../controllers/Functions-User/create/createUser');
const deleteUser       = require('../controllers/Functions-User/delete/deleteUser');
const forgotPwd        = require('../controllers/Functions-User/forgot/forgotPwd');
const sendTokenPwd     = require('../controllers/Functions-User/forgot/sendTokenPwd');
const loginUser        = require('../controllers/Functions-User/login/loginUser');
const checkToken       = require('../controllers/Functions-User/login/checkToken');
const viewProfile      = require('../controllers/Functions-User/read/viewProfile');
const viewRanking      = require('../controllers/Functions-User/read/viewRanking');
const updatePwd        = require('../controllers/Functions-User/update/updatePwd');
const updateLevel      = require('../controllers/Functions-User/update/updateLevel');
const updateProfile    = require('../controllers/Functions-User/update/updateProfile');
const sendTokenEmail   = require('../controllers/Functions-User/update/e-mail/sendTokenEmail');
const updateEmail      = require('../controllers/Functions-User/update/e-mail/updateEmail');

// composição da requisições
const routes = Router();


// HTTP de ADMIN

// POST || CREATE
//cria uma nova quest
routes.post('/createQuest',    createQuest.createQuest);

//cria um novo artigo
routes.post('/createArticle',  createArticle.createArticle);

//cria uma nova dica
routes.post('/createTips',     createTip.createTip);

//cria um novo level
routes.post('/createLevel',    createLevel.createLevel);


// PUT || UPDATE
//modifica uma cadeia de missões(3), começando pela 3ª
routes.put('/updateQuest',   updateQuest.updateQuest);

//modifica um artigo
routes.put('/updateArticle', updateArticle.updateArticle);

//modifica um avatar com uma nova URL
routes.put('/updateAvatar',  updateAvatar.updateAvatar);

//modifica uma dica com uma nova descrição
routes.put('/updateTip',     updateTip.updateTip);


// DELETE || DELETE
//deleta uma cadeia de missões(3), referenciando a 3ª
routes.delete('/deleteQuest',   deleteQuest.deleteQuest);

//deleta um artigo
routes.delete('/deleteArticle', deleteArticle.deleteArticle);

//deleta uma dica
routes.delete('/deleteTip',     deleteTip.deleteTip);

//deleta um level
routes.delete('/deleteLevel',   deleteLevel.deleteLevel);


// HTTP de SISTEMA

// GET || READ
//visualiza um horário de coleta de acordo com o CEP de entrada
routes.post('/pickupTime',   viewPickupTime.pickupTime);

//visualiza a dica diária
routes.get('/tip',           viewTip.getDailyTip);

//visualiza todas as dicas
routes.get('/tips',          viewTips.getAllTips);

//visualiza um artigo de acordo com o ID de entrada
routes.post('/article',      viewArticle.getIDArticle);

//visualiza todos os artigos
routes.get('/articles',      viewArticles.getAllArticles);

//visualiza todos os avatares de perfil
routes.get('/avatars',       viewAvatars.getAvatars);

//visualiza todos os níveis de conta
routes.get('/levels',        viewLevels.getLevels);

//visualiza todas as missões
routes.get('/quests',        viewQuests.getQuests);


// HTTP de USUÁRIO

// POST || CREATE
//cria um nova conta de usuário
routes.post('/user/register',      registerUser.newUser);    //registra e valida informações de conta
routes.post('/user/create',        createUser.sendNewUser);  //envia nova conta para o banco de dados

//valida o login de usuário e retorna um token de identificação
routes.post('/user/login',         loginUser.postLogin);

//função 'esqueci senha'
routes.post('/user/pwd/token',     sendTokenPwd.sendToken); //envia um token de validação ao e-mail cadastrado
routes.post('/user/pwd/new',       forgotPwd.newPwd);       //valida o token e retorna alteração de senha


//PUT || UPDATE
//altera os dados de perfil
routes.put('/user/profile',     checkToken.checkToken, updateProfile.updateProfile);

//atualiza missão, XP e nível da conta
routes.put('/user/levelup',     checkToken.checkToken, updateLevel.updateLevel); //type: 0 == missão : type: 1 == material

//altera a senha do usuário após validação
routes.put('/user/pwd',         checkToken.checkToken, updatePwd.updatePwd);

//altera o e-mail do usuário
routes.put('/user/email/token', sendTokenEmail.sendToken);                    //envia um token de validação ao novo e-mail
routes.put('/user/email/new',   checkToken.checkToken, updateEmail.newEmail); //valida o token e retorna alteração de e-mail


//GET || READ
//visualiza dados de perfil do usuário logado
routes.get('/user/profile',    checkToken.checkToken, viewProfile.getProfile);

//visualiza ranking de XP de acordo com o ID logado
routes.get('/ranking',         checkToken.checkToken, viewRanking.getRanking);


// DELETE || DELETE
//deleta a conta de usuário
routes.delete('/user',         checkToken.checkToken,deleteUser.deleteUser);

module.exports = routes;