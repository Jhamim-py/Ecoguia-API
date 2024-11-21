// controle de rotas na URL e funções utilizadas
import { Router } from 'express';

// rotas de ADMIN
import  createQuest    from '../controllers/Functions-Admin/create/createQuest.js';
import  createArticle  from '../controllers/Functions-Admin/create/createArticle.js';
import  createTip      from '../controllers/Functions-Admin/create/createTip.js';
import  createLevel    from '../controllers/Functions-Admin/create/createLevel.js';
import  updateQuest    from '../controllers/Functions-Admin/update/updateQuest.js';
import  updateArticle  from '../controllers/Functions-Admin/update/updateArticle.js';
import  updateAvatar   from '../controllers/Functions-Admin/update/updateAvatar.js';
import  updateTip      from '../controllers/Functions-Admin/update/updateTip.js';
import  updateMaterial from '../controllers/Functions-Admin/update/updateMaterial.js';
import  deleteQuest    from '../controllers/Functions-Admin/delete/deleteQuest.js';
import  deleteArticle  from '../controllers/Functions-Admin/delete/deleteArticle.js';
import  deleteTip      from '../controllers/Functions-Admin/delete/deleteTip.js';
import  deleteLevel    from '../controllers/Functions-Admin/delete/deleteLevel.js';

// rotas de SISTEMA
import  viewPickupTime from '../controllers/Functions-System/read/viewPickupTime.js';
import  viewTip        from '../controllers/Functions-System/read/viewTip.js';
import  viewArticles   from '../controllers/Functions-System/read/viewArticles.js';
import  viewAvatars    from '../controllers/Functions-System/read/viewAvatar.js';
import  viewArticle    from '../controllers/Functions-System/read/viewArticle.js';
import  viewTips       from '../controllers/Functions-System/read/viewTips.js';
import  viewLevels     from '../controllers/Functions-System/read/viewLevel.js';
import  viewQuests     from '../controllers/Functions-System/read/viewQuests.js';
import viewMaterial    from '../controllers/Functions-System/read/viewMaterial.js';
import viewInfoUser    from '../controllers/Functions-System/read/viewInfoUser.js';

// rotas de USUÁRIO
import  registerUser   from '../controllers/Functions-User/create/registerUser.js';
import  createUser     from '../controllers/Functions-User/create/createUser.js';
import  deleteUser     from '../controllers/Functions-User/delete/deleteUser.js';
import  forgotPwd      from '../controllers/Functions-User/forgot/forgotPwd.js';
import  sendTokenPwd   from '../controllers/Functions-User/forgot/sendTokenPwd.js';
import  loginUser      from '../controllers/Functions-User/login/loginUser.js';
import  checkToken     from '../controllers/Functions-User/login/checkToken.js';
import  viewProfile    from '../controllers/Functions-User/read/viewProfile.js';
import  viewRanking    from '../controllers/Functions-User/read/viewRanking.js';
import  updatePwd      from '../controllers/Functions-User/update/updatePwd.js';
import  updateLevel    from '../controllers/Functions-User/update/updateLevel.js';
import  updateProfile  from '../controllers/Functions-User/update/updateProfile.js';
import  sendTokenEmail from '../controllers/Functions-User/update/e-mail/sendTokenEmail.js';
import  updateEmail    from '../controllers/Functions-User/update/e-mail/updateEmail.js';

// composição da requisições
const routes = Router();


// HTTP de ADMIN

// POST || CREATE
//cria uma nova quest
routes.post('/createQuest',    createQuest);

//cria um novo artigo
routes.post('/createArticle',  createArticle);

//cria uma nova dica
routes.post('/createTip',      createTip);

//cria um novo level
routes.post('/createLevel',    createLevel);


// PUT || UPDATE
//modifica uma cadeia de missões(3), começando pela 3ª
routes.put('/updateQuest',   updateQuest);

//modifica um artigo
routes.put('/updateArticle', updateArticle);

//modifica um avatar com uma nova URL
routes.put('/updateAvatar',  updateAvatar);

//modifica uma dica com uma nova descrição
routes.put('/updateTip',     updateTip);

//modificar um material de acordo com o ID de entrada
routes.put('/updateMaterial', updateMaterial);

// DELETE || DELETE
//deleta uma cadeia de missões(3), referenciando a 3ª
routes.delete('/deleteQuest',   deleteQuest);

//deleta um artigo
routes.delete('/deleteArticle', deleteArticle);

//deleta uma dica
routes.delete('/deleteTip',     deleteTip);

//deleta um level
routes.delete('/deleteLevel',   deleteLevel);


// HTTP de SISTEMA

// GET || READ
//visualiza um horário de coleta de acordo com o CEP de entrada
routes.post('/pickupTime',   viewPickupTime);

//visualiza a dica diária
routes.get('/tip',           viewTip);

//visualiza todas as dicas
routes.get('/tips',          viewTips);

//visualiza um artigo de acordo com o ID de entrada
routes.post('/article',      viewArticle);

//visualiza todos os artigos
routes.get('/articles',      viewArticles);

//visualiza todos os avatares de perfil
routes.get('/avatars',       viewAvatars);

//visualiza todos os níveis de conta
routes.get('/levels',        viewLevels);
 
//visualiza todas as missões
routes.get('/quests',        viewQuests);

//visualiza todos os materiais
routes.get('/materiais',     viewMaterial)

//visualizar informações sobre o usuário
routes.get('/userInfo', checkToken, viewInfoUser);


// HTTPS de USUÁRIO

// POST || CREATE
//cria um nova conta de usuário
routes.post('/user/register',      registerUser);    //registra e valida informações de conta
routes.post('/user/create',        createUser);  //envia nova conta para o banco de dados

//valida o login de usuário e retorna um token de identificação
routes.post('/user/login',         loginUser);

//função 'esqueci senha'
routes.post('/user/pwd/token',     sendTokenPwd); //envia um token de validação ao e-mail cadastrado
routes.post('/user/pwd/new',       forgotPwd);       //valida o token e retorna alteração de senha


//PUT || UPDATE
//altera os dados de perfil
routes.put('/user/profile',     checkToken, updateProfile);

//atualiza missão, XP e nível da conta
routes.put('/user/levelup',     checkToken, updateLevel); //type: 0 == missão : type: 1 == material

//altera a senha do usuário após validação
routes.put('/user/pwd',         checkToken, updatePwd);

//altera o e-mail do usuário
routes.put('/user/email/token', sendTokenEmail);                    //envia um token de validação ao novo e-mail
routes.put('/user/email/new',   checkToken, updateEmail); //valida o token e retorna alteração de e-mail


//GET || READ
//visualiza dados de perfil do usuário logado
routes.get('/user/profile',    checkToken, viewProfile);

//visualiza ranking de XP de acordo com o ID logado
routes.get('/ranking',         checkToken, viewRanking);


// DELETE || DELETE
//deleta a conta de usuário
routes.delete('/user',         checkToken, deleteUser);

export default routes;