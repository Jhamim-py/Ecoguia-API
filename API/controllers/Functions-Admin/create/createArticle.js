//bibliotecas usadas
import { BlobServiceClient} from '@azure/storage-blob';   

//importação do arquivo de configuração .env
import 'dotenv/config';

//funções externas
import connection  from '../../../data/connection.js';		//conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js'; //verifica se o dado ultrapassa o limite de caracteres
import deleteBlob  from '../../../middleware/deleteImage.js';//extrai e exclui o blob pela URL

//variáveis de ambiente
const connection_azure = process.env.STORAGE_URL_AZURE;
const blob_azure       = process.env.CONTANEIR_AZURE;

//função assíncrona para adicionar um novo artigo
const createArticle   =
async (req, res) 	  => {
  	//array de requisição dos dados
	const {title, category, description, reference} = req.body;
	const image = req.file;

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
	
	//array com dados que contém limite de campo
	const data = [
		['título do artigo',  title], 
		['categoria',  		  categoryClean], 
		['descrição', 		  description], 
		['URL de referência', reference]
	];

	//array variável que armazena o limite dos campos no banco de dados
	const limitLength = [280, 40, 65535, 2048];


	//verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; //captura o título e valor do campo

		if (checkLength(value, limitLength[i])) { //retorna o campo que ultrapassou o limite
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
		};
	};

	//tratando nome de arquivo original
	let validNameArchive = req.file.originalname
	.trim()
	.toLowerCase()
	.replace(/\s+/g, '-')
	.replace(/[^a-z0-9.\-_]/g, '');

    //nomeação do novo arquivo de imagem
    const blobName = `ARTICLE-NEW-DATE${Date.now()}-NAME${validNameArchive}`; //formata nome com ID e data

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	//inicializa a variável de URL
	let newImage_url = null;

	try{
		//inicia transação
		await executeConnection.beginTransaction();

		//estabelecendo conexão com o Azure
		const blobServiceClient = BlobServiceClient.fromConnectionString(connection_azure);
		const containerClient   = blobServiceClient.getContainerClient(blob_azure);
		
		//cliente blob para upload no Azure
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);

		//envia o arquivo tratado para o Azure
		await blockBlobClient.uploadData(image.buffer, {
			blobHTTPHeaders: { blobContentType: image.mimetype },
		});

		//obtém a URL gerada do novo arquivo
		const newImage_url = blockBlobClient.url;
        console.log("URL gerada: " + newImage_url);

		//validação de tamanho da URL gerada
		if (newImage_url.length > 2048) {
			return res.status(400).json({msg: `A URL da imagem de artigo ultrapassou o limite de 2048 caracteres.`});
		}

		//chama a procedure de criação e coloca os dados
		const query  = `CALL CreateArticle(?, ?, ?, ?, ?);`;
		const values = [newImage_url, title, categoryClean, description, reference];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		//confirma a transação
		await executeConnection.commit();
		
		return res.status(200).json({msg:"Artigo criado com sucesso."});
	}catch(error){
		//reverte a query e exclui o blob gerado
		if (executeConnection) {await executeConnection.rollback()};
		if (newImage_url)      {await deleteBlob(newImage_url)};

		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(400).json({ 
				msg: `Erro ao tentar criar cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			//caso dê algo errado, retorna no console e avisa
			console.error("Algo deu errado ao criar o artigo, tente novamente:", error);
			return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
		};
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
}; 

export default createArticle;