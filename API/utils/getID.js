const connection       = require('../data/connection'); // conexão com o banco de dados

// função de verificação de e-mail no banco de dados para recuperação de senha
module.exports = 
function getID(email) {
    const executeConnection = connection.getConnection();

    try{
        // armazena a query que chama a view que retorna somente o ID, nickname e e-mail
        const sql = `SELECT * FROM ViewAllEmails WHERE email=?;`;
        const value = email;

        // envio de query para o banco de dados e retorna o resultado
        executeConnection.query(sql, value, (err, results) => {
            if (err) {
            //caso ocorra erro ao executar a query, retorna o erro no console
                console.error(err);
            }else{
                console.log(results);     //verificação
                return results.pk_IDuser; //retornar id do susário
            };
        });
    }catch(error){
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }

    executeConnection.end();        //fecha a conexão com banco de dados
};