import connection from '../../../data/connection.js';       // conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js'; // verifica se a variável possui valor maior que o esperado 

const updateMaterial = 
async (req, res)     => {
    // array de requisição dos dados
    const {
        id, type,xp_material
	} = req.body;

    const limitLength = 40;
 // verifica se o tamanho do tipo de material está aceitável
 if (checkLength(type, limitLength)) {
    return res.status(400).json({ msg: `O nome do tipo de material ultrapassou o limite de ${limitLength} caracteres.`});
};
    //executa a conexão com o banco de dados
    const executeConnection = await connection.getConnection();
    try {
        const query  = 'CALL ModifyMaterial(?,?,?)';
        const values = [id,type,xp_material];

		//executa a query
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Material modificado com sucesso."});
	}catch(error){
		console.error("Algo deu errado ao modificar o material, tente novamente:", error);
		return res.status(500).json({msg: "Erro interno no servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};

export default updateMaterial;