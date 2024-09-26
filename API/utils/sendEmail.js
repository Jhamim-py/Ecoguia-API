// responsável por mandar emails de validação ao cliente
const nodemailer = require('nodemailer');

// importação do arquivo de configuração .env
require('dotenv').config();

module.exports =
function checkEmail(mensagem){
    const transporter = nodemailer.createTransport({
        // login e locação de conta responsável pelo envio do email
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            // conta da empresa
            user:process.env.EMAIL,
            pass:process.env.PASSWORDEMAIL
        }
    });
    transporter.sendMail({
        // configuração para localizar o email endereçado e enviar o token
        from:"eco12biotec@gmail.com",
        to:"houtarousenki@gmail.com",
        subject:"Recuperação de senha",
        text:mensagem

    }).then(info =>{
       return info;

    }).catch(error => {
       return error;
    });
};