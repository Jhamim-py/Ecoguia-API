//funções externas
import ecopontos from '../../../utils/ecopontos.json' assert{ type: 'json' };
//função assíncrona para visualizar informações sobre os ecopontos de São Paulo
const viewEcopontos =
async (req, res)   =>{
	try{
        //pegando os dados de um arquivo json
        const Ecopontos = ecopontos
        //retornando os dados do arquivo json
		return res.status(200).json(Ecopontos);
	}catch(error){
		console.error("Algo deu errado ao pegar os dados sobre os ecopontos, tente novamente: ", error);
		res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
	}
};

export default viewEcopontos;