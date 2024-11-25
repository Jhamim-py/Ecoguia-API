import connection  from '../../../data/connection.js';       // conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js'; // verifica se a variável possui valor maior que o esperado 

const updateMaterial = 
async (req, res)     => {
    // array de requisição dos dados
    const {id, type, xp_material} = req.body;

	//verifica se o campo de identificação está preenchido
	if (!id) {
		//validação de campo vazio
		return res.status(422).json({ msg: "É obrigatório fornecer um ID referente."});
	}else if(!type && !xp_material){
		//validação de todos os campos vazios
		return res.status(422).json({ msg: "Ah-há! Gastando requisição atoa é?"});
	};

	//variável que armazena o limite de caracteres no banco de dados
    const limitLength = 40;

	//verifica se o tipo de material ultrapassa X caracteres e expõe caso seja verdadeiro
	if (checkLength(type, limitLength)) {
		return res.status(400).json({ msg: `O nome do tipo de material ultrapassou o limite de ${limitLength} caracteres.`});
	};

    //executa a conexão com o banco de dados
    const executeConnection = await connection();

    try {
		//verifica se existe material com este ID
		const itsExist = await verifyImage(id);

		//valida o resultado
		if (!itsExist.status){
			//caso seja 'false', retorna um erro 404
			return res.status(404).json({ msg: itsExist.res });
		}

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

//função assíncrona para verificar existência do material
async function verifyImage(req){
	const id = req;

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	//exclusão do antigo blob que está armazenado
	//chama a procedure de visualização para captar a URL de imagem
	const query  = `SELECT * FROM ViewAllMaterial WHERE pk_IDMaterial = (?);`;
	const values = id;

	//envia a query e retorna resposta do banco
	const [results] = await executeConnection.query(query, values);
	results;

	//caso não tenha registro associado ao ID selecionado, interrompe o processo
	if (results.length <= 0){
		return ({status: false, res: 'O material selecionado não existe.'});
	}else{
		//retorna URL retornada em caso de sucesso
		return ({status: true, res: `${results[0].XP_material}`});
	}
}

export default updateMaterial;