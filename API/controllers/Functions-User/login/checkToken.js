//componente do node 
const jwt = require('jsonwebtoken'); //gera um token

// importação do arquivo de configuração .env
require('dotenv').config();

//função de verificação que pode ser exportada
exports.checkToken =  (req, res, next) => {
    //armazenar o token requerido no header da requisição
    const authHeader = req.headers['authorization'];
    
    //verifica a existência do bearer token e separa em um array e armazenando apenas o valor do token 
    const token = authHeader && authHeader.split(" ")[1];

    //verificar se há realmente um token
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado devido a autenticação do token de usuário.' });
    }

    //verificar se o token é válido
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.user = decodedToken; // Adicionar o ID do usuário ao objeto de solicitação
        next();                  // Passa para o proximo passo da requisição 
    } catch (e) {
        console.error("Erro ao verificar o token:", e);
        res.status(400).json({ msg: 'Token inválido!', error: e.message });
    }
}