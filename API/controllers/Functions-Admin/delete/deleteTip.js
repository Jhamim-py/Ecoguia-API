const connection = require('../../../data/connection')

exports.deleteTip = async (req, res) => {
    console.log("Corpo da requisição:", req.body); // Para depuração
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ msg: "ID da dica não fornecido." });
    }

    const query = `CALL DeleteTip(?);`;
    const value = [id];
    
    try {
        executeConnection = await connection.getConnection();
        const [result] = await executeConnection.query(query, value);

        // Se a procedure retornar resultados, analise-os
        if (result && result.length > 0 && result[0].affectedRows > 0) {
            return res.status(200).json({ msg: "Dica deletada com sucesso!" });
        } else {
            return res.status(404).json({ msg: "Dica não encontrada ou já deletada." });
        }
    } catch (error) {
        console.error("Erro ao deletar dica: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        if (executeConnection) {
            executeConnection.end();
        }
    }
};
