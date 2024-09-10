const { json }    = require('express');                   // biblioteca Express 
const connection  = require('../../../data/connection');  // conexão com o banco de dados

// função de visualização de perfil que pode ser exportada
exports.getPerfil =
async (req, res) => {   //função assíncrona com parâmetros de requisição e resposta
    const executeConnection = connection.getConnection(); // variável que armazena a execução de conexão com o banco de dados
    const userID  = req.user.id;                          // variável que armazena o ID do usuário

    try{
        // armazena a query que chama a procedure de visualização de perfil
        const query = `CALL SelectProfile(?)`;
        const value = userID;

        // envio de query para o banco de dados e retorna o resultado
        executeConnection.query(query, value, async function(error, res){
            if(error){
                console.log(error)  //verificação
                return res.status(500).json({msg: "Algo deu errado ao visualizar o perfil, tente novamente."});
            };
            if(res){
                return res.status(200).json(res);
            };
        });
        
    }catch(error){
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }

    connection.end();           //fecha a conexão com banco de dados
};