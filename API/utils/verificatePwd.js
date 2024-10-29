// função de verificação de senha
module.exports = 
function verificatePwd(pwd){
    // verifica o tamanho da senha de no mínimo 8 caracteres
    let mensagem   = "";
    let minuscula  = pwd.match(/[a-z]/g);
    let maiscula   = pwd.match(/[A-Z]/g);
    let numero     = pwd.match(/[0-9]/g);
    let caracteres = pwd.match(/\W|_/);

    if(pwd.length < 8){
        mensagem = "A senha deve ter pelo menos 8 caracteres";
        return [false, mensagem];

    }else if(minuscula == null){
        mensagem = "Senha inválida, por favor inclua letras minúsculas na sua senha!";
        return [false, mensagem];

    }else if(maiscula == null){
        mensagem = "Senha inválida, por favor inclua letras maiúscula na sua senha!";
        return [false, mensagem];

    }else if(numero == null){
        mensagem = "Senha inválida, por favor inclua números na sua senha!";
        return [false, mensagem];

    }else if(caracteres == null){
        mensagem = "Senha inválida, por favor inclua caracteres especiais na sua senha!";
        return[false, mensagem];

    }else{
        //caso todas as validações tenham sido verificadas, retorna 'true'
        return [true, true];
    };
};