//funções externas
import connection  from '../../../data/connection.js';		//conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js'; //verifica se o dado ultrapassa o limite de caracteres

//função assíncrona para adicionar uma nova cadeia de missões
const createQuest 	=
async (req, res)    => {
	//array de requisição dos dados
	const {
		description_3, XP_3, 
		description_2, XP_2, 
		description_1, XP_1, 
		blob_url, blob_title, blob_description 
	} = req.body;

	//validação de campo vazio
	if ( 
		!description_3 || !XP_3	  	 || 
		!description_2 || !XP_2	  	 || 
		!description_1 || !XP_1	  	 || 
		!blob_url      || !blob_title|| 
		!blob_description 
	){
		return res.status(422).json({ msg: "É obrigatório preencher todos os campos para criar uma cadeia de missões." });
	};

	//verifica se já existe missões deste tipo no banco de dados
	//...?

    //array com dados que contém limite de campo
    const data = [
        ['descrição da terceira missão', description_3], 
        ['descrição da segunda missão',  description_2], 
        ["descrição da primeira missão", description_1], 
        ["URL da imagem",                blob_url], 
        ["Título do badge",              blob_title], 
        ["Descrição da badge",           blob_description]
    ];

	//array variável que armazena o limite dos campos no banco de dados
	const limitLength = [120, 120, 120, 2048, 40, 120];

	//verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; //captura o título e valor do campo

		if (checkLength(value, limitLength[i])) {
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
		};
	};

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	try{
		//chama a procedure de criação e coloca os dados	
		const query  = `CALL CreateQuestAndBadge(?, ?, ?, ?, ?, ?, ?, ?, ?);`;
		const values = [ 
			blob_description,
			blob_title, blob_url,
		    description_1, XP_1,
			description_2, XP_2,   
            description_3, XP_3, 
            
           
           
        ];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Cadeia de missões criada com sucesso."});
	}catch(error){
		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(400).json({ 
				msg: `Erro ao tentar criar cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			// Caso o erro seja inerente as regras, retorna no console e avisa
			console.error("Erro ao tentar criar cadeia de missões: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
};
export default createQuest;