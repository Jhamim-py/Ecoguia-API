const connection = require('../../../data/connection') //conexão com o banco de dados

exports.viewQuests =
async function (req,res) {
    const executeConnection = await connection.getConnection();
   
    try{
        const query = "SELECT * FROM ViewAllQuest"
        const result = await executeConnection.query(query)
        if(result <= 0){
            return res.status(400).json({message: "Erro ao buscar avatar"})
        }
        return res.status(200).json(result)
	}catch(error){
		console.error("Algo deu errado ao visualizar missões, tente novamente:", error);
		return res.status(500).json({msg: "Erro interno no servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
}