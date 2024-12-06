//funções externas
import getConnection  from '../../../data/connection.js'; //conexão com o banco de dados

//função assíncrona para visualizar as missões
const getQuests  = async (req, res) => {
	//executa a conexão com o banco de dados
	

    try{

		// Obter conexão
		const connection = await getConnection();

		//chama a view pronta de visualização
        const query = "SELECT * FROM ViewAllQuest;";

        //envia a query e retorna caso tenha dado certo
		const [results] = await connection.query(query);
		results;

		return res.status(200).json({msg: "Missões disponíveis: ", quests: results});
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao visualizar as missões, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	};
};

export default getQuests;