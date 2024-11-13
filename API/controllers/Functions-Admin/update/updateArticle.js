//funções externas
const connection      = require('../../../data/connection');       //conexão com o banco de dados
const nullValue       = require('../../../utils/nullValue');       //verifica se a variável possui valor nulo 
const checkLength     = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres

//função assíncrona para modificar um artigo
exports.updateArticle =
async(req, res) =>{
    //array de requisição dos dados
    const {id, image, title, category, description, reference} = req.body;

	//verifica se a categoria formatada é uma das opções válidas
	const categoryClean = category
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
	;

	//retorna caso seja uma categoria inválida
	if (categoryClean !== 'noticia' && categoryClean !== 'artigo' && categoryClean !== 'faca voce mesmo') {
		return res.status(400).json({ msg: `A categoria do artigo deve ser: artigo, notícia ou faça você mesmo.`});
	};

	// array com dados que contém limite de campo
	const data = [
		['imagem do artigo',  image], 
		['título do artigo',  title], 
		['categoria',  		  category], 
		['descrição', 		  description], 
		['URL de referência', reference]
	];

	// array variável que armazena o limite dos campos no banco de dados
	const limitLength = [2048, 280, 40, 2048, 2048];

	//verifica se há um valor vazio e o substitui por 'null' num loop
	for (let i = 0; i < data.length; i++){
		data[i] = nullValue(data[i]);

	};

	//verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; // Captura o título e valor do campo

		if (checkLength(value, limitLength[i])) {
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
		};
	};

    //executa a conexão com o banco de dados
    const executeConnection = await connection.getConnection();

	try{
		//chama a procedure de criação e coloca os dados
		const query  = 'CALL  ModifyArticle(?, ?, ?, ?, ?, ?);';
		const values = [id, image, title, category, description, reference];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Artigo modificado com sucesso."});
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao modificar o artigo, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};