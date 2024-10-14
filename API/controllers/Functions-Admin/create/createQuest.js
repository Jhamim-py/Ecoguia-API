const connection        = require('../../../data/connection');       //conexão com o banco de dados
const checkLength       = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres
const generateBadge     = require('../../../utils/generateBadge');   //importa a função de incrementar badges

exports.createQuestAndBadge =
async (req, res) => {
	// variáveis responsáveis por armazenar os dados
	const value = { 
		blob_url, blob_title, blob_description, 
		description_1, XP1, 
		description_2, XP2, 
		description_3, XP3
	} = req.body;
	 
	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();
	if(!value){
		return res.status(400).json({message: "Preencha todos os campos."});
	}

	try{
		//verifica se os dados ultrapassam X caracteres
		if (checkLength(description_3, 120) == false || checkLength(description_2, 120) == false || checkLength(description_1, 120)    == false 
		|| checkLength(blob_url, 2048      == false) || checkLength(blob_title, 40)     == false || checkLength(blob_description, 120) == false)
		{
			return res.status(400).json({msg: "Os campos não devem exceder caracteres."});
		
		};

		// Validação para verificar se os dados já existem
		const existingQuery = `SELECT COUNT(*) AS count FROM tbl_badge WHERE title_badge = ?`;
		const [existingRows] = await executeConnection.query(existingQuery, [blob_title]);

		if (existingRows[0].count > 0) {
			return res.status(409).json({ message: "Quest com o mesmo título já existe." });
		}

		const badgeId = generateBadge();
	
		const query = `CALL CreateQuestAndBadge(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
		const values = [blob_url, blob_title, blob_description, description_1, XP1, description_2, XP2, description_3, XP3, badgeId];

		const [result] = await executeConnection.query(query, values);
		result;

		return res.status(200).json({msg:"Quest criada com sucesso"});
	}catch(error){
		console.error("Algo deu errado ao criar as quests, tente novamente", error);
		return res.status(500).json({msg: "Algo deu errado na conexão com o servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
}; 

