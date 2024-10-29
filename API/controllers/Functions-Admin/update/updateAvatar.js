const connection     = require('../../../data/connection');

// função de modificação do avatar do usuário que pode ser exportada
// adaptar posteriormente para o Azure...
exports.updateAvatar =
async (req, res) => {
    const avatarId    = req.body.avatarId;  // pegando o ID do avatar
    // URL do novo avatar
    const newAvatar   = req.body.newAvatar;
    const limitLength = 2048;

    // verifica se o tamanho da URL está aceitável
    if (checkLength(newAvatar, limitLength)) {
        return res.status(400).json({ msg: `A URL da imagem ultrapassou o limite de ${limitLength} caracteres.` });
    };

    //executa a conexão com o banco de dados
    const executeConnection = await connection.getConnection();

    // Verifica se o novo avatar foi fornecido
    // mais uma função de verificar campo vazio, etc.
    if (!newAvatar) {
        return res.status(400).json({ msg: "Novo link do avatar não fornecido." });
    }

    try{
        // query para modificar o avatar do usuário
        const query  = "CALL ModifyAvatar(?, ?)";
        const values = [avatarId, newAvatar]; // passando o ID do avatar e a nova URL

		//executa a query
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Avatar alterado com sucesso."});
	}catch(error){
		console.error("Algo deu errado ao alterar o avatar, tente novamente:", error);
		return res.status(500).json({msg: "Erro interno no servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};
