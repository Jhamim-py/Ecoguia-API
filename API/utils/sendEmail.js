// responsável por mandar emails de validação ao cliente
const nodemailer     =  require('nodemailer')

function checkEmail(mensagem){
    const transporter = nodemailer.createTransport({
        // login e locação de conta responsável pelo envio do email
        host:"sandbox.smtp.mailtrap.io",
        port:2525,
        auth:{
            // conta da empresa
            user:"33423ee6f5c575",
            pass:"688b37b0bb3af6"
        },
     
    })
    transporter.sendMail({
        // configuração para localizar o email endereçado e enviar o token
        from:"3987b0ba0b-7b608f@inbox.mailtrap.io",
        to:"3987b0ba0b-7b608f@inbox.mailtrap.io",
        subject:"Recuperação de senha",
        text:mensagem

    }).then(info =>{
       return info

    }).catch(erro => {
       return erro
       
    })

};

module.exports = checkEmail;