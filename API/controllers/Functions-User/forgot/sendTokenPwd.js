// componentes do Node
import crypto from 'crypto';  // gera token aleatório

// variáveis de ambiente para importar funções
import connection  from '../../../data/connection.js';   // conexão com o banco de dados 
import sendEmail   from '../../../utils/sendEmail.js';   // importa função de enviar token por email

// importação do arquivo de configuração .env
import 'dotenv/config';

// função que gera e envia um token para função 'esqueci senha'
const sendToken =
async (req, res)  => {
    const {email} = req.body;                                     // variável responsável por armazenar os dados
    const executeConnection = await connection();   // variável que armazena a execução de conexão com o banco de dados
   
    try{
        // verificar existência do e-mail no Banco de Dados através do uso da view
        const query  = `SELECT * FROM ViewAllEmails WHERE email=?`;
        const values = email;    //aloca o valor colocado no campo 'E-mail' para essa variável

        // envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query, values);
        if(results.length == 0){
            return res.status(422).json({msg: "Usuário não registrado no banco de dados."});
        };
        
        // cria e armazena o token no cachê da app
        const sendToken = crypto.randomBytes(2).toString("hex");
    
        // envia o token armazenado no e-mail
        const message = `Insira este token no aplicativo para validar seu e-mail. Expira em 30 minutos. \n Token: ${sendToken}`;
        const name    = "Usuário";
        sendEmail(message, email, name);
        res.status(200).json({ msg: "E-mail enviado", token:sendToken });

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

export default sendToken;