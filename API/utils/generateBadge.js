const cache = require('./cache');

// Inicializa o valor no cache se ele ainda não existir
if (!cache.get('badge')) {
    cache.set('badge', 1); // Começa em 1
}

// Função para gerar um novo ID de badge
module.exports = function generateBadge() {
    // Obtém o número atual do cache
    let number = cache.get('badge');

    // Gera o ID do badge (pode ajustar o padStart conforme necessário)
    const badge = `${String(number).padStart(1, '0')}`; // Altera para '2' se você quiser sempre ter 2 dígitos

    // Incrementa o número e atualiza o cache
    cache.set('badge', number + 1);

    // Retorna o ID do badge formatado
    return badge; 
};
