// variáveis de ambiente para importar funções
const connection       = require('../../../data/connection');     // conexão com o banco de dados

// função de modificação que pode ser exportada
exports.updateProfile =
async (req, res) => {    //função assíncrona com parâmetros de requisição e resposta
    const userID = req.user.id;                          // variável que armazena o ID do usuário
    const executeConnection = connection.getConnection();// variável que armazena a execução de conexão com o banco de dados

    let {name, lastname, avatar} = req.body;              // variável local responsável por armazenar os dados
    
    // verifica se os campos estão vazios e os formata como nulo
    if(name     == '') {name = null;};
    if(lastname == '') {lastname = null;};
    if(avatar   == '') {name = null;};

    try{
        // executa procedure de modificação que só acontece perante ID do usuário
        const query = `CALL ModifyProfile(?, ?, ?, ?)`;
        const values =[userID, name, lastname, avatar];

        // envio de query para o banco de dados e retorna o resultado
        executeConnection.query(query, values, async function(error, res){
            if (error) {
                console.log(error);
                return res.status(500).json({msg: "Algo deu errado ao atualizar o perfil do usuário, tente novamente."});
            };
            if (res) {
                return res.status(200).json({msg: "Perfil do Usuário atualizado com sucesso."});
            };
        });

    }catch(error){
        console.error("Algo deu errado ao atualizar o perfil do usuário, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    };

    // fecha a conexão com o banco de dados
    connection.end();
};