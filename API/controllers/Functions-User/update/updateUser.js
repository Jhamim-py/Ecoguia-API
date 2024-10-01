// componentes do Node
const bcrypt         = require('bcrypt');                    // criptografa dados em hash
const crypto         = require('crypto');                    // gera um token aleatório
const validator      = require('email-validator');           //verificação de formato do email

// funções exportadas
const connection     = require('../../../data/connection');  // conexão com o banco de dados
const appcacheTemp   = require('../../../utils/cacheTemp');  // armazena os dados de usuário, usado posteriormente para validações
const sendEmail      = require('../../../utils/sendEmail');  //importa função de enviar token por email
const verificatePwd  = require('../../../utils/verificatePwd'); // importa função de verificar padrão de senha
const nullValue      = require('../../../utils/nullValue');  // importa função de verificar campo vazio

exports.updateUser =
async (req, res) => {
    //variáveis responsáveis por armazenar os dados requeridos na requisição
    const userId = req.user.id;
    let {email, pwd} = req.body;
 
    const executeConnection = await connection.getConnection();// variável que armazena a execução de conexão com o banco de dados  
    
    //verificar o padrão da senha
    const check  = verificatePwd(pwd);
    if (check[0] == false){
        return res.status(400).json({erro: check[1]});  //Mensagem correspondente ao erro encontrado na senha
    }else if (nullValue(email) == null){
    //validar formato do email e se ele existe na requisição
       email = null;
    }else if (!validator.validate(email)){ 
        return res.status(400).json({message: "E-mail inválido."});
    }else{
        //Se houver um novo endereço de email na requisição,
        //será enviado um token para esse novo endereço.

        //puxa os dados do cliente armazenados no cachê do app
        appcacheTemp.set("endereco", email);
        appcacheTemp.set("senha",    pwd);

        //cria um token para verificação
        const tokenForget = crypto.randomBytes(3).toString("hex");
        appcacheTemp.set(tokenForget, true);

        // envia o token no e-mail
        const message =`Utilize o token para validação de troca de e-mail \n
        token: ${tokenForget}`;
        sendEmail(message,email);

        return res.status(200).json({message:"Confirme o token enviado pelo email para efetuar a atualização."});
    }
    // criptografa a senha dada em hash
    const salt          = await bcrypt.genSalt(12);     // define o tamanho do hash (12 caracteres)
    const passwordHash  = await bcrypt.hash(pwd, salt); // cria o hash da senha

    try{
        // executa a query de atualização do usuário
        const query  = `CALL ModifyUser(?, ?, ?);`;
        const values = [userId, email, passwordHash];

        // Executa a consulta
        const [results] = await executeConnection.query(query,values);
        results;
        if(results.length != 0){
            return res.status(200).json({msg: "Usuário atualizado com sucesso."});
        }else{
            return res.status(500).json({msg: "Algo deu errado ao tentar atualizar o usuário, tente novamente."});
        };
       
    }catch(error){
        console.error("Algo deu errado ao atualizar o usuário, tente novamente: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};
