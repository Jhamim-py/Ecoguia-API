const connection = require('../../../data/connection');
const checkXp = require('../../../utils/checkXp');

// função de modificação de level do usuário que pode ser exportada
exports.updateLevel = async (req, res) => { // função assíncrona com parâmetros de requisição e resposta
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: "Usuário não autenticado." });
    }

    const userID = req.user.id; // pegando o id do usuário pelo token
    const dados = await checkXp(userID); // variável responsável por armazenar os dados

    // verificando os dados
    console.log(dados);

    const executeConnection = await connection.getConnection(); // variável de conexão com o banco de dados

    // verificando se dados possui os valores esperados
    if (!dados || dados.length < 3) {
        return res.status(400).json({ msg: "Dados insuficientes para atualizar o nível." });
    }

    const [xp, level, quest] = dados; // armazenando o xp, level e quest do usuário

    // try catch para modificar o level do usuário
    try {
        // query para modificar o level do usuário  
        const query = "CALL ModifyLevelUser(?, ?, ?, ?);";
        const values = [userID, xp, level, quest];

        // envio de query e captação de resposta
        const [results] = await executeConnection.query(query, values);
        if (results && results.affectedRows > 0) {
            res.status(200).json({ msg: "Nível atualizado com sucesso." });
        } else {
            return res.status(404).json({ msg: "Algo deu errado ao modificar o nível no banco de dados, tente novamente." });
        }
    } catch (erro) {
        console.error(erro); // verificação
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        }
    }
};
