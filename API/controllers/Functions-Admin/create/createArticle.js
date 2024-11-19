//importação do arquivo de configuração .env
import 'dotenv/config';

//funções externas
import connection  from '../../../data/connection.js';		//conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js'; //verifica se o dado ultrapassa o limite de caracteres

//função assíncrona para adicionar um novo artigo
const createArticle   =
async (req, res) 	  => {
  	//array de requisição dos dados
	const {image, title, category, description, reference} = req.body;

	//validação de campo vazio
	if (!image || !title || !category || !description || !reference) {
		return res.status(422).json({ msg: "É obrigatório preencher todos os campos para criar um artigo." });
	};

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

	//verifica se já existe um artigo deste tipo no banco de dados
	//...?
	
	//array com dados que contém limite de campo
	const data = [
		['imagem do artigo',  image], 
		['título do artigo',  title], 
		['categoria',  		  categoryClean], 
		['descrição', 		  description], 
		['URL de referência', reference]
	];

	//array variável que armazena o limite dos campos no banco de dados
	const limitLength = [2048, 280, 40, 2048, 2048];

	//verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; //captura o título e valor do campo

		if (checkLength(value, limitLength[i])) { //retorna o campo que ultrapassou o limite
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
		};
	};

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	try{
		//chama a procedure de criação e coloca os dados
		const query  = `CALL CreateArticle(?, ?, ?, ?, ?);`;
		const values = [image, title, categoryClean, description, reference];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Artigo criado com sucesso."});
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao criar o artigo, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
}; 

export default createArticle;