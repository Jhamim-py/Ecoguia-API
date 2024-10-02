const executeConnection = require('../../../data/connection'); // conexão com o banco de dados

exports.deleteQuestAndBadge = async (req, res) => {
  // variáveis responsáveis por armazenar os dados
  const { idQuest } = req.body; // supondo que você está passando o ID da quest que deseja deletar
  
  console.log(idQuest); // verificação

  // executa a conexão com o banco de dados
  const connection = await executeConnection.getConnection(); // Certifique-se de que essa função retorne uma Promise que resolve a conexão.

  try {
    const query = `CALL DeleteQuestAndBadge();`; // sua procedure não precisa de parâmetros

    // executa a query
    const [results] = await connection.query(query); // Use a conexão correta

    // considerando que a procedure não retorna resultados, apenas checa e executa operações
    return res.status(200).json({ msg: "Quest e badge deletados com sucesso." });
  } catch (erro) {
    console.log(erro); // verificação
    res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
  } finally {
    // Fecha a conexão com o banco de dados, se foi estabelecida
    if (connection) {
      await connection.end();
    }
  }
};
