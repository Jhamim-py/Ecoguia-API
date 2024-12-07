//funções externas
import getConnection  from '../../../data/connection.js';		//conexão com o banco de dados
import checkLength from '../../../utils/characterLimit.js'; //verifica se o dado ultrapassa o limite de caracteres

//função assíncrona para adicionar uma nova dica
const createTip = 
async (req, res)  => {
    //array de requisição dos dados
    const { description_tip } = req.body;

    //array variável que armazena o limite do campo no banco de dados
    const   limitLength       = 280;
    
	if (!description_tip || typeof description_tip !== 'string') {
        // validação de campo vazio
        return res.status(422).json({ msg: "É obrigatório preencher o campo da descrição de dica." });
	
        //verifica se já existe uma dica deste tipo no banco de dados
	    //...?

    }else if (checkLength(description_tip, limitLength)){
        //verifica se os dados ultrapassam X caracteres e expõe caso seja verdadeiro
        return res.status(400).json({ msg: `A descrição da dica ultrapassou o limite de ${limitLength} caracteres.` });
    };
    
    //executa a conexão com o banco de dados
	

    try {
        // Pega uma conexão
        const connection = await getConnection();
        
        //chama a procedure de criação e coloca os dados
        const query  = `CALL CreateTip(?)`;
        const values = [description_tip];

		//envia a query e retorna caso tenha dado certo
		const [results] = await connection.query(query, values);
		results;

        return res.status(200).json({ msg: "Nova dica criada com sucesso." });
    }catch (error) {
		if (error.sqlState === '45000') {
			//caso o erro SQL seja por regras de negócio, expõe-o
			return res.status(400).json({ 
				msg: `Erro ao tentar criar cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			//caso não seja, retorna no console e avisa
			console.error("Erro ao tentar criar cadeia de missões: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
    };
};

export default createTip;