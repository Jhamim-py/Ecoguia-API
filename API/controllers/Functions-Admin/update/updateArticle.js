//funções externas
import connection  from '../../../data/connection.js';	//conexão com o banco de dados
import nullValue   from '../../../utils/nullValue.js';	//verifica se a variável possui valor nulo 
import checkLength from '../../../utils/characterLimit.js';	  //verifica se o dado ultrapassa o limite de caracteres
import updateBlob  from '../../../middleware/updateImage.js'; //cria novo blob e retorna URL
import deleteBlob  from '../../../middleware/deleteImage.js'; //extrai e exclui o blob pela URL

//função assíncrona para modificar um artigo
const updateArticle =
async(req, res) =>{
    //array de requisição dos dados
    const {id, title, category, description, reference} = req.body;
	const image = req.file;

	//verifica se o campo de identificação está preenchido
	if (!id) {
		//validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório fornecer um ID referente."});
    }else if(!title && !category && !description && !reference){
		//validação de todos os campos vazios
		return res.status(422).json({ msg: "Ah-há! Gastando requisição atoa é?"});
	};

	//array com todos os dados
	const allData = [id, image, title, category, description, reference];

	//verifica se há um valor vazio e o substitui por 'null' num loop
    for (let i = 0; i < allData.length; i++){
        allData[i] = nullValue(allData[i]);
    };

	//verifica se o usuário inseriu algo em 'category'
	let categoryClean;
	if (allData[3] != null && allData[3] != ''){
		//normaliza o dado enviado
		categoryClean = category
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
		;
	
		//verifica se é uma das opções válidas
		if (categoryClean !== 'noticia' && categoryClean !== 'artigo' && categoryClean !== 'faca voce mesmo') {
			//se inválida, expõe as opções disponíveis
			return res.status(400).json({ msg: `A categoria do artigo deve ser: artigo, notícia ou faça você mesmo.`});
		}else{
			//se válida, reescreve a categoria com normalização
			allData[3] = categoryClean;
		};
	}
	
	//array com dados de caracteres limitado
	const data = [
		['título do artigo',  	allData[2]],
		['categoria do artigo', allData[3]],
		['descrição', 		  	allData[4]], 
		['URL de referência', 	allData[5]]
	];

	//array variável que armazena o limite dos campos no banco de dados
	const limitLength = [280, 40, 65535, 2048];

	//verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; // Captura o título e valor do campo

		if (checkLength(value, limitLength[i])) {
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
		};
	};

    //executa a conexão com o banco de dados
    const executeConnection = await connection();

	//inicializa as variáveis de URL de imagem
	let newImage_url = null;
	let oldImage_url = null;

	try{
		//verifica se existe artigo com este ID
		const itsExist = await verifyImage(id);

		//valida o resultado
		if (!itsExist.status){
			//caso seja 'false', retorna um erro 404
			return res.status(404).json({ msg: itsExist.res });
		}
		
		//verifica se o usuário inseriu uma imagem nova
		if(image){
			//armazena a url da imagem antiga para exclusão
			oldImage_url = itsExist.res;
			console.log("URL antiga: " + oldImage_url);

			//cria o blob da nova imagem e armazena a URL gerada
			newImage_url = await updateBlob('ARTICLE', id, image);
			console.log('URL da nova imagem: '+ newImage_url);

			//valida o tamanho da URL gerada
			if (newImage_url.length > 2048) {
				if (newImage_url) {await deleteBlob(newImage_url)};
				return res.status(400).json({msg: `A URL do avatar ultrapassou o limite de ${limitLength} caracteres.`});
			}else{
				//aloca a url para a array
				allData[1] = newImage_url;
			}
		}

		//chama a procedure de modificação e coloca os novos dados tratados
		const query  = 'CALL ModifyArticle(?);';
		const values = [allData];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		//chama a função para deletar o blob da antiga imagem
		if (oldImage_url) {await deleteBlob(oldImage_url)};

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

//função assíncrona para verificar existência do artigo e captar URL da imagem de thumbnail
async function verifyImage(req){
	const id = req;

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	//exclusão do antigo blob que está armazenado
	//chama a procedure de visualização para captar a URL de imagem
	const query  = `SELECT * FROM ViewAllArticle WHERE pk_IDArticle = (?);`;
	const values = id;

	//envia a query e retorna resposta do banco
	const [results] = await executeConnection.query(query, values);
	results;

	//caso não tenha registro associado ao ID selecionado, interrompe o processo
	if (results.length <= 0){
		return ({status: false, res: 'O artigo selecionado não existe.'});
	}else{
		//retorna URL retornada em caso de sucesso
		return ({status: true, res: `${results[0].image_article}`});
	}
}

export default updateArticle;