// componentes do Node
const crypto         = require('crypto');                    // gera um token aleatório
const validator      = require('email-validator');           //verificação de formato do email
// funções exportadas
const sendEmail      = require('../../../utils/sendEmail');  //importa função de enviar token por email

exports.registerUpdateEmail =
async (req, res) => {
	// variáveis responsáveis por armazenar os dados
	const {email} = req.body;

	  if (!validator.validate(email)){ 
		 return res.status(400).json({message: "E-mail inválido."});
	 }
	  
	 try{
		 //Se houver um novo endereço de email na requisição,
		 //será enviado um token para esse novo endereço.

		 //cria um token para verificação
		  const token = crypto.randomBytes(3).toString("hex");

		 // envia o token no e-mail
		  const message =`Utilize o token para validação de troca de e-mail \n
		  token: ${token}`;
		  sendEmail(message,email);

		  return res.status(200).json({message:"Confirme o token enviado pelo email para efetuar a atualização.",token:token});
		}
		catch(erro){
			return res.status(500).json({message: "Erro ao enviar token para e-mail."});
		}

};
