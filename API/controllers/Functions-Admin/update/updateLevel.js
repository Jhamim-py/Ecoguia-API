const connection = require('../../../data/connection');        //conexão com o banco de dados
const checkXp    = require('../../../utils/checkXp');          //checar e modificar o xp,level e quest do usuário

// função de modificação de level do usuário que pode ser exportada
exports.updateLevel = 
async (req, res) => {  //função assíncrona com parâmetros de requisição e resposta
    
    userID = req.user.id;  //pegando o id do usuário pelo token
    //pegando os dados a serem modificados
    const dados = await checkXp(userID);                             // variável responsável por armazenar os dados
   
    //verificano os dados
    console.log(dados);
    
    const executeConnection = await connection.getConnection();//variável de conexão com o banco de dados
    
    const xp    = dados[0]; //armazenando o xp do usuário
    const level = dados[1]; //armazenando o level do usuário
    const quest = dados[2]; //armazenando a quest do usuário
        
    //try catch para modificar o level do usuário
    try{
        // query para modificar o level do usuário  
        const query ="CALL ModifyLevelUser(?, ?, ?, ?);";
        const values = [userID, xp, level, quest];

        // envio de query e captação de resposta
        const [results] = await executeConnection.query(query, values);
        if (results > 0){
            res.status(200).json(results);
        }else{
            return res.status(404).json({ msg: "Algo deu errado ao modificar o level no banco de dados, tente novamente." });
        };
    } catch(erro){
        console.log(erro) //verificação
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
}