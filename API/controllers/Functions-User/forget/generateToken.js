// componentes do Node
const crypto = require('crypto');  // gera token aleatório

// variáveis de ambiente para importar funções
const connection       = require('../../../data/connection');    // conexão com o banco de dados       
const sendEmail        = require('../../../utils/sendEmail');    // importa função de enviar token por email

// importação do arquivo de configuração .env
require('dotenv').config();

// função de visualização que pode ser exportada
exports.getForget =
async (req, res)  => {
    const {email} = req.body;                               // variável responsável por armazenar os dados
    const executeConnection = await connection.getConnection();   // variável que armazena a execução de conexão com o banco de dados
   
    try{
        // verificar existência do E-mail no Banco de Dados através do uso de View
        const query = `SELECT * FROM ViewAllEmails WHERE email=?`;
        const values = email;    //aloca o valor colocado no campo 'E-mail' para essa variável

        // envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query, values);
        if(results.length == 0){
            return res.status(422).json({msg: "Usuário não existe"});
        };
        
        // cria e armazena o token no cachê da app
        const sendToken = crypto.randomBytes(2).toString("hex");
    
        // envia o token armazenado no e-mail
        const message = `Insira este token no aplicativo para validar seu e-mail. Expira em 30 minutos. \n Token: ${sendToken}`;
        sendEmail(message,email);
        res.status(200).json({ msg: "email enviado",token:sendToken });

    }catch(error){
        console.error("Algo deu errado ao realizar a autenticação, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};