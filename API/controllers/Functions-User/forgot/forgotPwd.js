// componentes do Node
import bcrypt from 'bcrypt';  // codifica em hash

// variáveis de ambiente para importar funções
import connection    from '../../../data/connection.js';    // conexão com o banco de dados
import verificatePwd from '../../../utils/verificatePwd.js';// importa função de verificar padrão de senha
import getID         from '../../../utils/getID.js';        // pegar o id do usuario pelo email

// função de visualização que pode ser exportada
const newPwd =   
async (req, res) => {
    const {pwd, email}   = req.body;                             // variável responsável por armazenar os dados
    
    const executeConnection = await connection();  //aguarda a conexão com o banco

    const userID = await getID(email);
    console.log(userID)                       
    const checkPwd = verificatePwd(pwd);                        //Verifica se a senha está nos padrões corretos
 
    //Resultado da verificação da senha
    if(checkPwd[0] == false){    
        return res.status(400).json({erro: checkPwd[1]});       //Mensagem correspondente ao erro encontrado na senha
    }
    
    // criptografa a senha dada em hash
    const salt = await bcrypt.genSalt(12);            // define o tamanho do hash (12 caracteres)
    const passwordHash = await bcrypt.hash(pwd,salt); // cria o hash da senha

    try{
        // executa a query de atualização da senha no banco de dados
        const query  = `CALL ModifyUser(?, ?, ?);`;
        const values = [userID, email, passwordHash];

        const [results] = await executeConnection.query(query, values);
        if(results.length != 0){
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

export default newPwd;