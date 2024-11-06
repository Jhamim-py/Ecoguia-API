const connection = require('../data/connection'); // conexão com o banco de dados

// função de verificação de e-mail no banco de dados para recuperação de senha
module.exports = 
async function getID(email) {
    const executeConnection = await connection.getConnection();

    try{
        // armazena a query que chama a view que retorna somente o ID, nickname e e-mail
        const query = `SELECT * FROM ViewAllEmails WHERE email=?;`;
        const values = email;

        // envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query, values);
        if (results != 0) {
            return results[0].pk_IDuser; //retornar id do susário
        };
    }catch(error){
        console.error("Algo deu errado ao extrair ID, tente novamente: ", error);
    }finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};