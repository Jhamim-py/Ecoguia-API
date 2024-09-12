// componentes do Node
const validator      = require('email-validator');           //verificação de formato do email
const connection       = require('../../../data/connection');  // conexão com o banco de dados
const bcrypt         = require('bcrypt');                    // criptografa dados em hash
const appCache       = require('../../../utils/cache')          // armazena os dados de usuário, usado posteriormente para validações
const mandarEmail    = require('../../../utils/sendEmail')             //importa função de enviar token por email
const crypto         = require('crypto')                     // gera um token aleatório
const verificarSenha = require('../../../utils/verificatePwd')    // importa função de verificar padrão de senha

exports.updateUser =
    async (req,res) => {
     // variáveis responsáveis por armazenar os dados requeridos na requisição
    const userId = req.user.id;
    let {email,pwd} = req.body; 
    // variável que armazena a execução de conexão com o banco de dados
    const executeConnection = connection.getConnection();
    //verificar o padrão da senha
    const verificacao = verificarSenha(pwd)
    if(verificacao[0] == false){
        return res.status(400).json({erro: verificacao[1]})//Mensagem correspondente ao erro encontrado na senha
    }

    //validar formato do email e se ele existe na requisição
    if (!validator.validate(email) && email == "") {
       email = null;
    }
    else if(!validator.validate(email)){ 
        return res.status(400).json({message: "Email invalido"})
    }
    else{
        //Se ouver um novo endereço de email na requisição, um email será enviado para esse novo endereço para verificar se realmente existe

        // puxa os dados do cliente armazenados no cachê do app
        appCache.set("endereco",email);
        appCache.set("senha",pwd);
        console.log(appCache.take("endereco"))
        console.log(pwd)
        console.log("final de verificação de valores")

        //Cria um token para a averificação
        const tokenForget = crypto.randomBytes(10).toString("hex");
        appCache.set(tokenForget,true);
        // envia o token armazenado no e-mail
        const mensagem =`Utilize o token para a sua validação de troca de email :)\n
        token: ${tokenForget}`;
        mandarEmail(mensagem);
        return res.status(200).json({message:"confirme seu email com o token para efetuar a atualização!"})
    }
    // criptografa a senha dada em hash
    const salt          = await bcrypt.genSalt(12);      // define o tamanho do hash (12 caracteres)
    const passwordHash  = await bcrypt.hash(pwd, salt); // cria o hash da senha

  
    try{
        // executa a query de atualização do usuário
       const sql = `CALL ModifyUser(?,?,?)`
       const values =[userId,email,passwordHash]
       executeConnection.query(sql,values, async function(erro,result){
           if(erro){
               console.log(erro)
               return res.status(500).json({msg: "Erro ao tentar atualizar o usuário"})
           }
           if(result){
               return res.status(200).json({msg: "Usuário atualizado com sucesso"})
           }
       })
       
    }
    catch(erro){
       return res.status(500).json({msg: "Erro ao tentar atualizar o usuário"})
    }
    executeConnection.end();//fecha a conexão com banco de dados
   }