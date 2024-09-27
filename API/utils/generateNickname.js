const cacheNum = require('./cache');

// Inicializa o valor no cache se ele ainda não existir
if (!cacheNum.get('nickname')) {
    cacheNum.set('nickname', 1);
}
// função para gerar nickname de novos usuários
module.exports =
function generateNickname (lastname) {
//  Cria a lógica da constante do ID:
    //obtém o número atual do cache
    let number = cacheNum.get('nickname');

    // Gera o nickname no formato
    const nickname = `${lastname}#${String(number).padStart(4, '0')}`;

    // Incrementa o número e atualiza o cache
    cacheNum.set('nickname', number + 1);
    return nickname;
};