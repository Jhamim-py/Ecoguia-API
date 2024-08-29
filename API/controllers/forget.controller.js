const conectar       =  require('../data/conexao')
const nodemailer     =  require('nodemailer')
const crypto         =  require('crypto')
const NodeCache      = require ('node-cache') ;
require('dotenv').config();
exports.getForget =

async (req,res)  => {
    const meuCache = new NodeCache({stdTTl:1800}); 
    const connection = conectar.getConnection();
    const {email} = req.body;
    try{
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        const value = email;
        connection.query(sql,value, async function(erro,result){
            if (erro) {
                console.log(erro);
                return res.status(500).json({ msg: "Erro ao verificar se o usuário existe"})
            }
            if (result.length == 0) {
                return res.status(404).json({ msg: "Usuário não encontrado" })
            };
         });
       }
    catch(erro){
        return res.status(500).json({msg: "Erro ao tentar recuperar a senha",erro}) 
    }


    const tokenForget = crypto.randomBytes(10).toString("hex");
    meuCache.set(tokenForget,true);

    const transporter = nodemailer.createTransport({
        host:"sandbox.smtp.mailtrap.io",
        port:2525,
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })
    transporter.sendMail({
        from:"3987b0ba0b-7b608f@inbox.mailtrap.io",
        to:"3987b0ba0b-7b608f@inbox.mailtrap.io",
        subject:"Recuperação de senha",
        text:`Copie o token abaixo para recuperar sua senha em até 30 minutos | seu esquecido >:(\n
        Token: ${tokenForget}`
    }).then(info =>{
        res.send(info)
    }).catch(erro => {
        res.send(erro)
    }).finally(connection.end())
    
}