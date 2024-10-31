const connection = require('../data/connection'); //conexão com o banco de dados

//função assíncrona com uma promise
module.exports =
async function checkXp(id,type,xp_material,peso){ 
    // variável que armazena a execução de conexão com o banco de dados
    const executeConnection = await connection.getConnection(); 
    
    //retorna uma promise com o resultado da query executada
    return new Promise( async (resolve) => {
        try{
            // query para pegar os dados de xp,level e quest do usuário
            const query  = `CALL SelectXPUser(?);`;
            const values = id;
            // envio de query e captação de resposta
            const [results] = await executeConnection.query(query,[values]);
            if(results.length > 0 && type == 0){
                calculateLevelQuest(results);             
            }
            else if(results.length > 0 && type == 1){
                calculateLevelMaterial(results);
            }
            else{
                console.error("Algo deu errado ao verificar os dados de XP do usuário." );
            };
            
            function calculateLevelQuest(results){
                // armazena o valor retornado numa variável 
                const response = results[0][0];
                
                const userXp = response.XP_user;              //armazena o xp atual do usuário
                const addXp  = userXp + response.XP_nowquest; //adiciona o xp da quest ao xp do usuário

                const quest  = response.ID_nextquest;         //armazena o valor da próxima quest do usuário
                let   level  = response.ID_nowlevel;          //armazena o level do usuário

                //verifica se a quantidade de xp para o próximo level foi alcançada
                if (addXp >= response.XP_nowlevel){
                    level = response.ID_nextlevel;
                }
                else{
                    level = null;
                }
                //retorno da promise
                resolve([addXp, level, quest]);
            };
            
            function calculateLevelMaterial(results){
                // armazena o valor retornado numa variável 
                const response = results[0][0];
                
                const userXp = response.XP_user; 
                const xpMaterial = xp_material
                const pesoMaterial = peso
                const calculate = xpMaterial / 1000
                const xp_total = calculate * pesoMaterial      
                const addXp   = userXp + xp_total

                let level  = response.ID_nowlevel;      //armazena o level do usuário

                //verifica se a quantidade de xp para o próximo level foi alcançada
                if (addXp >= response.XP_nowlevel){
                    level = response.ID_nextlevel;
                }
                else{
                    level = null;
                }
                const quest = null
                //retorno da promise
                resolve([addXp, level, quest]);
            }
            

        }catch(error){
            console.error("Algo deu errado ao atualizar XP, tente novamente: ", error); 
        }finally {
            // Fecha a conexão com o banco de dados, se foi estabelecida
            if (executeConnection) {
                await executeConnection.end();
            };
        };
    });
};