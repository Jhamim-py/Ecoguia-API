// importação do arquivo de configuração .env
require('dotenv').config();
//componentes do node 
const axios             = require('axios').default;                  //biblioteca para realizar as requisições na API externa 
const connection        = require('../../../data/connection');       //conexão com o banco de dados
const checkLenght       = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres
const checkArticle      = require('../../../utils/checkArticle');    //verifica se o artigo adicionado já existe no banco de dados
exports.createArticle   =

async (req,res) => {
  //executa a conexão com o banco de dados
const executeConnection = connection.getConnection();
    const url = 'https://gnews.io/api/v4/search';
    const params = {
      q: 'meio ambiente',         //palavra chave utilizada na busca dos artigos
      lang: 'pt',                 //idioma do artigo
      country: 'br',              //país de origem 
      max: 10,                    //número máximo de artigos pegos na requisição
      apikey: process.env.APIKEY  //chave da API
    };
    try{
      //realiza a requisição na API externa
      const response = await axios.get(url,{params});
      //armazena os dados da reqisição 
      const articles = response.data.articles;
      //função para adicionar os artigos no banco de dados 
      for(let i = 0; i < articles.length; i++){
        //pega cada artigo por índice
        const article = articles[i];
        let image = article.image;
        let title = article.title;
        let category = "Meio ambiente";
        let description = article.description;
        let reference = article.url;
        //verifica se os dados ultrapassam 2048
       if(!checkLenght(image) | !checkLenght(description)|| !checkLenght(reference)){
        //se ultrapassar, não adiciona no banco de dados e passa para próxima interação
       continue;
       } 
    if(!checkArticle(title) && i == articles.length - 1){
       //se ultrapassar 2048 caracteres e for a ultima interação retorna o resultado da requisição
        return res.status(200).json({ msg: "Artigos adicionados com successo"});
       }  
       //verifica se o artigo já existe no banco de dados
       if(!checkArticle(title)){
        console.log("Artigo já existente no banco de dados");
        continue;
       }
     
        const query= `CALL CreateArticle(?,?,?,?,?);`;
        const value = [image,title,category,description,reference];
        //executa a query no banco de dados
        executeConnection.query(query,value,function (erro,result){
                if (erro) {
                    console.log(erro);
                    return res.status(500).json({ msg: "Erro ao adicionar o artigo"});
                }
                if ( i == articles.length - 1) {
                  //retorna o resultado após a última interação
                    return res.status(200).json({ msg: "Artigos adicionados com successo"});
                }
            })
  
      }
    }
    catch(erro){
      console.log(erro);
    } finally{
      //fecha a conexão com o banco de dados
        executeConnection.end();
    }
    }

