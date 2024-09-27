// componentes do Node
const bcrypt = require('bcrypt')  // codifica em hash

// variáveis de ambiente para importar funções
const connection       = require('../../../data/connection');    // conexão com o banco de dados
const appCache         = require('../../../utils/cache');        // armazena os dados de usuário, usado posteriormente para validações
const verificatePwd    = require('../../../utils/verificatePwd');// importa função de verificar padrão de senha
const getID            = require('../../../utils/getID')         // pegar o id do usuario pelo email

// função de visualização que pode ser exportada
exports.password =   
async (req, res) => {
    const {token, pwd}   = req.body;                               // variável responsável por armazenar os dados
    
    const executeConnection = await connection.getConnection();    //guarda a conexão com o banco

    const userID = getID(appCache.get("email"));
    const email  = appCache.get("email");                          
    const checkPwd = verificatePwd(pwd);                        //Verifica se a senha está nos padrões corretos

    // verificação de dados
    console.log(token);
    console.log(pwd);

    //Resultado da verificação da senha
    if(checkPwd[0] == false){   
        return res.status(400).json({erro: checkPwd[1]});       //Mensagem correspondente ao erro encontrado na senha
    }

    //verificação se o token está salvo corretamente no cache
    console.log(appCache.get(token));

    //verificar se o token enviado pelo usuário é o mesmo salvo no cache
    if(!appCache.get(token)){
        return res.status(400).json({msg: "Token de usuário está inválido ou expirado."});
    }

    // criptografa a senha dada em hash
    const salt = await bcrypt.genSalt(12);            // define o tamanho do hash (12 caracteres)
    const passwordHash = await bcrypt.hash(pwd,salt); // cria o hash da senha

    try{
        // executa a query de atualização da senha no banco de dados
        const query  = `CALL ModifyUser(?, ?, ?);`;
        const values = [userID,email,passwordHash];

        const [results] = await executeConnection.query(query, values);
        if(results.length > 0){
            return res.status(200).json({msg: "Senha atualizada com sucesso."});
        }else{
            return res.status(500).json({ msg: "Algo deu errado ao atualizar senha, tente novamente." });
        };
    }catch(error){
        console.error("Algo deu errado ao tentar atualizar senha, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    
    }finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};