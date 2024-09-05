function gerarNickname (nome,sobrenome) {
    const numero =nome.length + sobrenome.length;
    return `${nome}#${numero}`

};
module.exports = gerarNickname; 