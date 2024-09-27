const { json }    = require('express');                   // biblioteca Express 
const connection  = require('../../../data/connection');  // conexão com o banco de dados

// função de visualização de perfil que pode ser exportada
exports.getPerfil =
async (req, res) => {   //função assíncrona com parâmetros de requisição e resposta
    const executeConnection = await connection.getConnection(); // variável que armazena a execução de conexão com o banco de dados
    const userID  = req.user.id;                                // variável que armazena o ID do usuário

    try{
        // armazena a query que chama a procedure de visualização de perfil
        const query = `CALL SelectProfile(?);`;
        const values = userID;

        // Executa a consulta
        const [results] = await executeConnection.query(query, values);
        if(results.length > 0){
            return res.status(200).json({results});
        }else{
            return res.status(500).json({ msg: "Algo deu errado ao visualizar o perfil, tente novamente." });
        };
    }catch(error){
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    
    }finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};