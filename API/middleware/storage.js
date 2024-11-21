// Função para extrair o nome do blob da URL
const extractBlobNameFromUrl = (url) => {
    const urlObject = new URL(url);
    const pathSegments = urlObject.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
};
 
// Função para excluir um blob usando sua URL
exports.deleteAzure   =
async (blobUrl) 	  => {
    try {
        // Extrai o nome do blob da URL
        const blobName = decodeURIComponent(extractBlobNameFromUrl(blobUrl));
 
        // Pega o nome do container
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
 
        // Gera um cliente Blob para o blob a ser excluído
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
 
        // Exclui o blob
        await blockBlobClient.delete();
 
    } catch (error) {
        console.log('Error deleting blob from Azure:', error);
        throw error;
    }
};