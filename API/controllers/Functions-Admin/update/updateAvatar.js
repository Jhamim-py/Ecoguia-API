const connection = require('../../../data/connection');

// função de modificação do avatar do usuário que pode ser exportada
exports.updateAvatar = async (req, res) => {
    const avatarId = req.body.avatarId; // pegando o ID do avatar
    const newAvatar = req.body.newAvatar; // o novo link do avatar enviado no corpo da requisição

    // variável de conexão com o banco de dados
    const executeConnection = await connection.getConnection();

    // Verifica se o novo avatar foi fornecido
    if (!newAvatar) {
        return res.status(400).json({ msg: "Novo link do avatar não fornecido." });
    }

    try {
        // query para modificar o avatar do usuário
        const query = "CALL ModifyAvatar(?, ?)";
        const values = [avatarId, newAvatar]; // passando o ID do avatar e o novo link

        // envio de query e captação de resposta
        const [results] = await executeConnection.query(query, values);
        if (results && results.affectedRows > 0) {
            res.status(200).json({ msg: "Avatar atualizado com sucesso." });
        } else {
            return res.status(404).json({ msg: "Algo deu errado ao modificar o avatar, tente novamente." });
        }
    } catch (erro) {
        console.error(erro); // log do erro
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        }
    }
};
