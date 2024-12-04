// componentes do Node
import crypto         from 'crypto';         // gera um token aleatório
import validatorEmail from 'email-validator' // verifica e valida o formato 'e-mail', se contém @, .com, etc.

// variáveis de ambiente para importar funções
import connection    from '../../../data/connection.js';         // armazena os dados de usuário, usado posteriormente para validações
import sendEmail     from '../../../utils/sendEmail.js';         // importa função de enviar token por email
import verificatePwd from '../../../utils/verificatePwd.js';     // verifica e valida o formato 'senha', se contém 8 caracteres, etc.
import checkLength   from '../../../utils/characterLimit.js';    // verifica se o dado ultrapassa o limite de caracteres

// função assíncrona com parâmetros de requisição e resposta
const newUser    =
async (req, res) => {
  	// array de requisição dos dados
	const {
		name, lastname, email, pwd, avatar
	} = req.body;

    // validação de campo vazio
    if (!name || !lastname || !email || !pwd || !avatar) {
        return res.status(424).json({ msg: "É obrigatório preencher todos os campos para realizar o cadastro." });

    }else if(!validatorEmail.validate(email)){
    // validação de e-mail caso os campos tenham sido preenchidos corretamente
        return res.status(423).json({ msg: "Formato de e-mail inválido." });
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
	const limitLength = [60, 60, 120, 74, 120];

    // validação de tamanho
	// verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
	for (let i = 0; i < data.length; i++){
		const [title, value] = data[i]; // Captura o título e valor do campo

		if (checkLength(value, limitLength[i])) {
			return res.status(420).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
		};
	};

    // executa a conexão com o banco de dados
	const executeConnection = await connection();

    try{
        //chama a procedure de criação e coloca os dados
        const query  = `SELECT * FROM ViewAllEmails WHERE email=?`;
        const values = email;  //aloca o valor colocado no campo 'E-mail' para essa variável

        //envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query, values);

        if(results.length > 0){
            return res.status(422).json({ msg: "Este e-mail já esta sendo utilizado numa conta Eco."});
        };

        //verifica a formatação do dado colocado no campo 'senha' com função externa
        const verificate = verificatePwd(pwd);
        if (verificate[0] == false) {
            // retorna os resultados da função externa caso dê erro
            return res.status(400).json({error: verificate[1]});
        }

        //cria o token de validação de e-mail
        const sendToken = crypto.randomBytes(2).toString("hex");

        //armazena o token num formato válido
        const message = `Bem-vindo(a) ao nosso querido app feito para você! <br> Está quase lá, use o token abaixo para terminar o cadastro:`;
        const token   = `${sendToken}`;
        
        //função externa que cria e manda o e-mail
        sendEmail(email, name, message, token);
        res.status(200).json({ msg: "Registro de usuário criado. Por favor, verifique o token enviado em seu e-mail.", token: sendToken});
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

export default newUser;
