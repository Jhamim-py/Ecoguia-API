// componentes do Node
import bcrypt from 'bcrypt';  // criptografa dados em hash

// variáveis de ambiente para importar funções
import connection  	    from '../../../data/connection.js';    	   // conexão com o banco de dados
import generateNickname from '../../../utils/generateNickname.js'; // função externa que é responsável por gerar um nickname (exige a entrada da variável 'name') 

//função assíncrona com parâmetros de requisição e resposta
const sendNewUser =
async (req, res)  => {  
	//array de requisição dos dados
    const {
        name, lastname, email, pwd, avatar
    } = req.body;

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

    // criptografa a senha dada em hash
    const salt     = await bcrypt.genSalt(12);     // define o tamanho do hash (12 caracteres)
    const pwdHash  = await bcrypt.hash(pwd, salt); // cria o hash da senha

    // envia os dados do nickname e armazena a response na variável
    const nickname = await generateNickname(lastname);
    try{
        //chama a procedure de criação e coloca os dados
        const query  = `CALL CreateUser(?, ?, ?, ?, ?, ?);`;
        const values = [name, lastname, email, pwdHash, nickname, avatar];

        //envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Conta criada com sucesso. Faça seu login."});
	}catch(error){
		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(400).json({ 
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

export default sendNewUser;