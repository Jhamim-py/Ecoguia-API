//funções externas
import connection  from '../../../data/connection.js'; //conexão com o banco de dados

//função assíncrona para visualizar as missões
const getQuests  =
async (req, res) => {
	//executa a conexão com o banco de dados
	const executeConnection = await connection();

    try{
		//chama a view pronta de visualização
        const query = "SELECT * FROM ViewAllQuest;";

        //envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query);
		results;

		return res.status(200).json({msg: "Missões disponíveis: ", quests: results});
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

export default getQuests;