// componentes do Node
const bcrypt = require('bcrypt')  // criptografa dados em hash

// variáveis de ambiente para importar funções
const connection       = require('../../../data/connection');    // conexão com o banco de dados
const appcacheTemp     = require('../../../utils/cacheTemp');    // armazena os dados de usuário, usado posteriormente para validações
const generateNickname = require('../../../utils/generateNickname');   // função externa que é responsável por gerar um nickname (exige a entrada da variável 'name') 

// função de registro que pode ser exportada 
exports.createUser =
async (req, res) => {  //função assíncrona com parâmetros de requisição e resposta
    const {
        name, lastname, email, pwd, avatar
    } = req.body;                                   // variável responsável por armazenar o token enviado ao cliente

    const executeConnection = await connection.getConnection(); // variável que armazena a execução de conexão com o banco de dados

    // criptografa a senha dada em hash
    const salt     = await bcrypt.genSalt(12);     // define o tamanho do hash (12 caracteres)
    const pwdHash  = await bcrypt.hash(pwd, salt); // cria o hash da senha

    // envia os dados do nickname e armazena a response na variável
    const nickname = generateNickname(lastname);

    try{
        // armazena a query de criação de usuário
        const query  = `CALL CreateUser(?, ?, ?, ?, ?, ?);`;
        const values = [name, lastname, email, pwdHash, nickname, avatar];

        // envio de query para o banco de dados e retorna o resultado
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Conta criada com sucesso. Faça seu login."});
	}catch(error){
		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(401).json({ 
				msg: `Erro ao tentar criar conta: ${error.sqlMessage}`
			});
		} else {
			// Caso o erro seja inerente as regras
			console.error("Algo deu errado ao criar a conta, tente novamente: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
    }
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
}; 