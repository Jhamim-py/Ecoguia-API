//importação do arquivo de configuração .env
import 'dotenv/config';

//funções externas
import connection  from '../../../data/connection.js';		   //conexão com o banco de dados
import updateBlob  from '../../../middleware/updateImage.js';//extrai e adiciona o blob pela imagem tratada pelo Multer
import deleteBlob  from '../../../middleware/deleteImage.js';  //extrai e exclui o blob pela URL

//função assíncrona para modificar uma avatar
const updateAvatar =
async (req, res) => {
    //array de requisição dos dados
    const avatarId  = req.body.ID_avatar;
    const newAvatar = req.file;

	//verifica se o campo de identificação está preenchido
    if (!avatarId || !newAvatar) {
        // validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório preencher todos os campos." });
    };
    
    //executa a conexão com o banco de dados
	const executeConnection = await connection();

	//inicializa as variáveis de URL de imagem
	let newImage_url = null;
	let oldImage_url = null;
    
    try{
        //verifica se existe avatar com este ID
		const itsExist = await verifyImage(avatarId);

        //valida o resultado
		if (!itsExist.status){
			//caso seja 'false', retorna um erro 404
			return res.status(404).json({ msg: itsExist.res });
		}else{
			//caso não, armazena a url da antiga imagem para exclusão
			oldImage_url = itsExist.res;
			console.log("URL antiga: " + oldImage_url);
        }

        //cria o blob da nova imagem e retorna a URL
        newImage_url = await updateBlob('AVATAR', avatarId, newAvatar);
		console.log('URL da nova imagem: '+ newImage_url);

        //validação de tamanho da URL gerada
        if (newImage_url.length > 2048) {
            if (newImage_url) {await deleteBlob(newImage_url)};
            return res.status(400).json({msg: `A URL do avatar ultrapassou o limite de ${limitLength} caracteres.`});
        }

        //chama a procedure de modificação e coloca os novos dados
        const query  = "CALL ModifyAvatar(?, ?)";
        const values = [avatarId, newImage_url];

		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

        //chama a função para deletar o blob pela URL anteriormente armazenada
		if (oldImage_url) {await deleteBlob(oldImage_url)};

		return res.status(200).json({msg:"Avatar alterado com sucesso.", avatar_url: newImage_url});
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

//função assíncrona para verificar existência do avatar e captar URL de imagem do avatar
async function verifyImage(req){
	const id = req;

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	//chama a procedure de visualização para verificar registro
    const query  = `SELECT * FROM ViewAllAvatar WHERE pk_IDAvatar = (?);`;
    const values = id;

	//envia a query e retorna resposta do banco
	const [results] = await executeConnection.query(query, values);
	results;

	//caso não tenha registro associado ao ID selecionado, interrompe o processo
	if (results.length <= 0){
		return ({status: false, res: 'O avatar selecionado não existe.'});
	}else{
		//caso tenha, retorna URL do avatar
		return ({status: true, res: `${results[0].blob_avatar}`});
	}

}

export default updateAvatar;