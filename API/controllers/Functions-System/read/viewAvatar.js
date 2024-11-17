//funções externas
const connection = require('../../../data/connection'); //conexão com o banco de dados

//função assíncrona para visualizar os avatares
exports.getAvatars =
async function (req, res) {
	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    try{
        //chama a view pronta de visualização
        const query = "SELECT * FROM ViewAllAvatar;";

        //envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query);
		results;

        return res.status(200).json({msg: "Avatares disponíveis: ", avatares: results});
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao visualizar os avatares, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};