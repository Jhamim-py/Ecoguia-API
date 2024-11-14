//importação do arquivo de configuração .env
require('dotenv').config();

//funções externas
const connection        = require('../../../data/connection');       //conexão com o banco de dados

//função assíncrona para adicionar um novo artigo
exports.createLevel   =
async (req, res) 	  => {
  	//array de requisição dos dados
	const {XP} = req.body;

	//validação de campo vazio
	if (!XP) {
		return res.status(422).json({ msg: "É obrigatório preencher o único campo para criar um novo level." });
	};

	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

	try{
		//chama a procedure de criação e coloca os dados
		const query = `CALL CreateLevel(?);`;
		const values = [XP];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Um novo level foi criado com sucesso."});
	}catch(error){
		if (error.sqlState === '45000') {
			//caso o erro SQL seja por regras de negócio, expõe-o
			return res.status(400).json({ 
				msg: `Erro ao tentar criar um novo level: ${error.sqlMessage}`
			});
		} else {
			//caso dê algo errado, retorna no console e avisa
			console.error("Erro ao tentar criar um novo level: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
}; 