// função que checa e automatiza o valor nulo para dados de entrada
module.exports =
function nullValue(value){
    //se o valor do dado estiver 'empty' ou 'undefined', retorna como nulo
    if(value == undefined || value == empty()){
        return null;
    }
    else{
        return value;
    };
};