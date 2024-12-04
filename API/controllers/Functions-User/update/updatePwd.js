// componente do Node
import bcrypt from 'bcrypt';                           // criptografa dados em hash

// funções exportadas
import connection    from '../../../data/connection.js';     // conexão com o banco de dados
import verificatePwd from '../../../utils/verificatePwd.js'; // importa função de verificar padrão de senha

const updatePwd =
async (req, res) => {
   // variáveis responsáveis por armazenar os dados
    const userId = req.user.id;   // variável que armazena o ID do usuário
    const {newPwd} = req.body;
 
    const email = null;

    const executeConnection = await connection();// variável que armazena a execução de conexão com o banco de dados  
    
    //verificar o padrão da senha
    const check  = verificatePwd(newPwd);
    if (check[0] == false){
        return res.status(400).json({erro: check[1]});  //Mensagem correspondente ao erro encontrado na senha
     }

    // criptografa a senha dada em hash
    const salt          = await bcrypt.genSalt(12);     // define o tamanho do hash (12 caracteres)
    const passwordHash  = await bcrypt.hash(newPwd, salt); // cria o hash da senha

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

export default updatePwd;