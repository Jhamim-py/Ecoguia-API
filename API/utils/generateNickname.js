function generateNickname (name) {
    //cria a lógica da constante do ID
    //(segmentada pela ordem de criação)
    const Cachenumber = '0001';
    const number = Cachenumber++;

    // atualiza a constante que define o ID
    Cachenumber = number;
    return `${name}#${number}`;

};

module.exports = generateNickname; 