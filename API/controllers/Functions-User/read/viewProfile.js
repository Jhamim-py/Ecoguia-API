import express from 'express';                 // biblioteca Express 
import connection  from '../../../data/connection.js';    // conexão com o banco de dados

// função de visualização de perfil que pode ser exportada
const getProfile =
async (req, res) => {   //função assíncrona com parâmetros de requisição e resposta
    const executeConnection = await connection(); // variável que armazena a execução de conexão com o banco de dados
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
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }finally{
        // Fecha a conexão com o banco de dados
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};

export default getProfile;