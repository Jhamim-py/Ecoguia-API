//funções externas
import connection  from '../../../data/connection.js';	//conexão com o banco de dados

//função assíncrona para visualizar um artigo
const getIDArticle =
async (req, res)   => {
    //array de requisição dos dados
    const {id} = req.body;

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

    try{
        //chama a view pronta de visualização e passa o ID
        const query  = "SELECT * FROM ViewAllArticle WHERE pk_IDarticle = (?);";
        const values = [id];
    
        //envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query,values);
		results;
    
        return res.status(200).json({msg: "artigo criado com sucesso", response: {results}});
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao visualizar o artigo, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};

export default getIDArticle;
