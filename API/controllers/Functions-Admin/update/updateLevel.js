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
    
    const executeConnection = connection.getConnection();//variável de conexão com o banco de dados
    
    const xp = dados[0];    //armazenando o xp do usuário
    
    const level = dados[1]; //armazenando o level do usuário
    
    const quest = dados[2]; //armazenando a quest do usuário
    
    console.log(xp); //verifica
    
 //try catch para modificar o level do usuário
try{
     // query para modificar o level do usuário  
    const query ="CALL ModifyLevelUser(?,?,?,?);"
    const values = [userID, xp, level, quest];
    // envio de query e captação de resposta
    executeConnection.query(query, values, (erro, result) => {
        if(erro){
            console.log(erro) //verificação
            return res.status(500).json({ msg: "Algo deu errado ao executar a query" });
        }
        if(result){
            res.status(200).json(result);
        }
    })
} catch(erro){
        console.log(erro) //verificação
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }
    


}