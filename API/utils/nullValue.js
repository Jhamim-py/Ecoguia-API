function nullValue(valor){
    //se o valor estiver vazio ou undefined ele retorna como nulo
    if(valor == undefined || valor == ""){
        return null;
    }
    else{
        return valor;
    }
}

//exporta a função
module.exports = nullValue;