// importação do arquivo de configuração .env
require('dotenv').config();

// funções externas
const connection        = require('../../../data/connection');       //conexão com o banco de dados
const checkLength       = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres
// const formatCategory	= require('../../../utils/formatData');		 //formata o dado para letras minúsculas e sem acento

exports.createArticle   =
async (req, res) => {
  	// array de requisição dos dados
	const {
		image, title, category, description, reference
	} = req.body;

	// validação de campo vazio
	if (!image || !title || !category || !description || !reference) {
		return res.status(422).json({ msg: "É obrigatório preencher todos os campos para criar um artigo." });
	};

	// Verifica se a categoria formatada é uma das opções válidas
	// const categoryClean = formatCategory(category);
	if (category !== 'noticia' || category !== 'artigo' || category !== 'faca voce mesmo') {
		return res.status(400).json({ msg: `A categoria do artigo deve ser: artigo, notícia ou faça você mesmo.`});
	};
	
	// array com dados que contém limite de campo
	const data = [
		['imagem do artigo',  image], 
		['título do artigo',  title], 
		['categoria',  		  categoryClean], 
		['descrição', 		  description], 
		['URL de referência', reference]
	];

	// array variável que armazena o limite dos campos no banco de dados
	const limitlength = [2048, 280, 40, 2048, 2048];

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
		const query = `CALL CreateArticle(?, ?, ?, ?, ?);`;
		const values = [image, title, category, description, reference];

		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Artigo criado com sucesso."});
	}catch(error){
		console.error("Algo deu errado ao criar o artigo, tente novamente:", error);
		return res.status(500).json({msg: "Algo deu errado na conexão com o servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
}; 