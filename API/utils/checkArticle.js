const connection = require('../data/connection') ////conexão com o banco de dados
function checkArticle(title){

    //executa a conexão com o banco de dados
    const executeConnection = connection.getConnection();

    const query = "SELECT * FROM ViewAllArticle WHERE title_article=?;"
    const value = title
    //executa a query
    executeConnection.query(query, value, (erro, results) => {
        if(erro){
            console.log(erro)
        }
        if(results > 0 ){
            return false
        }
        else{
            return true 
        }
    })
} 
//exporta a função  
 module.exports = checkArticle;
