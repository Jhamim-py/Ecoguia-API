const connection  = require('../../../data/connection');     // conexão com o banco de dados
const nullValue   = require('../../../utils/nullValue');     // verifica se a variável possui valor nulo 
const checkLength = require('../../../utils/characterLimit') //importa a função que verifica o tamanho max
// modelo ES: import connection from '../../../data/connection';

exports.updateQuest =
async (req, res) => {
    // array de requisição dos dados
    const {
        IDquest, description_3, XP_3, 
        description_2, XP_2, 
        description_1, XP_1, 
        blob_url, blob_title, blob_description 
    } = req.body;

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
    const limitlength = [120, 120, 120, 2048, 40, 120];
    
    //verifica se há um valor vazio e o substitui por 'null' num loop
    for (let i = 0; i < data.length; i++){
        data[i] = nullValue(data[i]);

    };
    
    //verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
    for (let i = 0; i < data.length; i++){
        const [title, value] = data[i]; // Captura o título e valor do campo

        if (checkLength(value, limitlength[i])) {
            return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitlength[i]} caracteres.` });
        };
    };

    //executa a conexão com o banco de dados
    const executeConnection = await connection.getConnection();

    try {
        const query  = 'CALL ModifyQuestAndBadge(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        const values = [ 
            IDquest, description_3, XP_3, 
            description_2, XP_2, 
            description_1, XP_1, 
            blob_url, blob_title, blob_description
        ];

        // Executa a query
        const [results] = await executeConnection.query(query, values);
        results;

        return res.status(200).json({ msg: "A cadeia de missões foi atualizados com sucesso!" });
    } catch (error) {
		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(400).json({ 
				msg: `Erro ao tentar modificar cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			// Caso o erro seja inerente as regras
			console.error("Erro ao tentar modificar cadeia de missões: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
    } finally {
        // Fecha a conexão com o banco de dados
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};