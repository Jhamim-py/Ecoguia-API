// componentes do Node
const crypto         =  require('crypto');          // gera um token aleatório
const validatorEmail =  require('email-validator'); // verifica e valida o formato 'e-mail', se contém @, .com, etc.

// variáveis de ambiente para importar funções
const connection     = require('../../../data/connection');    // conexão com o banco de dados
const appcacheTemp   = require('../../../utils/cacheTemp');    // armazena os dados de usuário, usado posteriormente para validações
const sendEmail      = require('../../../utils/sendEmail');    // importa função de enviar token por email
const verificatePwd  = require('../../../utils/verificatePwd');// verifica e valida o formato 'senha', se contém 8 caracteres, etc.

// função de registro que pode ser exportada
exports.postRegister =
async (req, res)     => {   //função assíncrona com parâmetros de requisição e resposta
    const { name, lastname, email, pwd, avatar } = req.body;     // variável responsável por armazenar os dados
    const executeConnection = await connection.getConnection();  // variável que armazena a execução de conexão com o banco de dados
    appcacheTemp.flushAll();                                         // comando que reseta o cachê do app

    // validação de campo
    if (!name || !lastname || !email || !pwd || !avatar) {
        return res.status(422).json({ msg: "É obrigatório preencher todos os campos para realizar o cadastro." });
    };
    // validação de Email
    if (!validatorEmail.validate(email)) {
        return res.status(422).json({ msg: "E-mail inválido." });
    };
 
    try{
        // verificar existência do E-mail no Banco de Dados através do uso de View
        const query = `SELECT * FROM ViewAllEmails WHERE pk_IDuser=?`;
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

        // armazena os valores passados no cachê do app
        appcacheTemp.set("name",    name);
        appcacheTemp.set("lastname",lastname);
        appcacheTemp.set("email",   email);
        appcacheTemp.set("pwd",     pwd);
        appcacheTemp.set("avatar",  avatar);

        // cria e armazena o token no cachê da app
        const sendToken = crypto.randomBytes(4).toString("hex");
        appcacheTemp.set(sendToken,true); 

        // envia o token armazenado no e-mail
        const message = `Insira este token no aplicativo para validar seu e-mail. Expira em 30 minutos. \n Token: ${sendToken}`;
        
        sendEmail(message);
        res.status(200).json({ msg: "E-mail de validação de conta enviado com sucesso. Verifique."});
    }catch(error){
        console.error("Algo deu errado ao registrar usuário, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    
    }finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};