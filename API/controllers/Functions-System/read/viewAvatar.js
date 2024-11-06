const connection = require('../../../data/connection') //conexão com o banco de dados

exports.viewAvatar =
async function (req, res) {
	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    try{
        const query = "SELECT * FROM ViewAllAvatar;";

        //executa a query
        const [results] = await executeConnection.query(query);
        results;

        if(results.length <= 0){
            return res.status(404).json({msg: "Não foram encontrados avatares no banco de dados."});
        };

        return res.status(200).json({msg: "Avatares disponíveis: ", avatares: results});
    }catch(error){
        console.error("Erro ao visualizar registros de avatares: ", error);
        return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
    }
    finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
}