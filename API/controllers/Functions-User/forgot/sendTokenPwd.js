// componentes do Node
import crypto from 'crypto';  // gera token aleatório
import validatorEmail from 'email-validator' // verifica e valida o formato 'e-mail', se contém @, .com, etc.

// variáveis de ambiente para importar funções
import connection  from '../../../data/connection.js';   // conexão com o banco de dados 
import sendEmail   from '../../../utils/sendEmail.js';   // importa função de enviar token por email

// importação do arquivo de configuração .env
import 'dotenv/config';

// função que gera e envia um token para função 'esqueci senha'
const sendToken =
async (req, res)  => {
    const {email} = req.body;                       // variável responsável por armazenar os dados
    const executeConnection = await connection();   // variável que armazena a execução de conexão com o banco de dados
    try{
        if (!email){
            return res.status(400).json({msg: "O campo não foi preenchido na requisição."});
        }else if(!validatorEmail.validate(email)){
            return res.status(401).json({msg: "O e-mail informado não é válido."});
        }

        //verifica existência do e-mail no Banco de Dados através do uso da view
        const query  = `SELECT * FROM ViewAllEmails WHERE email = (?)`;
        const values = email;    //aloca o valor colocado no campo 'E-mail' para essa variável

        // envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query, values);
        if(results.length == 0){
            return res.status(404).json({msg: "Usuário não registrado no banco de dados."});
        };
        
        // cria o token
        const sendToken = crypto.randomBytes(2).toString("hex");
    
        // envia o token no e-mail
        const name    = 'usuário';
        const message = 'Bem-vindo de volta! <br> Esqueceu a senha? Sem problemas, use o token abaixo no nosso app e seja feliz de novo! <br> Expira em 5 minutos.';
        const token   = `${sendToken}`;
        sendEmail(email, name, message, token);
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