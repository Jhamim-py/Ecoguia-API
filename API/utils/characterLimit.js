function checkLenght(data){
    //verifica se o dados tem mais de 2048 caracteres
    if(data.length > 2048){
     const mensagem ="O dado possui caracteres a mais do que suportado no banco de dados"
        return false;
    }
    else{
        return true
    }
}
//exporta a função
module.exports = checkLenght;