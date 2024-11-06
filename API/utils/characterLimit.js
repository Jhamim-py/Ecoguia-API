// função que valida o length dos dados de entrada
module.exports =
function checkLength(data, length){
    //verifica se há dados
    if(data == null){
        return false;
    }
    //verifica se os dados passam de 2048 caracteres
    if(data.length > length) {
        const message ="O dado possui caracteres a mais do que suportado no banco de dados.";
        return true;
    }
    else{
        return false;
    };
};