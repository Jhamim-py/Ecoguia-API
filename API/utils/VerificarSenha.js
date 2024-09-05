function verificarSenha(senha){
    let mensagem = ""
    if(senha.length < 8){
        mensagem = "A senha deve ter pelo menos 8 caracteres"
        return [false, mensagem]
    }
    let minuscula = senha.match(/[a-z]/g)
    if(minuscula == null){
        mensagem = "Senha inválida, por favor inclua letras minusculas na sua senha!"
        return [false, mensagem]
    }
    let maiscula = senha.match(/[A-Z]/g)
    if(maiscula == null){
        mensagem = "Senha inválida, por favor inclua letras maiuscula na sua senha!"
        return [false, mensagem]
    }
    let numero = senha.match(/[0-9]/g)
    if(numero == null){
        mensagem = "Senha inválida, por favor inclua números na sua senha!"
        return [false, mensagem]
    }
    let caracteres = senha.match(/\W|_/)
    if(caracteres == null){
        mensagem = "Senha inválida, por favor inclua caracteres especiais na sua senha!"
        return[false,mensagem]
    }
    return [true,true]

};
module.exports = verificarSenha; 