// componentes do Node
const crypto         =  require('crypto');          // gera um token aleatório
const validatorEmail =  require('email-validator'); // verifica e valida o formato 'e-mail', se contém @, .com, etc.

// variáveis de ambiente para importar funções
const connection     = require('../../../data/connection');          // conexão com o banco de dados
const appcacheTemp   = require('../../../utils/cacheTemp');          // armazena os dados de usuário, usado posteriormente para validações
const sendEmail      = require('../../../utils/sendEmail');          // importa função de enviar token por email
const verificatePwd  = require('../../../utils/verificatePwd');      // verifica e valida o formato 'senha', se contém 8 caracteres, etc.
const checkLength    = require('../../../utils/characterLimit');     // verifica se o dado ultrapassa o limite de caracteres

// função assíncrona com parâmetros de requisição e resposta
exports.postRegister =
async (req, res)     => {
    
  	// array de requisição dos dados
	const {
		name, lastname, email, pwd, avatar
	} = req.body;

    // validação de campo vazio
    if (!name || !lastname || !email || !pwd || !avatar) {
        return res.status(422).json({ msg: "É obrigatório preencher todos os campos para realizar o cadastro." });

    }else if(!validatorEmail.validate(email)){
    // validação de e-mail caso os campos tenham sido preenchidos corretamente
        return res.status(422).json({ msg: "Formato de e-mail inválido." });
    };

	// array com dados que contém limite de campo
	const data = [
		['nome de usuário',      name], 
		['sobrenome de usuário', lastname], 
		['e-mail',  		     email], 
		['senha', 		         pwd],
        ['avatar',               avatar]
	];

	// array variável que armazena o limite dos campos no banco de dados
	const limitlength = [60, 60, 120, 74, 120];

    // validação de tamanho
	// verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; // Captura o título e valor do campo

		if (checkLength(value, limitlength[i])) {
			return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitlength[i]} caracteres.` });
		};
	};

    // executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    // comando que reseta o cachê do app (CACHE)
    appcacheTemp.flushAll();                                        
 
    try{
        // verificar existência do e-mail no Banco de Dados através do uso de View
        // transformar numa função interna da procedure de criação!!!
        const query  = `SELECT * FROM ViewAllEmails WHERE email=?`;
        const values = email;  //aloca o valor colocado no campo 'E-mail' para essa variável

        // envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query, values);
        if(results.length > 0){
            return res.status(422).json({ msg: "Este e-mail já está em uso."});
        };

        // verifica a formatação do dado colocado no campo 'senha' com função externa
        const verificate = verificatePwd(pwd);
        if (verificate[0] == false) {
            // retorna os resultados da função externa caso dê erro
            return res.status(400).json({error: verificate[1]});
        }

        // armazena os valores passados no cachê do app (CACHE)
        appcacheTemp.set("name",    name);
        appcacheTemp.set("lastname",lastname);
        appcacheTemp.set("email",   email);
        appcacheTemp.set("pwd",     pwd);
        appcacheTemp.set("avatar",  avatar);

        // cria e armazena o token no cachê do app      (CACHE)
        const sendToken = crypto.randomBytes(4).toString("hex");
        appcacheTemp.set(sendToken,true); 

        // envia o token armazenado no e-mail
        const message = `${sendToken}`;
        
        sendEmail(message,email, name);
        res.status(200).json({ msg: "Registro de usuário criado. Por favor, verifique o token enviado em seu e-mail."});
	}catch(error){
		console.error("Algo deu errado ao registrar usuário, tente novamente:", error);
		return res.status(500).json({msg: "Erro interno no servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
};