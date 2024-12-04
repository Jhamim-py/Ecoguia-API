//funções externas
import connection from '../../../data/connection.js'; //conexão com o banco de dados

//função assíncrona para visualizar informações de um usuário
const viewInfoUser =
async (req, res)   =>{
	//variáveis responsáveis por armazenar os dados
	const userID = req.user.id;

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	try{
		//chama a view pronta de visualização
		const query  = `SELECT * FROM viewallemails WHERE pk_IDuser=?;`;
		const values = userID;

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json(results);
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao pegar os dados do usuário, tente novamente: ", error);
		res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
	}
	finally {
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};

export default viewInfoUser;