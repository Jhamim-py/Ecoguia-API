//funções externas
import connection  from '../../../data/connection.js';	// conexão com o banco de dados

//função assíncrona para deletar o level mais recente
const deleteLevel = 
async (req, res) => {
	//executa a conexão com o banco de dados
	const executeConnection = await connection(); 

    try {
		//chama a procedure de exclusão e coloca os dados
        const query = `CALL DeleteLevel();`;

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query);
		results;
		
		return res.status(200).json({ msg: "Level mais recente foi deletado com sucesso." });
	} catch (error) {
		if (error.sqlState === '45000') {
			//caso o erro SQL seja por regras de negócio, expõe-o
			return res.status(400).json({ 
				msg: `Erro ao tentar deletar o último level: ${error.sqlMessage}`
			});
		} else {
			//caso não seja, retorna no console e avisa
			console.error("Erro ao tentar deletar o último level: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
	} finally {
		if (executeConnection) {
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
};

export default deleteLevel;