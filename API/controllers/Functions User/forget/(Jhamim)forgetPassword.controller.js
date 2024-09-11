// componentes do Node
const bcrypt = require('bcrypt')  // codifica em hash

// variáveis de ambiente para importar funções
const connection         = require('../../../data/connection');    // conexão com o banco de dados
const appCache           = require('../../../utils/cache');        // armazena os dados de usuário, usado posteriormente para validações
const verificatePwd      = require('../../../utils/verificatePwd');// importa função de verificar padrão de senha

// função de visualização que pode ser exportada
exports.password =   
async (req, res) => {
    
    const userID         = req.user.id;                            // variável que armazena o ID do usuário
    const {token, pwd}   = req.body;                               // variável responsável por armazenar os dados
    
    const email = null;
    const verificacao = verificatePwd(pwd);                        //Verificar se a senha está nos padrões corretos

    // verificação de dados
    console.log(token);
    console.log(pwd);

    // envio de query de visualização para o banco de dados e armazena o resultado
    const executeConnection = connection.getConnection();
    //Resultado da verificação da senha
    if(verificacao[0] == false){   
        return res.status(400).json({erro: verificacao[1]})//Mensagem correspondente ao erro encontrado na senha
    }

    //verificação se o token está salvo corretamente no cache
    console.log(appCache.get(token))

    //verificar se o token enviado pelo usuário é o mesmo salvo no cache
    if(!appCache.get(token)){
      return   res.status(400).json({msg: "Token inválido ou expirado"}) 
    }

    // criptografa a senha dada em hash
    const salt = await bcrypt.genSalt(12);   // define o tamanho do hash (12 caracteres)
    const passwordHash = await bcrypt.hash(pwd, salt); // cria o hash da senha
    try{
        // executa a query de atualização da senha no banco de dados
        const sql = `CALL ModifyUser(?,?,?)`
        const values =[userID,email,passwordHash]
        executeConnection.query(sql,values, async function(erro,result){
            if(erro){
                console.log(erro) //verificação
                return res.status(500).json({msg: "Erro ao tentar atualizar a senha",erro})
            }
            else if(result){
                return res.status(200).json({msg: "Senha atualizada com sucesso"})
            }
        })
        
     }
     catch(erro){
        return res.status(500).json({msg: "Erro ao tentar atualizar o usuário"})
     }
     connection.end(); //fecha a conexão com banco de dados
     appCache.flushAll(); // comando que reseta o cachê do app
}