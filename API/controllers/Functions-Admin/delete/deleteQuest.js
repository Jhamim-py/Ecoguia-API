const connection = import('../../../data/connection'); // conexão com o banco de dados

exports.deleteQuestAndBadge = 
async (req, res) => {
  // executa a conexão com o banco de dados
  const executeConnection = await connection.getConnection();

  try {
    const query = `CALL DeleteQuestAndBadge();`;

    // executa a query
    const [results] = await executeConnection.query(query);
    results;
    
    // Verifica o resultado
    if (results != 0) {
        return res.status(200).json({ msg: "A cadeia de missões foi deletada com sucesso!" });

    } else {
        return res.status(404).json({ msg: "Algo deu errado ao deletar os registros, tente novamente." });
    };
  } catch (error) {
    console.error("Erro ao tentar deletar cadeia de missões: ", error);
    return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });

  } finally {
    // Fecha a conexão com o banco de dados
    if (executeConnection) {
        await executeConnection.end();
    };
  };
};
