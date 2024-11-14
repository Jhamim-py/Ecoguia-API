//funções externas
const connection = require('../../../data/connection'); // conexão com o banco de dados

//função assíncrona para deletar uma dica
exports.deleteTip = 
async (req, res) => {
    //array de requisição dos dados
    const {id} = req.body;

	//validação de campo vazio
	if (!id) {
		return res.status(422).json({ msg: "É obrigatório selecionar uma dica para exclusão." });
	};

	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    try {
		//chama a procedure de exclusão e coloca os dados
        const query = `CALL DeleteTip(?);`;
        const values = [id];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;
		
		return res.status(200).json({ msg: "Dica deletada com sucesso." });
	} catch (error) {
		//caso dê algo errado, retorna no console e avisa
        console.error("Erro ao tentar deletar dica: ", error);
        return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
    } finally {
		if (executeConnection) {
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
};