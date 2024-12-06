// componentes do Node
import bcrypt from 'bcrypt';    // gera um token aleatório

// variáveis de ambiente para importar funções
import getConnection  from '../../../data/connection.js'; // conexão com o banco de dados

// função de exclusão que pode ser exportada
// modificar maneira de validar e-mail e retorno de procedure...
const deleteUser = 
async (req, res) => {    //função assíncrona com parâmetros de requisição e resposta
    const  userID   = req.user.id;                          // variável que armazena o ID do usuário
    const {pwdHash} = req.body;                             // variável que armazena o hash da senha

    //variável de conexão com o banco de dados
    
    try{
        // Pega uma conexão
        const connection = await getConnection();
        
        // executa procedure de seleção de usuário
        // transformar numa função interna da procedure de criação!!!         
        const query  = `SELECT * FROM ViewAllEmails WHERE pk_IDuser=?;`;
        const values = userID;

        // envio de query de visualização para o banco de dados e armazena o resultado
        const [results] = await connection.query(query, values);
        if(results.length != 0){
            await deletarUser(results);
        }else if(results.length == 0){
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }else{
            return res.status(500).json({ msg: "Algo deu errado ao buscar os dados do usuário, tente novamente."});
        }

        async function deletarUser(results){ 
            // armazena as informações recebidas
            const userInfos = results[0];
            const pwd       = userInfos.pwd;

            // checa a senha bate com o hash armazenado no banco através da biblioteca bcrypt
            const checkPwd  = await bcrypt.compare(pwdHash, pwd);
            if ( !checkPwd ){
                return res.status(422).json({ msg: "Senha incorreta." });
            };
            
            try{
                // Pega uma conexão
	            const connection = await getConnection();

                // executa procedure de exclusão
                const query  = `CALL DeleteUser(?, ?)`;
                const values = [userID, pwd];

                // envio de query de exclusão para o banco de dados
                const [results] = await connection.query(query, values);
                if(results.length != 0){
                    return res.status(200).json({ msg: "Usuário deletado com sucesso." });
                }else{
                    console.log(error); //verificação
                    return res.status(500).json({ msg: "Algo deu errado ao deletar o usuário do banco de dados." });
                };
            }catch(error){
                console.error("Algo deu errado ao deletar o usuário, tente novamente: ", error);
                res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
            };
        };
    }catch(error){
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    
    };
};

export default deleteUser;