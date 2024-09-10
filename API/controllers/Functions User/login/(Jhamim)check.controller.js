// preciso que o Jhamim comente e arrume esse arquivo...
const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.checkToken = 
    (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.user = decodedToken; // Adicionar o ID do usuário ao objeto de solicitação
        next();
    } catch (e) {
        console.error("Erro ao verificar o token:", e);
        res.status(400).json({ msg: 'Token inválido!', error: e.message });
    }
}