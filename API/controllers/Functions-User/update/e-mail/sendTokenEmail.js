// componentes do Node
import crypto 	 from 'crypto';              		   // gera um token aleatório
import validator from 'email-validator';  			   //verificação de formato do email

// funções exportadas
import sendEmail from '../../../../utils/sendEmail.js';  //importa função de enviar token por email

const sendToken =
async (req, res) => {
	// variáveis responsáveis por armazenar os dados
	const {email} = req.body;

	if (!email){
		return res.status(400).json({message: 'E-mail não informado.'});
	}
	else if (!validator.validate(email)){ 
		return res.status(400).json({message: "E-mail inválido."});
	}

	try{
		//Se houver um novo endereço de email na requisição,
		//será enviado um token para esse novo endereço.

		//cria um token para verificação
		const sendToken = crypto.randomBytes(3).toString("hex");

		// envia o token no e-mail
		const name    = 'usuário';
		const message ='Tanta burocracia para a troca de um mísero e-mail né? <br> Mas está acabando, é só utilize o token abaixo no app:';
		const token   = `${sendToken}`;

		sendEmail(email, name, message, token);

		return res.status(200).json({message:"Confirme o token enviado pelo e-mail para efetuar a atualização.", token: sendToken});
	}catch(erro){
		return res.status(500).json({message: "Erro ao enviar token para e-mail."});
	};
};

export default sendToken;