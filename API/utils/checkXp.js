
const connection = require('../data/connection') ////conexão com o banco de dados

async function checkXp (id){ //função assíncrona com uma promise

 const executeConnection = connection.getConnection(); // variável que armazena a execução de conexão com o banco de dados
     return new Promise((resolve) => {  //retorna uma promise com o resultado da query executada
 
    try{
        // query para pegar os dados de xp,level e quest do usuário
        const query = `CALL SelectXPUser(?)`
        const value = id
        // envio de query e captação de resposta
        executeConnection.query(query,value,(erro,result) => {
            if(erro){
                console.log(erro)//verificação
                return res.status(500).json({ msg: "Algo deu errado ao executar a query de verificação de level do usuário" });
            }
        // armazena o valor retornado numa variável 
        const response = result[0][0]
        const userXp = response.XP_user              //armazena o xp atual do usuário
        const addXp  = userXp + response.XP_nowquest //adiciona o xp da quest ao xp do usuário
        let level  = response.ID_nowlevel            //armazena o level do usuário
        const  quest = response.ID_nowquest + 1      //armazena o valor da próxima quest do usuário
            
        //verificar se a quantidade de xp para o próximo level foi alcançada
        if(addXp >= response.XP_nowlevel){
            level = level + 1
        }
        else{
            level = null
        }
        //retorno da promise
        resolve([addXp,level,quest])

     })}
     catch(error){
       console.log(error) //verifica
     }
  })
}
module.exports = checkXp; 