//bibliotecas usadas
import { BlobServiceClient} from '@azure/storage-blob';             //biblioteca de comandos Azure para blob
import 'dotenv/config';

//funções externas
import connection           from '../../../data/connection.js';		//conexão com o banco de dados

//variáveis de ambiente
const connection_azure = process.env.STORAGE_URL_AZURE;
const blob_azure       = process.env.CONTANEIR_AZURE;

//função assíncrona para modificar uma avatar
const updateAvatar =
async (req, res) => {
    //array de requisição dos dados
    const avatarId    = req.body.ID_avatar;
    const newAvatar   = req.file;

    //array variável que armazena o limite do campo no banco de dados
    const limitLength = 2048;    

    if (!avatarId || !newAvatar) {
        // validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório preencher todos os campos." });

    };
    
    //nomeação do novo arquivo
    const blobName        = `${avatarId}-${Date.now()}-${req.file.originalname}`; //formata nome com ID e data
    
    //executa a conexão com o banco de dados
	const executeConnection = await connection();
    
    try{
        //estabelecendo conexão com o Azure
        const blobServiceClient = BlobServiceClient.fromConnectionString(connection_azure);
        const containerClient   = blobServiceClient.getContainerClient(blob_azure);
        
        //cliente blob para upload no Azure
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        //envia o arquivo tratado para o Azure
        await blockBlobClient.uploadData(newAvatar.buffer, {
            blobHTTPHeaders: { blobContentType: newAvatar.mimetype },
        });

        //obtém a URL gerada do novo arquivo
        const newAvatar_url = blockBlobClient.url;
        console.log(newAvatar_url);//verificação!!!!

        //validação de tamanho da URL gerada
        if (newAvatar_url.length > limitLength) {
            return res.status(400).json({msg: `A URL do avatar ultrapassou o limite de ${limitLength} caracteres.`});
        }

        //chama a procedure de criação e coloca os dados
        const query  = "CALL ModifyAvatar(?, ?)";
        const values = [avatarId, newAvatar_url];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Avatar alterado com sucesso."});
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao modificar o avatar, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
    finally{
        if (executeConnection) {
            //fecha a conexão com o banco de dados
            await executeConnection.end();
        };
    };
};

export default updateAvatar;