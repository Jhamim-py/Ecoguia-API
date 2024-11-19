//funções externas
import connection  from '../../../data/connection.js'; //conexão com o banco de dados

//variável global para armazenar a dica do dia
let dailyTip    = null; // Armazena a dica que será retornada ao usuário
let lastTipDate = null; // Armazena a data em que a dica foi buscada

//função assíncrona para visualizar a dica diária
const getDailyTip = 
async (req, res) => {
	//executa a conexão com o banco de dados
	const executeConnection = await connection();

    try { 
        const today         = new Date();                        //obtém a data e hora atuais do sistema
        const formattedDate = today.toISOString().split('T')[0]; //formata a data no formato YYYY-MM-DD

        //verifica se já existe uma dica armazenada para a data atual obtida
        if (lastTipDate === formattedDate && dailyTip) {
            return res.json(dailyTip); //exibe a dica armazenada
        };

        //chama a view pronta de visualização de dica aleatória
        const query = `SELECT * FROM ViewRandomTip;`;

        //envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query);
		results;

        //armazena a dica do dia e a data atual
        dailyTip    = results[0];
        lastTipDate = formattedDate;

        return res.status(200).json(dailyTip);
	}catch(error){
		//caso dê algo errado, retorna no console e avisa
		console.error("Algo deu errado ao visualizar a dica diária, tente novamente:", error);
		return res.status(500).json({msg: "Ocorreu um erro interno no servidor, verifique e tente novamente."});
	}
	finally{
		if(executeConnection){
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};

export default getDailyTip;