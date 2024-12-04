// Função para formatar o dado sem acento e letras minúsculas
module.exports =
async function formatData(data){
    return data
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};
