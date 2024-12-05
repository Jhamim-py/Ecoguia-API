//funções externas
import connection from "../../../data/connection.js"; //conexão com o banco de dados

//função assíncrona para visualizar os materiais
const viewMaterial =
async (req, res)   => {
	//executa a conexão com o banco de dados
	const executeConnection = await connection();

    try{
        //chama a view pronta de visualização
        const query     = "SELECT * FROM ViewAllMaterial;";

        //envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query);
		results;

        return res.status(200).json({msg: "Materiais: ", materiais: results});
		//caso dê algo errado, retorna no console e avisa
    }catch(error){
		console.error("Algo deu errado ao visualizar os materiais, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};
export default viewMaterial;