//funções externas
const connection     = require('../../../data/connection');     //conexão com o banco de dados

//função assíncrona para modificar uma avatar
// adaptar posteriormente para o Azure...
exports.updateAvatar =
async (req, res) => {
    //(Mudar isso?? Otimizar!!)

    //array de requisição dos dados
    const avatarId    = req.body.avatarId;
    const newAvatar   = req.body.newAvatar;

    //array variável que armazena o limite do campo no banco de dados
    const limitLength = 2048;    

    if (!newAvatar) {
        // validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório preencher o campo de nova URL." });
	
        //verifica se já existe um avatar deste tipo no banco de dados
	    //...?

    }else if (checkLength(newAvatar, limitLength)){
        //verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
        return res.status(400).json({ msg: `A URL da imagem ultrapassou o limite de ${limitLength} caracteres.` });
    };

    //executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    try{
        //chama a procedure de criação e coloca os dados
        const query  = "CALL ModifyAvatar(?, ?)";
        const values = [avatarId, newAvatar];

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