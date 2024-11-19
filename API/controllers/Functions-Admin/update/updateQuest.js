//funções externas
import connection  from '../../../data/connection.js';    // conexão com o banco de dados 
import nullValue   from '../../../utils/nullValue.js';    // verifica se a variável possui valor nulo
import checkLength from '../../../utils/characterLimit.js';  //importa a função que verifica o tamanho max

//função assíncrona para modificar uma cadeia de missões
const updateQuest =
async (req, res) => {
    // array de requisição dos dados
    const {
        IDquest, description_3, XP_3, 
        description_2, XP_2, 
        description_1, XP_1, 
        blob_url, blob_title, blob_description 
    } = req.body;

    //GAMBIARAAA
    const allData = [        
        IDquest, description_3, XP_3, 
        description_2, XP_2, 
        description_1, XP_1, 
        blob_url, blob_title, blob_description
    ];

    // array com dados que contém limite de campo
    const data = [
        ['descrição da terceira missão', description_3], 
        ['descrição da segunda missão',  description_2], 
        ["descrição da primeira missão", description_1], 
        ["URL da imagem",                blob_url], 
        ["Título do badge",              blob_title], 
        ["Descrição da badge",           blob_description]
    ];

    // array variável que armazena o limite dos campos no banco de dados
    const limitLength = [120, 120, 120, 2048, 40, 120];
    
    //verifica se há um valor vazio e o substitui por 'null' num loop
    for (let i = 0; i < allData.length; i++){
        allData[i] = nullValue(allData[i]);

    };
    
    //verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
    for (let i = 0; i < data.length; i++){
        const [title, value] = data[i]; // Captura o título e valor do campo

        if (checkLength(value, limitLength[i])) {
            return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
        };
    };

    //executa a conexão com o banco de dados
    const executeConnection = await connection();

    try {
        //chama a procedure de criação e coloca os dados
        const query  = 'CALL ModifyQuestAndBadge(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        const values = allData;

        //envia a query e retorna caso tenha dado certo
        const [results] = await executeConnection.query(query, values);
        results;

        return res.status(200).json({ msg: "A cadeia de missões foi atualizados com sucesso!" });
    } catch (error) {
		if (error.sqlState === '45000') {
			//caso o erro SQL seja por regras de negócio, expõe-o
			return res.status(400).json({ 
				msg: `Erro ao tentar modificar cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			//caso não seja, retorna no console e avisa
			console.error("Erro ao tentar modificar cadeia de missões: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
    }
    finally{
        if(executeConnection){
            //fecha a conexão com o banco de dados
            await executeConnection.end();
        }
    };
};

export default updateQuest;