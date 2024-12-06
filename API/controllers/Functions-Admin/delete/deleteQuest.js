//funções externas
import getConnection  from '../../../data/connection.js'; // conexão com o banco de dados
import deleteBlob  from '../../../middleware/deleteImage.js';//extrai e exclui o blob pela URL

//função assíncrona para deletar a cadeia de missões mais recente
const deleteQuest = 
async (req, res) => {
	//executa a conexão com o banco de dados
	

	//inicializa a variável de URL
	let newImage_url = null;

	

	try {
		// Pega uma conexão
        const connection = await getConnection();

		// Pega uma conexão da pool para realizar a transação
		const transactionConnection = await connection.getConnection();

		//inicia transação
		await transactionConnection.beginTransaction();

		//chama a view para localizar a URL do blob
		const query   = `SELECT * FROM ViewLatestBadge;`;

		//envia a query e retorna caso tenha dado certo
		const [results] = await transactionConnection.query(query);
		results;

		if (results.length <= 0){
			transactionConnection.release();
			return res.status(404).json({ msg: "Não foi encontrada a badge mais recente registrada." });
		}

		//armazena URL retornada
		newImage_url = results[0].blob_badge;
		console.log("URL captada: " + newImage_url);

		//chama a procedure de exclusão e coloca os dados
		const query1 = `CALL DeleteQuestAndBadge();`;
		
		//envia a query e retorna caso tenha dado certo
		const [results1] = await transactionConnection.query(query1);
		results1;

		//confirma a transação
		await transactionConnection.commit();

		//chama a função para deletar o blob pela URL anteriormente armazenada
		if (newImage_url) {await deleteBlob(newImage_url)};

		return res.status(200).json({ msg: "A cadeia de missões mais recente foi deletada com sucesso." });
	} catch (error) {    
		//reverte a query
		await transactionConnection.rollback();

		if (error.sqlState === '45000') {
			//caso o erro SQL seja por regras de negócio, expõe-o
			return res.status(400).json({ 
				msg: `Erro ao tentar deletar a última cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			//caso não seja, retorna no console e avisa
			console.error("Erro ao tentar deletar a cadeia de missões: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
	} finally {
		// Garante que a conexão pega é solta de volta a pool
		transactionConnection.release();
	};
};

export default deleteQuest;