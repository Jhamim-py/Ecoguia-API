//funções externas
import getConnection from '../../../data/connection.js'; //conexão com o banco de dados

//função assíncrona para visualizar informações de um usuário
const viewInfoUser =
async (req, res)   =>{
	//variáveis responsáveis por armazenar os dados
	const userID = req.user.id;

	//executa a conexão com o banco de dados
	

	try{
		// Pega uma conexão
        const connection = await getConnection();
		
		//chama a view pronta de visualização
		const query  = `SELECT * FROM viewallemails WHERE pk_IDuser=?;`;
		const values = userID;

		//envia a query e retorna caso tenha dado certo
		const [results] = await connection.query(query, values);
		results;

		return res.status(200).json(results);
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao pegar os dados do usuário, tente novamente: ", error);
		res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
	};
};

export default viewInfoUser;