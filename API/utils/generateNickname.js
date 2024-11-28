// variáveis de ambiente para importar funções
import connection  	    from '../data/connection.js';    	   // conexão com o banco de dados

// função para gerar nickname de novos usuários
export default async function generateNickname (lastname) {
    let lastNickname;
    let lastNumber;

    //normaliza o dado enviado
	const lastnameClean = lastname
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    ;

    //executa a conexão com o banco de dados
    const executeConnection = await connection();
    
    //cria a lógica da constante do ID:
    try{

        //chama a procedure de criação e coloca os dados
        const query  = `SELECT nickname_user FROM ViewAllNicknames WHERE pk_IDuser = (SELECT MAX(pk_IDuser) FROM tbl_user);`;

        //envia a query e retorna caso tenha dado certo
        const [results] = await executeConnection.query(query);
        results;

        if (!results || results.length === 0) {
            lastNumber = 0;
        }else{
            lastNickname  = results[0].nickname_user;
            lastNumber    = parseInt(lastNickname.split('#')[1]);    
            console.log(results[0].nickname_user);
        }

        // Gera o número de registro no formato   
        const code = (lastNumber + 1).toString().padStart(4, '0');

        return (`${lastnameClean}#${code}`);
    }catch(error){
        if (error.sqlState === '45000') {
            // Caso o erro SQL seja por regras de negócio
            return res.status(400).json({ 
                msg: `Erro ao tentar criar nickname: ${error.sqlMessage}`
            });
        } else {
            // Caso o erro seja inerente as regras
            console.error("Algo deu errado ao criar nickname, tente novamente: ", error);
            return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
        };
    }
    finally{
        if(executeConnection){
            //Fecha a conexão com o banco de dados
            await executeConnection.end();
        };
    };
};