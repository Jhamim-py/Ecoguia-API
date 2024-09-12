//
const connection       = require('../data/connection'); // conexão com o banco de dados

function acharId (email){
     const executeConnection = connection.getConnection();
    try{
    //executa a query para achar os dados do usuario pelo email
    const sql = `SELECT * FROM ViewAllEmails WHERE email=?;`
    const value = email
    executeConnection.query(sql,value,(err, results) => {
        if (err) {
            console.error(err);
        }
        console.log(results)
        return results.pk_IDuser;
 })
    }catch(erro){
    console.error(erro);
}
executeConnection.end(); //fecha a conexão com banco de dados
}
module.exports = acharId;