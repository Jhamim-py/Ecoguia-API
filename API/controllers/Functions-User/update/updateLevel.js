const connection = require('../../../data/connection');        //conexão com o banco de dados
const checkXp    = require('../../../utils/checkXp');          //checar e modificar o xp,level e quest do usuário

// função de modificação de level do usuário que pode ser exportada
exports.updateLevel = 
async (req, res) => {  //função assíncrona com parâmetros de requisição e resposta
    
    const userID = req.user.id;  //pegando o id do usuário pelo token
    const {type, xp_material,peso} = req.body
    //pegando os dados a serem modificados
    const dados = await checkXp(userID, type, xp_material, peso); // variável responsável por armazenar os dados
    
    const executeConnection = await connection.getConnection();// variável que armazena a execução de conexão com o banco de dados
    
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
        results;
        
        res.status(200).json({msg:"Level atualizado com sucesso: "+results});
    } catch(error){
        console.error(error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    }
};
