const connection = require('../../../data/connection'); // conexão com o banco de dados
const valorNulo = require('../../../utils/nullValue'); // verifica se a variável possui valor nulo 

exports.updateTip = async (req, res) => {
    let { id, tip_description } = req.body; // variáveis responsáveis por armazenar os dados

    // Verifica se as variáveis possuem algum valor
    id = valorNulo(id);
    tip_description = valorNulo(tip_description);
    
    console.log(id);

    // Validação para não permitir valor vazio
    if (!tip_description || tip_description.trim() === '') {
        return res.status(400).json({ message: "A descrição da dica não pode ser vazia." });
    }

    // Verifica se os dados ultrapassam 120 caracteres
    if (tip_description.length > 200) {
        return res.status(400).json({ message: "O campo não pode exceder 200 caracteres." });
    }

    const sql = 'CALL ModifyTip(?, ?)';
    const values = [id, tip_description];

    let executeConnection; // Variável para armazenar a conexão

    try {
        // Aguarda a conexão
        executeConnection = await connection.getConnection();

        // Executa a query
        const [result] = await executeConnection.query(sql, values);

        // Verifica o resultado
        if (result && result.affectedRows > 0) {
            return res.status(200).json({ msg: "Dica atualizada com sucesso!" });
        } else {
            return res.status(404).json({ msg: "Dica não encontrada." });
        }
    } catch (error) {
        console.error("Erro ao atualizar dica: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados
        if (executeConnection) {
            await executeConnection.end();
        }
    }
};
