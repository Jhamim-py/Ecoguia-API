const connection        = require('../../../data/connection'); 


exports.createAvatar =
async (req,res) => {
    const {link} = req.body

    const executeConnection = await connection.getConnection();
try{
    const query = "CALL CreateAvatar(?);"
    const value = link

    const [response] = await executeConnection.query(query,value)

    if(!response){
        return res.status(400).json({message: "Erro ao criar o avatar"})
    }
     return res.status(200).json({message: "Avatar criado com sucesso!"})
    } catch (error) {
        return res.status(400).json({message: "Erro ao criar o avatar",error})
    }finally{
         // Fecha a conexão com o banco de dados, se foi estabelecida
         if (executeConnection) {
            await executeConnection.end();
        };
    }
}