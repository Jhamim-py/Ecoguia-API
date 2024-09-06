// preciso que o Jhamim comente e arrume esse arquivo...
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
    const verificacao = verificatePwd(pwd);

    // verificação de dados
    console.log(token);
    console.log(pwd);

    // envio de query de visualização para o banco de dados e armazena o resultado
    const executeConnection = connection.getConnection();
    if(verificacao[0] == false){
        return res.status(400).json({erro: verificacao[1]})
    }

    console.log(appCache.get(token))

    if(!appCache.get(token)){
      return   res.status(400).json({msg: "Token inválido ou expirado"}) 
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(pwd, salt);
    try{
        const sql = `CALL ModifyUser(?,?,?)`
        const values =[userID,email,passwordHash]
        executeConnection.query(sql,values, async function(erro,result){
            if(erro){
                console.log(erro)
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
     connection.end();
     appCache.flushAll();
}