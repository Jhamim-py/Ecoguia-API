import getConnection  from '../../../data/connection.js';    // conexão com o banco de dados

//função de visualização de perfil que pode ser exportada
const getProfile =
async (req, res) => {   //função assíncrona com parâmetros de requisição e resposta
     // variável que armazena a execução de conexão com o banco de dados
    const userID  = req.user.id;                                // variável que armazena o ID do usuário

    try{
        // Pega uma conexão
        const connection = await getConnection();
        
        // Armazena a query que chama a procedure de visualização de perfil
        const query = `CALL SelectProfile(?);`;
        const values = userID; 

        // Executa a consulta
        const [results] = await connection.query(query, values);

        // Verifica se o usuário foi encontrado
        if (!results || results.length === 0) {
            return res.status(404).json({ msg: "Não foi possível encontrar usuário com este ID, tente novamente." });
        }
           
        return res.status(200).json({results});
    }catch(error){
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    };
};

export default getProfile;