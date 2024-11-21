//bibliotecas usadas
import { BlobServiceClient} from '@azure/storage-blob';       //biblioteca de comandos Azure para blob

//importação do arquivo de configuração .env
import 'dotenv/config';

//variáveis de ambiente
const connection_azure = process.env.STORAGE_URL_AZURE;
const blob_azure       = process.env.CONTANEIR_AZURE;

export default async function deleteBlobByUrl(blobUrl) {
  try {
    // Conecte-se ao Blob Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(connection_azure);

    // Extraia o nome do blob da URL
    const urlParts = new URL(blobUrl);
    const blobName = urlParts.pathname.split("/").slice(2).join("/"); // Nome do blob

    // Obtenha o client para o container e o blob
    const containerClient = blobServiceClient.getContainerClient(blob_azure);
    const blobClient      = containerClient.getBlockBlobClient(blobName);

    // Exclua o blob
    const deleteResponse = await blobClient.deleteIfExists();
    if (deleteResponse.succeeded) {
      console.log(`Blob "${blobName}" excluído com sucesso.`);
      return { success: true, message: `Blob "${blobName}" excluído com sucesso.` };
    } else {
      console.log(`Blob "${blobName}" não encontrado ou já foi excluído.`);
      return { success: false, message: `Blob "${blobName}" não encontrado ou já foi excluído.` };
    }
  } catch (error) {
    console.error("Erro ao excluir o blob:", error.details.message);
    return { success: false, message: error.message };
  }
};