export default function nullValue(value) {
    // Verifica se o valor é nulo ou indefinido
    if (value === undefined || value === null) {
        return null;
    }

    // Verifica se o valor é uma string vazia ou composta apenas por espaços
    if (typeof value === 'string' && value.trim() === '') {
        return null;
    }

    // Verifica se o valor é um array ou objeto vazio
    if (Array.isArray(value) && value.length === 0) {
        return null;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return null;
    }

    // Retorna o valor original caso não seja "vazio"
    return value;
}
