// função que valida o length dos dados de entrada
module.exports =
function checkLength(data){
    //verifica se os dados passam de 2048 caracteres
    if(data.length > 2048) {
        const message ="O dado possui caracteres a mais do que suportado no banco de dados";
        return false;
    }
    else{
        return true;
    };
};