const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const jwt = require('jsonwebtoken');
const generateNickname  = require('../../../utils/generateNickname');
const { getConnection } = require('../../../data/connection'); // Importa a função para obter a conexão

// Configura o Passport com a estratégia Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,   // Id de cliente da API no Google Cloud Console
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Informação secreta da API no Google Cloud Console
  callbackURL: "/user/auth/google/callback" // URL de callback após autenticação
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const { given_name, family_name, email } = profile._json; // Extrai dados do perfil

    const emailExists = await checkEmailExists(email); // Verifica se o e-mail existe no banco de dados

    if (!emailExists) {
      const nickname = generateNickname(family_name);

      const user = { // Dados do novo usuário
        name: given_name,
        lastname: family_name,
        email: email,
        nickname: nickname,
      };
      await addUserToDatabase(user); // Adiciona o usuário ao banco de dados se não existir
    }

    const token = jwt.sign({ given_name, family_name, email }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '1h' });

    done(null, { token, profile }); // Conclui a autenticação com sucesso
  } catch (error) {
    console.error('Erro na autenticação:', error);
    done(error); // Conclui com erro se ocorrer
  }
}));

// Serializa e desserializa o usuário para a sessão
passport.serializeUser((user, done) => done(null, user)); // Armazena informações do usuário na sessão
passport.deserializeUser((obj, done) => done(null, obj));

// Função para verificar se o e-mail já existe no banco de dados
const checkEmailExists = async (email) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM ViewAllEmails WHERE email=?;', [email]);
    return rows.length > 0; // Retorna true se o e-mail existir
  } catch (error) {
    console.error('Erro ao verificar e-mail:', error);
    throw error; // Repassa o erro
  } finally {
    await connection.end(); // Fecha a conexão
  }
};

// Função para adicionar um novo usuário ao banco de dados
const addUserToDatabase = async (user) => {
  const connection = await getConnection();
  const query = `CALL CreateUser(?, ?, ?, ?, ?, ?)`;
  const values = [user.name, user.lastname, user.email, '', user.nickname, 1];
  try {
    await connection.query(query, values); // Executa a inserção
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw error; // Repassa o erro
  } finally {
    await connection.end(); // Fecha a conexão
  }
};

// Rota para iniciar o login com Google
const authGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

// Rota de callback do Google
const authGoogleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Erro na autenticação callback:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      console.warn('Usuário não encontrado na autenticação');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    console.log('Usuário autenticado:', user);
    const { token, profile } = user;
    res.status(200).json({ token, profile });
  })(req, res, next);
};

module.exports = {
  authGoogle,
  authGoogleCallback
};
