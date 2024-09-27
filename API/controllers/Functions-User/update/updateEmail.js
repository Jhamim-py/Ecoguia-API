const connection     =  require('../../../data/connection');  // conexão com o banco de dados
const bcrypt         =  require('bcrypt');                   // criptografa dados em hash
const appCache       =  require('../../../utils/cache');         // armazena os dados de usuário, usado posteriormente para validações

// Função assíncrona para atualizar o E-mail do usuário
exports.updateEmail =
async (req, res) => {
	// variáveis responsáveis por armazenar os dados
	const {token} = req.body;
	const userId  = req.user.id;
	const email   = appCache.take("endereco");
	const senha   = appCache.take("senha");

	//verifica se o token é válido
	if (!appCache.get(token)) {
		console.log(appCache.get(token));  //verificação
		return res.status(400).json({ msg: "Token inválido ou expirado" });
		
	};

	//variável que armazena a execução de conexão com o banco de dados
	const executeConnection = await connection.getConnection();

	// criptografa a senha dada em hash
	const salt = await bcrypt.genSalt(12); 				 // define o tamanho do hash (12 caracteres)
	const passwordHash = await bcrypt.hash(senha, salt); // cria o hash da senha

	try{
		// executa a query de atualização da senha e do email no banco de dados
		const query  = `CALL ModifyUser(?, ?, ?);`;
		const values = [userId,email,passwordHash];

		// Executa a consulta
		const [results] = await executeConnection.query(query, values);
		if(results.length > 0){
			return res.status(200).json({msg: "Usuário atualizado com sucesso."});
		}else{
			return res.status(500).json({ msg: "Algo deu errado no banco de dados. Verifique." });
		};

	}catch(error){
		console.error("Algo deu errado ao atualizar e-mail, tente novamente: ", error);
		return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });

	}finally {
		// Fecha a conexão com o banco de dados, se foi estabelecida
		if (executeConnection) {
			await executeConnection.end();
		};
		appCache.flushAll(); // comando que reseta o cachê do app
	};
};