const connection =  require('../../../data/connection')

exports.getAllTips =
async (req,res) => {

    const executeConnection = await connection.getConnection(); // Variável para armazenar a conexão com o banco de dados
try{
      // Query para buscar todas as dicas armazenadas na tabela ViewAllTips
    const query = "SELECT * FROM ViewAllTips";
    const result = await executeConnection.query(query); // Executa a consulta
    if(result.length != 0){ // Verifica se há resultados

        // Retorna as dicas encontradas em formato JSON
        res.status(200).json(result[0])
    }
    else{
         // Se não encontrar nenhuma dica, retorna um erro 404
         return res.status(404).json({ msg: "Nenhuma dica disponível no momento." });
    }
}
    catch(error){
         // Caso ocorra um erro durante a execução, retorna um erro 500
         console.error("Algo deu errado ao buscar as dicas, tente novamente: ", error);
         return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }finally {
         // Fecha a conexão com o banco de dados, se foi estabelecida
         if (executeConnection) {
         await executeConnection.end();
     };
    };
}