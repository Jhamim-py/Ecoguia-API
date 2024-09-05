const nodemailer     =  require('nodemailer')

function emailVerificacao(mensagem){
    const transporter = nodemailer.createTransport({
        host:"sandbox.smtp.mailtrap.io",
        port:2525,
        auth:{
            user:"33423ee6f5c575",
            pass:"688b37b0bb3af6"
        },
     
    })
    transporter.sendMail({
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
module.exports = emailVerificacao;
