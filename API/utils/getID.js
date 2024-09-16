//
const connection       = require('../data/connection'); // conexão com o banco de dados

function getID (email){
     const executeConnection = connection.getConnection();
    try{
    //executa a query para achar os dados do usuario pelo email
    const sql = `SELECT * FROM ViewAllEmails WHERE email=?;`
    const value = email
    executeConnection.query(sql,value,(err, results) => {
        if (err) {
            console.error(err); //caso ocorra erro mostrar no console
        }
        console.log(results) //verificar resultado da query
        return results.pk_IDuser;//retornar id do susário
 })
    }catch(erro){
    console.error(erro);
}
executeConnection.end(); //fecha a conexão com banco de dados
}


module.exports = getID; //exportar função 

