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
        const [results] = executeConnection.query(query, values);
        if (results > 0) {
            return results.pk_IDuser; //retornar id do susário
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