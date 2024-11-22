//bibliotecas usadas
import { BlobServiceClient} from '@azure/storage-blob';       //biblioteca de comandos Azure para blob

//importação do arquivo de configuração .env
import 'dotenv/config';

//funções externas
import connection           from '../../../data/connection.js';		//conexão com o banco de dados
import deleteBlob  from '../../../utils/extractNameBlob.js';        //extrai e exclui o blob pela URL

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
    
    //tratando nome de arquivo original
    let validNameArchive = req.file.originalname
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '');
    
    //nomeação do novo arquivo
    const blobName = `AVATAR-${avatarId}-DATE${Date.now()}-NAME${validNameArchive}`; //formata nome com ID e data
    
    //executa a conexão com o banco de dados
	const executeConnection = await connection();

    //inicializa a variável de URL
	let newImage_url = null;
    
    try{
        //estabelecendo conexão com o Azure
        const blobServiceClient = BlobServiceClient.fromConnectionString(connection_azure);
        const containerClient   = blobServiceClient.getContainerClient(blob_azure);
        
        //cliente blob para upload no Azure
        const blockBlobClient   = containerClient.getBlockBlobClient(blobName);

        //envia o arquivo tratado para o Azure
        await blockBlobClient.uploadData(newAvatar.buffer, {
            blobHTTPHeaders: { blobContentType: newAvatar.mimetype },
        });

        //obtém a URL gerada do novo arquivo
        const newAvatar_url = blockBlobClient.url;
        console.log(newAvatar_url);

        //validação de tamanho da URL gerada
        if (newAvatar_url.length > limitLength) {
            return res.status(400).json({msg: `A URL do avatar ultrapassou o limite de ${limitLength} caracteres.`});
        }

        //exclusão do antigo blob que está armazenado
		//chama a procedure de visualização para captar a URL de imagem
		const query  = `SELECT blob_avatar FROM ViewAllAvatar WHERE pk_IDAvatar = (?);`;
		const values = avatarId;

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		if (results.length <= 0){
            return res.status(404).json({ msg: "O avatar selecionado não existe." });
		}

        //armazena URL retornada
        newImage_url = results[0].blob_avatar;
        console.log("URL antiga captada: " + newImage_url);

        //chama a procedure de modificação e coloca os novos dados
        const query1  = "CALL ModifyAvatar(?, ?)";
        const values1 = [avatarId, newAvatar_url];

		//envia a query e retorna caso tenha dado certo
		const [results1] = await executeConnection.query(query1, values1);
		results1;

        //chama a função para deletar o blob pela URL anteriormente armazenada
		if (newImage_url) {await deleteBlob(newImage_url)};

		return res.status(200).json({msg:"Avatar alterado com sucesso.", avatar_url: newAvatar_url});
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