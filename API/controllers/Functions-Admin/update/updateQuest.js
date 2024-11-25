//funções externas
import connection  from '../../../data/connection.js';    // conexão com o banco de dados 
import nullValue   from '../../../utils/nullValue.js';    // verifica se a variável possui valor nulo
import checkLength from '../../../utils/characterLimit.js';  //importa a função que verifica o tamanho max
import updateBlob  from '../../../middleware/updateImage.js'; //cria novo blob e retorna URL
import deleteBlob  from '../../../middleware/deleteImage.js'; //extrai e exclui o blob pela URL

//função assíncrona para modificar uma cadeia de missões
const updateQuest =
async (req, res) => {
    //array de requisição dos dados
    const { IDquest, description_3, XP_3, description_2, XP_2, description_1, XP_1, blob_title, blob_description } = req.body;
    const blob_url = req.file;

    //verifica se o campo de identificação está preenchido
	if (!IDquest) {
		//validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório fornecer um ID referente."});
    }else if(!blob_url && !description_3 && !XP_3 & !description_2 && !XP_2 && !description_1 && !XP_1 && !blob_title && !blob_description ){
		//validação de todos os campos vazios
		return res.status(422).json({ msg: "Ah-há! Gastando requisição atoa é?"});
	};

    //array com todos os dados
    const allData = [        
        IDquest, description_3, XP_3, 
        description_2, XP_2, 
        description_1, XP_1, 
        blob_url, blob_title, blob_description
    ];

    //verifica se há um valor vazio na array e o substitui por 'null' num loop
    for (let i = 0; i < allData.length; i++){
        allData[i] = nullValue(allData[i]);
    };

    //array com dados de caracteres limitado
    const data = [
        ['descrição da terceira missão', allData[1]], 
        ['descrição da segunda missão',  allData[3]], 
        ['descrição da primeira missão', allData[5]], 
        ['título do badge',              allData[8]], 
        ['descrição da badge',           allData[9]]
    ];

    //array variável que armazena o limite dos campos no banco de dados
    const limitLength = [120, 120, 120, 40, 120];
    
    //verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
    for (let i = 0; i < data.length; i++){
        const [title, value] = data[i]; // Captura o título e valor do campo

        if (checkLength(value, limitLength[i])) {
            return res.status(400).json({ msg: `O campo de ${title} ultrapassou o limite de ${limitLength[i]} caracteres.` });
        };
    };

    //executa a conexão com o banco de dados
    const executeConnection = await connection();

    //inicializa as variáveis de URL de imagem
	let newImage_url = null;
	let oldImage_url = null;

    try {
        //verifica se existe missão com este ID
		const itsExist = await verifyImage(IDquest);

        //valida o resultado
		if (!itsExist.status){
			//caso seja 'false', retorna um erro 404
			return res.status(404).json({ msg: itsExist.res });
        }

		//verifica se o usuário inseriu uma imagem nova
		if(blob_url){
			//armazena a url da imagem antiga para exclusão
			oldImage_url = itsExist.res;
			console.log("URL antiga: " + oldImage_url);

			//cria o blob da nova imagem e armazena a URL gerada
			newImage_url = await updateBlob('QUEST', IDquest, blob_url);
			console.log('URL da nova imagem: '+ newImage_url);

			//valida o tamanho da URL gerada
			if (newImage_url.length > 2048) {
				if (newImage_url) {await deleteBlob(newImage_url)};
				return res.status(400).json({msg: `A URL do avatar ultrapassou o limite de ${limitLength} caracteres.`});
			}else{
                //aloca a url para a array
                allData[7] = newImage_url;
            }
		}

        //chama a procedure de modificação e coloca os novos dados
        const query  = 'CALL ModifyQuestAndBadge(?);';
        const values = [allData];

        //envia a query e retorna caso tenha dado certo
        const [results] = await executeConnection.query(query, values);
        results;

        //chama a função para deletar o blob pela URL anteriormente armazenada
		if (oldImage_url) {await deleteBlob(oldImage_url)};

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

//função assíncrona para verificar existência das missões e captar URL de imagem da badge
async function verifyImage(req){
	const id = req;

	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	//chama a procedure de visualização para verificar registro da missão com badge
    const query  = `SELECT * FROM ViewAllQuest WHERE pk_IDQuest = (?) AND fk_badge_quest IS NOT NULL;`;
    const values = id;

	//envia a query e retorna resposta do banco
	const [results] = await executeConnection.query(query, values);
	results;

	//caso não tenha registro associado ao ID selecionado, interrompe o processo
	if (results.length <= 0){
		return ({status: false, res: 'A missão selecionada não existe ou, não é a última da cadeia.'});
	}else{
		//caso tenha, retorna URL do avatar
		return ({status: true, res: `${results[0].blob_badge}`});
	}
}

export default updateQuest;