//bibliotecas usadas
import { BlobServiceClient} from '@azure/storage-blob';       //biblioteca de comandos Azure para blob

//importação do arquivo de configuração .env
import 'dotenv/config';


export default 
async function deleteImage(blobUrl) {
	//variáveis de ambiente
	const connection_azure = process.env.STORAGE_URL_AZURE;
	const blob_azure       = process.env.CONTANEIR_AZURE;

	try {
		//captura o nome do blob fornecido na URL
		const urlParts = new URL(blobUrl);
		const blobName = urlParts.pathname.split("/").slice(2).join("/"); // Nome do blob

		//estabelece conexão com o Azure
		const blobServiceClient = BlobServiceClient.fromConnectionString(connection_azure);
		const containerClient   = blobServiceClient.getContainerClient(blob_azure);

		//cliente blob para upload no Azure
		const blockBlobClient   = containerClient.getBlockBlobClient(blobName);
		
		//comando de exclusão
		const deleteResponse = await blockBlobClient.deleteIfExists();

		//verifica retorno
		if (deleteResponse.succeeded) {
			return `Blob "${blobName}" excluído com sucesso.`;
		} else {
			return `Blob "${blobName}" não encontrado ou já foi excluído.`;
		}
	} catch (error) {
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao deletar blob pela URL, tente novamente: ", error);
	}
};