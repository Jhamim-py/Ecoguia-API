//bibliotecas usadas
import { BlobServiceClient} from '@azure/storage-blob';       //biblioteca de comandos Azure para blob

//importação do arquivo de configuração .env
import 'dotenv/config';

//função assíncrona para gerar novo blob com imagem recebida do multer
export default 
async function updateImage(name, id, image){
    //variáveis de ambiente
    const connection_azure = process.env.STORAGE_URL_AZURE;
    const blob_azure       = process.env.CONTANEIR_AZURE;

    //tratando nome de arquivo original
    let validNameArchive = image.originalname
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '');

	//nomeação do novo arquivo
	const blobName = `${name}-${id}-DATE${Date.now()}-NAME${validNameArchive}`; //formata nome com ID e data
    
	try{
		//estabelecendo conexão com o Azure
		const blobServiceClient = BlobServiceClient.fromConnectionString(connection_azure);
		const containerClient   = blobServiceClient.getContainerClient(blob_azure);
		
		//cliente blob para upload no Azure
		const blockBlobClient   = containerClient.getBlockBlobClient(blobName);
		
		//envia o arquivo tratado para o Azure
		await blockBlobClient.uploadData(image.buffer, {
			blobHTTPHeaders: { blobContentType: image.mimetype },
		});

		//obtém a URL gerada do novo arquivo
		const newImage_url = blockBlobClient.url;

		return newImage_url;
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao criar novo blob e gerar URL, tente novamente:", error);
	}
}