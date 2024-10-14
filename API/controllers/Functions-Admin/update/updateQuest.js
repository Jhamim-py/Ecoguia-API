const connection  = import('../../../data/connection');     // conexão com o banco de dados
const nullValue   = import('../../../utils/nullValue');     // verifica se a variável possui valor nulo 
const checkLength = import('../../../utils/characterLimit') //importa a função que verifica o tamanho max

exports.updateQuestAndBadge =
async (req, res) => {
    // variáveis responsáveis por armazenar os dados
    let { IDquest, description_3, XP_3, 
          description_2, XP_2, 
          description_1, XP_1, 
          blob_url, blob_title, blob_description 
        } = req.body;

    //executa a conexão com o banco de dados
    const executeConnection = await connection.getConnection();

    //verifica se há um valor vazio e o substitui por 'null'
    IDquest          = nullValue(IDquest);
    description_3    = nullValue(description_3);
    XP_3             = nullValue(XP_3);
    description_2    = nullValue(description_2);
    XP_2             = nullValue(XP_2);
    description_1    = nullValue(description_1);
    XP_1             = nullValue(XP_1);
    blob_url         = nullValue(blob_url);
    blob_title       = nullValue(blob_title);
    blob_description = nullValue(blob_description); 
    
    //verifica se os dados ultrapassam X caracteres
    if (checkLength(description_3, 120) == false || checkLength(description_2, 120) == false || checkLength(description_1, 120)    == false 
     || checkLength(blob_url, 2048      == false)|| checkLength(blob_title, 40)     == false || checkLength(blob_description, 120) == false)
     {
        return res.status(400).json({msg: "Os campos não devem exceder caracteres."});
    
    };

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

        // Verifica o resultado
        if (results != 0) {
            return res.status(200).json({ msg: "A cadeia de missões foi atualizados com sucesso!" });

        } else {
            return res.status(404).json({ msg: "Algo deu errado ao atualizar os registros, tente novamente." });
        };
    } catch (error) {
        console.error("Erro ao tentar atualizar cadeia de missões: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });

    } finally {
        // Fecha a conexão com o banco de dados
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};