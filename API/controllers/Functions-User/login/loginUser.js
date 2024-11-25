// importação do arquivo de configuração .env
import 'dotenv/config';

// componentes do Node
import bcrypt from 'bcrypt';          // criptografa dados em hash
import jwt    from 'jsonwebtoken';    // token web do Javascript (salva informações como credenciais)

// variáveis de ambiente para importar funções
import connection  from '../../../data/connection.js'; // conexão com o banco de dados

// função de visualização que pode ser exportada
const postLogin  = 
async (req, res) => {   //função assíncrona com parâmetros de requisição e resposta
    const { email, pwd } = req.body;                         // variável responsável por armazenar os dados
    const executeConnection = await connection();    // variável que armazena a execução de conexão com o banco de dados
 
    // validação de campo
    if (!email || !pwd) { 
        return res.status(422).json({ msg: "É necessário preencher todos os campos para realizar o login." });
    };

    //try catch para autenticar usuário
    try {
        // query para visualizar email de acordo com o IDs
        const query = `SELECT * FROM ViewAllEmails WHERE email=?;`;
        const values = [email];

        // envio de query e captação de resposta
        const [results] = await executeConnection.query(query, values);
        if(results.length == 0){
            return res.status(404).json({msg: "Usuário não encontrado."}); 
        };  
        // armazena o valor retornado numa variável (neste caso, o e-mail)
        const user = results[0];

        // checa a senha com o hash armazenado no banco através da biblioteca bcrypt
        const checkPwd = await bcrypt.compare(pwd, user.pwd); 
        if (!checkPwd) {
            return res.status(400).json({ msg: "Senha incorreta." });
        }

        // com a autenticação feita, é gerado um token de login
        const secret = process.env.SECRET;

        // isto faz com que o usuário consiga transitar no app sem logar novamente
        const token  = jwt.sign({ id: user.pk_IDuser}, secret);

        res.status(200).json({ msg: "Autenticação realizada com sucesso.", token: token });
    }catch (error) {
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });

    }finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        await executeConnection.end();
    };
};

export default postLogin;