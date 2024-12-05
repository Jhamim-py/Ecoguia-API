import getConnection  from '../../../../data/connection.js';  // conexão com o banco de dados

// Função assíncrona para atualizar o E-mail do usuário
const newEmail =
async (req, res) => {
	// variáveis responsáveis por armazenar os dados
	const userId  = req.user.id;
	const {email} = req.body;
	const pwd = null;
	
	   //variável que armazena a execução de conexão com o banco de dados
	try{
		// Pega uma conexão
        const connection = await getConnection();
		
		// executa a query de atualização da senha e do email no banco de dados
		const query  = `CALL ModifyUser(?, ?, ?);`;
		const values = [userId, email, pwd];
		
		// Executa a consulta
		const [results] = await connection.query(query, values);
		results;
		if(results.length != 0){
			return res.status(200).json({msg: "Usuário atualizado com sucesso."});
		}else{
			return res.status(500).json({ msg: "Algo deu errado no banco de dados, por favor verifique." });
		};
 
	}catch(error){
		console.error("Algo deu errado ao atualizar e-mail, tente novamente: ", error);
		return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });

	};
};

export default newEmail;