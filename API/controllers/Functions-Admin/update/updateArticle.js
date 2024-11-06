const connection      = require('../../../data/connection');       //conexão com o banco de dados
const nullValue       = require('../../../utils/nullValue');       //verifica se a variável possui valor nulo 
const checkLength     = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres

exports.updateArticle =
async(req, res) =>{
    // array de requisição dos dados
    const {
        id, image, title, 
        category, description, reference
	} = req.body;

	// array com dados que contém limite de campo
	const data = [
		['imagem do artigo',  image], 
		['título do artigo',  title], 
		['categoria',  		  category], 
		['descrição', 		  description], 
		['URL de referência', reference]
	];

	// array variável que armazena o limite dos campos no banco de dados
	const limitlength = [2048, 280, 40, 2048, 2048];

	//verifica se há um valor vazio e o substitui por 'null' num loop
	for (let i = 0; i < data.length; i++){
		data[i] = nullValue(data[i]);

	};

	//verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; // Captura o título e valor do campo

		if (checkLength(value, limitlength[i])) {
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitlength[i]} caracteres.` });
		};
	};

    //executa a conexão com o banco de dados
    const executeConnection = await connection.getConnection();

	try{
		const query  = 'CALL  ModifyArticle(?, ?, ?, ?, ?, ?);';
		const values = [id, image, title, category, description, reference];

		//executa a query
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Artigo modificado com sucesso."});
	}catch(error){
		console.error("Algo deu errado ao modificar o artigo, tente novamente:", error);
		return res.status(500).json({msg: "Erro interno no servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};