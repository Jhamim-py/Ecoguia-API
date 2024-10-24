const connection  = require('../../../data/connection'); // conexão com o banco de dados
const nullValue   = require('../../../utils/nullValue'); // verifica se a variável possui valor nulo 

exports.updateTip = 
async (req, res) => {
    // array de requisição dos dados
    const {
        id, description_tip
	} = req.body;
    const limitLength = 120;

    // verifica se o tamanho da URL está aceitável
    if (checkLength(description_tip, limitLength)) {
        return res.status(400).json({ msg: `A descrição da dica ultrapassou o limite de ${limitLength} caracteres.` });
    };

    // Verifica se o novo avatar foi fornecido
    // mais uma função de verificar campo vazio, etc.
    if (!description_tip) {
        return res.status(400).json({ msg: "Descrição nova não foi fornecida." });
    };

    //executa a conexão com o banco de dados
    const executeConnection = await connection.getConnection();

    
    try {
        const query  = 'CALL ModifyTip(?, ?)';
        const values = [id, description_tip];

		//executa a query
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Dica modificada com sucesso."});
	}catch(error){
		console.error("Algo deu errado ao modificar a dica, tente novamente:", error);
		return res.status(500).json({msg: "Erro interno no servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};