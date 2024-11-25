//bibliotecas usadas
import { BlobServiceClient} from '@azure/storage-blob';       //biblioteca de comandos Azure para blob

//importação do arquivo de configuração .env
import 'dotenv/config';

//funções externas
import connection  from '../../../data/connection.js';		//conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js'; //verifica se o dado ultrapassa o limite de caracteres
import deleteBlob  from '../../../middleware/deleteImage.js';//extrai e exclui o blob pela URL

//variáveis de ambiente
const connection_azure = process.env.STORAGE_URL_AZURE;
const blob_azure       = process.env.CONTANEIR_AZURE;

//função assíncrona para adicionar uma nova cadeia de missões
const createQuest 	=
async (req, res)    => {
	//array de requisição dos dados
	const {
		description_3, XP_3, 
		description_2, XP_2, 
		description_1, XP_1,
		blob_title, blob_description 
	} = req.body;
	const image = req.file;

	//validação de campo vazio
	if ( 
		!description_3 || !XP_3	  	  || 
		!description_2 || !XP_2	  	  || 
		!description_1 || !XP_1	  	  || 
		!image   	   || !blob_title || 
		!blob_description 
	){
		return res.status(422).json({ msg: "É obrigatório preencher todos os campos para criar uma cadeia de missões." });
	};

    //array com dados que contém limite de campo
    const data = [
        ["descrição da terceira missão", description_3], 
        ["descrição da segunda missão",  description_2], 
        ["descrição da primeira missão", description_1],  
        ["Título do badge",              blob_title], 
        ["Descrição da badge",           blob_description]
    ];

	//array variável que armazena o limite dos campos no banco de dados
	const limitLength = [120, 120, 120, 40, 120];

	//verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; //captura o título e valor do campo

		if (checkLength(value, limitLength[i])) {
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
		};
	};

    //tratando nome de arquivo original
    let validNameArchive = req.file.originalname
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '');

    //nomeação do novo arquivo
    const blobName = `QUEST-NEW-DATE${Date.now()}-NAME${validNameArchive}`; //formata nome com ID e data

	//executa a conexão com o banco de dados
	let executeConnection = await connection();

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
        newImage_url = blockBlobClient.url;
        console.log("URL gerada: " + newImage_url);

        //validação de tamanho da URL gerada
        if (newImage_url.length > 2048) {
            return res.status(400).json({msg: `A URL do novo badge ultrapassou o limite de 2048 caracteres.`});
        }

		//chama a procedure de criação e coloca os dados	
		const query  = `CALL CreateQuestAndBadge(?, ?, ?, ?, ?, ?, ?, ?, ?);`;
		const values = [ 
            description_3, XP_3, 
            description_2, XP_2, 
            description_1, XP_1,
			newImage_url,  blob_title, blob_description
      ];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		//confirma a transação
		await executeConnection.commit();

		return res.status(200).json({msg:"Cadeia de missões criada com sucesso.", url_blob: `${newImage_url}`});
	}catch(error){
		//reverte a query e exclui o blob gerado
		if (executeConnection) {await executeConnection.rollback()};
		if (newImage_url) {await deleteBlob(newImage_url)};

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