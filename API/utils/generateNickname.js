// função para gerar nickname de novos usuários
module.exports =
function generateNickname (name) {
    //cria a lógica da constante do ID
    //(segmentada pela ordem de criação)
    let Cachenumber = 1;
    let number = Cachenumber + 1;

    // atualiza a constante que define o ID
    Cachenumber = number;
    return `${name}#${number}`;

};