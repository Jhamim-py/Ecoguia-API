// componentes do Node
const crypto = require('crypto')  // gera token aleatório

// variáveis de ambiente para importar funções
const connection       = require('../../../data/connection');    // conexão com o banco de dados
const appCache         = require('../../../utils/cache');        // armazena os dados de usuário, usado posteriormente para validações
const sendEmail        = require('../../../utils/sendEmail');    // importa função de enviar token por email

// importação do arquivo de configuração .env
require('dotenv').config();

// função de visualização que pode ser exportada
exports.getForget =
async (req, res)  => {
    const {email} = req.body;                               // variável responsável por armazenar os dados
    const executeConnection = connection.getConnection();   // variável que armazena a execução de conexão com o banco de dados
   
    try{
        // verificar existência do E-mail no Banco de Dados através do uso de View
        const query = `SELECT * FROM ViewAllEmails WHERE pk_IDuser=?`;
        const value = email;    //aloca o valor colocado no campo 'E-mail' para essa variável

        // envio de query para o banco de dados e retorna o resultado
        executeConnection.query(query, value, async function(error, res){
            if (error) {
                console.log(error);
                return res.status(500).json({ msg: "Algo deu errado ao buscar usuários, tente novamente."});
            };
            if (res.length > 0) {
                return res.status(422).json({ msg: "Este e-mail já está em uso."});
            };
        });
        
        // cria e armazena o token no cachê da app
        const sendToken = crypto.randomBytes(10).toString("hex");
        appCache.set(sendToken,true);
        
        console.log(appCache.get(tokenForget)); //verificação
        
        // envia o token armazenado no e-mail
        const message = `Insira este token no aplicativo para validar seu e-mail. Expira em 30 minutos. \n Token: ${sendToken}`;
        sendEmail(message);

    }catch(error){
        console.error("Algo deu errado ao realizar a autenticação, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }; 

    // fecha a conexão com o banco de dados
    connection.end();
}

