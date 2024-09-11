// componentes do Node
const bcrypt         =  require('bcrypt');                  // gera um token aleatório

// variáveis de ambiente para importar funções
const connection     = require('../../../data/connection'); // conexão com o banco de dados

// função de exclusão que pode ser exportada
exports.deleteUser = 
async (req, res) => {    //função assíncrona com parâmetros de requisição e resposta
    const userID    = req.user.id;                          // variável que armazena o ID do usuário
    const {pwdHash} = req.body;                             // variável que armazena o hash da senha

    try{
        // executa procedure de seleção de usuário 
        const query = `SELECT * FROM ViewAllEmails WHERE pk_IDuser=?`;
        const value = userID;

        // envio de query de visualização para o banco de dados e armazena o resultado
        const executeConnection = connection.getConnection();
        executeConnection.query(query, value, async function(error, res){
            if (error) {
                console.log(error); //verificação
                return res.status(500).json({ msg: "Algo deu errado ao buscar os dados do usuário, tente novamente."});
            };
            if (res.length == 0) {
                return res.status(404).json({ msg: "Usuário não encontrado." });
            };

            // armazena as informações recebidas
            const userInfos = res[0];

            // checa a senha bate com o hash armazenado no banco através da biblioteca bcrypt
            const checkPwd  = await bcrypt.compare(pwdHash, userInfos.pwd);
            if ( !checkPwd ){
                return res.status(422).json({ msg: "Senha incorreta." });
            }
            
            const pwd = userInfos.pwd;
            try{
                // executa procedure de exclusão
                const query2  = `CALL DeleteUser(?,?)`;
                const values2 = [userID,pwd];

                // envio de query de exclusão para o banco de dados
                connection.query(query2, values2, function(error, res){
                    if (error) {
                        console.log(error); //verificação
                        return res.status(500).json({ msg: "Algo deu errado ao deletar o usuário, tente novamente." });
                    };
                    if (res)  {
                        return res.status(200).json({ msg: "Usuário deletado com sucesso." });
                    }
                });
            }catch(error){
                console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
                res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
            };

        });
    }catch(error){
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }
    // fecha a conexão com o banco de dados
    connection.end();
};