const cache = require('./cache');

// Inicializa o valor no cache se ele ainda não existir
if (!cache.get('nickname')) {
    cache.set('nickname', 1);
}
// função para gerar nickname de novos usuários
module.exports =
function generateNickname (lastname) {
//  Cria a lógica da constante do ID:

    //obtém o número atual do cache
    let number = cache.get('nickname');

    // Gera o nickname no formato
    const nickname = `${lastname}#${String(number).padStart(4, '0')}`;

    // Incrementa o número e atualiza o cache
    cache.set('nickname', number + 1);
    return nickname;
};