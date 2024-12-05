// variáveis de ambiente para importar funções
import getConnection  from '../../../data/connection.js';     // conexão com o banco de dados
import nullValue   from '../../../utils/nullValue.js';     // função para formatar valores vazios como nulos

// função de modificação que pode ser exportada
const updateProfile =
async (req, res) => {    //função assíncrona com parâmetros de requisição e resposta
    const userID = req.user.id;                          // variável que armazena o ID do usuário
    // variável que armazena a execução de conexão com o banco de dados

    let {name, lastname, avatar} = req.body;             // variável local responsável por armazenar os dados
    
    // verifica se os campos estão vazios e os formata como nulo
    name     = nullValue(name);
    lastname = nullValue(lastname);
    avatar   = nullValue(avatar);
   
    try{
        // Pega uma conexão
        const connection = await getConnection();
        
        // executa procedure de modificação que só acontece perante ID do usuário
        const query  = `CALL ModifyProfile(?, ?, ?, ?);`;
        const values = [userID, name, lastname, avatar];

        // Executa a consulta
        const results = await connection.query(query, values);
        results;
        if(results.length != 0){
            return res.status(200).json({msg: "Perfil do Usuário atualizado com sucesso."});
            
        }else{
            return res.status(500).json({msg: "Algo deu errado ao atualizar o perfil do usuário, tente novamente."});
        };
 
    }catch(error){
        console.error("Algo deu errado ao atualizar o perfil do usuário, tente novamente: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    };
};

export default updateProfile;