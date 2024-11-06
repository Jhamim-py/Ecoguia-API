const { json }    = require('express');                   // biblioteca Express 
const connection  = require('../../../data/connection');  // conexão com o banco de dados

// função de visualização de perfil que pode ser exportada
exports.getPerfil =
async (req, res) => {   //função assíncrona com parâmetros de requisição e resposta
    const executeConnection = await connection.getConnection(); // variável que armazena a execução de conexão com o banco de dados
    const userID  = req.user.id;                                // variável que armazena o ID do usuário

    try{
        // Armazena a query que chama a procedure de visualização de perfil
        const query = `CALL SelectProfile(?);`;
        const values = userID;

        // Executa a consulta
        const [results] = await executeConnection.query(query, values);

        // Verifica se o usuário foi encontrado
        if (!results || results.length === 0) {
            return res.status(404).json({ msg: "Não foi possível encontrar usuário com este ID, tente novamente." });
        }
           
        return res.status(200).json({results});
    }catch(error){
        // Separado por tipo de erro
        switch(error.code){
            case ('ER_ACCESS_DENIED_ERROR'): //Acesso negado
                res.status(500).json({ msg: "Erro de autenticação com o banco de dados." });
            break;

            case ('ECONNREFUSED'): //Conexão recusada
                res.status(500).json({ msg: "Servidor offline. Tente novamente mais tarde." });
            break;
            default:
            // Erro genérico
            console.error(error);
            res.status(500).json({ msg: "Algo deu errado ao visualizar os dados de perfil, tente novamente." }); 
        };
    }finally{
        // Fecha a conexão com o banco de dados
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};