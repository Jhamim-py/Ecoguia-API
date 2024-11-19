import connection  from '../../../data/connection.js';   // conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js';
const updateTip = 
async (req, res) => {
    // array de requisição dos dados
    const {
        id, description_tip
	} = req.body;

    // array variável que armazena o limite dos campos no banco de dados
    const limitLength = 120;

    if (!description_tip || typeof description_tip !== 'string') {
        // validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório preencher o campo da descrição de dica." });
	
        //verifica se já existe uma dica deste tipo no banco de dados
	    //...?

    }else if (checkLength(description_tip, limitLength)){
        //verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
        return res.status(400).json({ msg: `A descrição da dica ultrapassou o limite de ${limitLength} caracteres.` });
    };

    //executa a conexão com o banco de dados
    const executeConnection = await connection();

    
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

export default updateTip;