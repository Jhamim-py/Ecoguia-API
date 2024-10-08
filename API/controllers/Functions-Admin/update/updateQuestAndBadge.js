const connection = require('../../../data/connection'); // conexão com o banco de dados
const valorNulo = require('../../../utils/nullValue'); // verifica se a variável possui valor nulo 

exports.updateQuestAndBadge = async (req, res) => {
    let { badgeId, blobUrl, blobTitle, blobDescription, questId, questDescription, questXp } = req.body; // variáveis responsáveis por armazenar os dados

    const sql = 'CALL ModifyQuestAndBadge(?, ?, ?, ?, ?, ?, ?)';
    const values = [badgeId, blobUrl, blobTitle, blobDescription, questId, questDescription, questXp];

    let executeConnection; // Variável para armazenar a conexão

    try {
        // Aguarda a conexão
        executeConnection = await connection.getConnection();

        // Executa a query
        const [result] = await executeConnection.query(sql, values);

        // Verifica o resultado
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ msg: "Quest e Badge atualizados com sucesso!" });
        } else {
            return res.status(404).json({ msg: "Quest ou Badge não encontrada." });
        }
    } catch (error) {
        console.error("Erro ao atualizar Quest ou Badge: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados
        if (executeConnection) {
            await executeConnection.end();
        }
    }
};
