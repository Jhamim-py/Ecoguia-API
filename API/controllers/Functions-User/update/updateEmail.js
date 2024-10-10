const connection     =  require('../../../data/connection');  // conexão com o banco de dados
// Função assíncrona para atualizar o E-mail do usuário
exports.updateEmail =
async (req, res) => {
	// variáveis responsáveis por armazenar os dados
	const userId  = req.user.id;
	const {email} = req.body;
	const pwd = null;
	//variável que armazena a execução de conexão com o banco de dados
	const executeConnection = await connection.getConnection();
	try{
		// executa a query de atualização da senha e do email no banco de dados
		const query  = `CALL ModifyUser(?, ?, ?);`;
		const values = [userId,email,pwd];
		console.log(userId)
		console.log(email)
		console.log(pwd)
		// Executa a consulta
		const [results] = await executeConnection.query(query, values);
		console.log(results)
		if(results.length != 0){
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
		
	};
};