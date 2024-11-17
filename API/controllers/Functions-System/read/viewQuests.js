//funções externas
const connection = require('../../../data/connection'); //conexão com o banco de dados

//função assíncrona para visualizar as missões
exports.getQuests =
async function (req,res) {
	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    try{
		//chama a view pronta de visualização
        const query = "SELECT * FROM ViewAllQuest;";

        //envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query);
		results;

		return res.status(200).json({msg: "Missões disponíveis: ", quests: results[0]});
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao visualizar as missões, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};