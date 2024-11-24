import connection  from '../../../data/connection.js';   // conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js';
const updateTip = 
async (req, res) => {
    // array de requisição dos dados
    const {id, description_tip} = req.body;

    // array variável que armazena o limite dos campos no banco de dados
    const limitLength = 280;

    if (!id) {
		//validação de campo vazio
		return res.status(422).json({ msg: "É obrigatório fornecer um ID referente." + id});
    }else if (!description_tip) {
        //validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório preencher o campo da descrição de dica." });

    }else if (checkLength(description_tip, limitLength)){
        //verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
        return res.status(400).json({ msg: `A descrição da dica ultrapassou o limite de ${limitLength} caracteres.` });
    };

    //executa a conexão com o banco de dados
    const executeConnection = await connection();

    try {
        //verifica se existe dica com este ID
		const itsExist = await verifyImage(id, description_tip);
        
		//valida o resultado
		if (!itsExist.status){
			//caso seja 'false', retorna um erro 404
			return res.status(404).json({ msg: itsExist.res });
        }else if(itsExist.res1 == description_tip || itsExist.res2 == description_tip){
			//caso seja 'true', verifica se a descrição é a mesma
			return res.status(200).json({ msg: 'A descrição da dica é idêntica a uma registrada.'});
        }

        const query  = 'CALL ModifyTip(?, ?)';
        const values = [id, description_tip];

		//executa a query
		const [results] = await executeConnection.query(query, values);
		results;

		return res.status(200).json({msg:"Dica modificada com sucesso."});
	}catch(error){
		console.error("Algo deu errado ao modificar a dica, tente novamente:", error);
		return res.status(500).json({msg: "Erro interno no servidor, tente novamente."});
	}
	finally{
		if(executeConnection){
			//Fecha a conexão com o banco de dados
			await executeConnection.end();
		}
	};
};

//função assíncrona para verificar existência do material
async function verifyImage(id, desc){
	//executa a conexão com o banco de dados
	const executeConnection = await connection();

	//exclusão do antigo blob que está armazenado
	//chama a procedure de visualização para captar a URL de imagem
	const query  = `SELECT * FROM ViewAllTips WHERE pk_IDTip = (?) OR description_tip = (?) ORDER BY pk_IDTip DESC;`;
	const values = [id, desc];

	//envia a query e retorna resposta do banco
	const [results] = await executeConnection.query(query, values);
	results;

	//caso não tenha registro associado ao ID selecionado, interrompe o processo
	if (results.length <= 0){
		return ({status: false, res: 'A dica selecionada não existe.'});
	}else{
		//retorna descrição em caso de sucesso
		return ({status: true, res1: `${results[0].description_tip}`, res2: `${results[1].description_tip}`});
	}
}

export default updateTip;