require('dotenv').config(); // importação do arquivo de configuração .env

const axios             = require('axios').default;                  //biblioteca para realizar as requisições na API externa 

const connection        = require('../../../data/connection');       //conexão com o banco de dados
const checkLength       = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres
const checkArticle      = require('../../../utils/checkArticle');    //verifica se o artigo adicionado já existe no banco de dados

exports.createArticles  =
async (req, res) => {
	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();
	
	//variáveis responsáveis por armazenar os dados
	const url = 'https://gnews.io/api/v4/search/';
  
    const params = {
      q: 'meio ambiente',         //palavra chave utilizada na busca dos artigos
      lang: 'pt',                 //idioma do artigo
      country: 'br',              //país de origem 
      max: 10,                    //número máximo de artigos pegos na requisição
      apikey: process.env.APIKEY  //chave da API
    };

	// dar um jeito nesse arquivo, ele é todo torto de validação e callbacks...
    try{
		//realiza a requisição na API externa
		const response = await axios.get(url, {params});

		//armazena os dados da reqisição 
		const articles = response.data.articles;

		//função para adicionar os artigos no banco de dados 
		for (let i = 0; i < articles.length; i++){

			//pega cada artigo por índice
			const article = articles[i];
		
			//variáveis locais para enviar ao banco de dados
			let image = article.image;
			let title = article.title;
			let category = "artigo";
			let description = article.content;
			let reference = article.url;

			//verifica se algum dos dados ultrapassam 2048 caracteres
			if (!checkLength(image) || !checkLength(description)|| !checkLength(reference)){
				//se ultrapassar, não adiciona no banco de dados e passa para próxima iteração]
				console.log("ultrapassou");
				continue;
			}
			else if(!await checkArticle(title, reference)){
				//se existir no banco de dados, não adiciona e passa para próxima iteração
				console.log("repetido");
				continue;
			}
			else if (i == articles.length - 1){
				//caso seja a última iteração retorna o resultado da requisição
				return res.status(200).json({ msg: "10 artigos foram armazenados."});
			}; 

			const query	 = `CALL CreateArticle(?, ?, ?, ?, ?);`;
			const values = [image, title, category, description, reference];

			//executa a query no banco de dados
			const [results] = await executeConnection.query(query, values);
			results;
			// if(results != 0){
			// 	return res.status(200).json({msg: "Artigos adicionados com sucesso!"});
			// }else{
			// 	return res.status(500).json({ msg: "Algo deu errado. Verifique" });
			// };
		};
	}catch(error){
		console.error("Algo deu errado ao adicionar artigos por via externa, tente novamente: ", error);
		return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });

	}finally {
		// Fecha a conexão com o banco de dados, se foi estabelecida
		if (executeConnection) {
			await executeConnection.end();
		};
	};
};