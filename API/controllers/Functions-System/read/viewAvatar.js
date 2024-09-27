const connection = require('../../../data/connection') //conexão com o banco de dados


exports.viewAvatar =
async function (req,res) {
    //realiza a conexão com o banco de dados
    const executeConnection = await connection.getConnection();
    
    try{
    // Executa a consulta
    const query = "SELECT * FROM ViewAllAvatar"   
    //executa a query
    const result = await executeConnection.query(query)
    if(result <= 0){
        return res.status(400).json({message: "Erro ao buscar avatar"})
    }
    //retorna o resultado da query
    return res.status(200).json(result)
    }catch(erro){
        console.log(erro)
    }
    finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };

 
}