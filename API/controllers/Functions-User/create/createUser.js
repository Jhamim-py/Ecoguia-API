// componentes do Node
const bcrypt = require('bcrypt')  // criptografa dados em hash

// variáveis de ambiente para importar funções
const connection       = require('../../../data/connection');    // conexão com o banco de dados
const appCache         = require('../../../utils/cache');        // armazena os dados de usuário, usado posteriormente para validações
const generateNickname = require('../../../utils/generateNickname');   // função externa que é responsável por gerar um nickname (exige a entrada da variável 'name') 

// função de registro que pode ser exportada
exports.createUser =
async (req, res) => {  //função assíncrona com parâmetros de requisição e resposta
   const {token} = req.body;                                   // variável responsável por armazenar o token enviado ao cliente
   const executeConnection = await connection.getConnection(); // variável que armazena a execução de conexão com o banco de dados

    // validação de token
    if (!appCache.get(token)) {
        console.log(appCache.get(token));  //verificação
        return res.status(400).json({ msg: "Token inválido ou expirado" });
    }

    // puxa os dados do cliente armazenados no cachê do app
    const name  = appCache.take("name");
    console.log(name);          //verificação

    const lastname = appCache.take("lastname");
    console.log(lastname);      //verificação

    const email = appCache.take("email");
    console.log(email);         //verificação

    const pwd   = appCache.take("pwd");
    console.log(pwd);           //verificação 

    const avatar = appCache.take("avatar");
    console.log(avatar);        //verificação

    // criptografa a senha dada em hash
    const salt     = await bcrypt.genSalt(12);     // define o tamanho do hash (12 caracteres)
    const pwdHash  = await bcrypt.hash(pwd, salt); // cria o hash da senha

    // envia os dados do nickname e armazena a response na variável
    const nickname = generateNickname(lastname);

    try{
        // armazena a query de criação de usuário
        const query = `CALL CreateUser(?, ?, ?, ?, ?, ?)`;
        const values = [name, lastname, email, pwdHash, nickname, avatar];

        // envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query, values);
        if (results.length > 0){
            return res.status(201).json({ msg: "Usuário criado com sucesso." });
        }else{
            return res.status(500).json({ msg: "Algo deu errado ao criar o usuário no banco de dados, tente novamente." });
        };
        
    }catch(error) {
        console.error("Algo deu errado ao criar usuário, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
        appCache.flushAll();  // comando que reseta o cachê do app
    };
};