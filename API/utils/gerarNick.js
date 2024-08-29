function gerarNickname (nome) {
    const numero = Math.floor(Math.random() * 100*nome.length);
    return `${nome}#${numero}`

};
module.exports = gerarNickname; 