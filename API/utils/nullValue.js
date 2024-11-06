// função que checa e automatiza o valor nulo para dados de entrada
module.exports =
function nullValue(value){
    //se o valor do dado estiver '' (vazio) ou 'undefined', retorna como nulo
    if(value == undefined || value === ''){
        return null;
    }
    else{
        return value;
    };
};