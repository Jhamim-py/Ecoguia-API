//funções externas
import getConnection  from '../../../data/connection.js'; // conexão com o banco de dados
import deleteBlob  from '../../../middleware/deleteImage.js';//extrai e exclui o blob pela URL

//função assíncrona para deletar um artigo
const deleteArticle =
async(req, res) 	  => {
    //array de requisição dos dados
	const {id} = req.body;

	//validação de campo vazio
	if (!id) {
		return res.status(422).json({ msg: "É obrigatório selecionar um artigo para exclusão." });
	};
	

	//inicializa a variável de URL
	let newImage_url = null;

	try{
		// Pega uma conexão
        const connection = await getConnection();
		
		//chama a view para localizar a URL do blob
		const query   = `SELECT image_article FROM ViewAllArticle WHERE pk_IDarticle = (?);`;
		const values  = [id];

		//envia a query e retorna caso tenha dado certo
		const [results] = await connection.query(query, values);
		results;

		if (results.length <= 0){
			return res.status(404).json({ msg: "O artigo selecionado não existe." });
		}

		//armazena URL retornada
		newImage_url = results[0].image_article;
		console.log("URL captada: " + newImage_url);

		if (newImage_url) {await deleteBlob(newImage_url)};

		//chama a procedure de exclusão e coloca os dados
		const query1  = `CALL DeleteArticle(?);`;
		const values1 = [id];

		//envia a query e retorna caso tenha dado certo
		const [results1] = await connection.query(query1, values1);
		results1;
		
		return res.status(200).json({ msg: "Artigo deletado com sucesso." });
	}catch (error) {
		//caso dê algo errado, retorna no console e avisa
		console.error("Erro ao tentar deletar artigo: ", error);
		return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
	};
};

export default deleteArticle;