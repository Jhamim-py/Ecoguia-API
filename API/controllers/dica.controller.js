const conectar = require('../data/conexao');

const getDicaDoDia = (callback) => {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // Formata a data no formato YYYY-MM-DD

  const connection = conectar.getConnection();
  connection.query(
    'SELECT * FROM tbl_tip WHERE DATE(date_tip) = ?',
    [formattedDate],
    (err, results) => {
      if (err) {
        console.error('Erro ao buscar dica do dia:', err);
        callback(err);
        return;
      }

      if (results.length > 0) {
        // Se já existe uma dica para o dia, retorne essa dica
        callback(null, results[0]);
      } else {
        // Se não existe dica para o dia, escolha uma nova dica aleatória
        connection.query('SELECT * FROM tbl_tip ORDER BY RAND() LIMIT 1', (err, randomResults) => {
          if (err) {
            console.error('Erro ao buscar dica aleatória:', err);
            callback(err);
            return;
          }

          if (randomResults.length > 0) {
            const dicaDoDia = randomResults[0];

            // Atualize a dica do dia com a data atual
            connection.query(
              'UPDATE tbl_tip SET date_tip = ? WHERE pk_IDtip = ?',
              [formattedDate, dicaDoDia.pk_IDtip],
              (err) => {
                if (err) {
                  console.error('Erro ao atualizar a dica do dia:', err);
                  callback(err);
                  return;
                }

                callback(null, dicaDoDia);
              }
            );
          } else {
            callback(new Error('Nenhuma dica encontrada'));
          }
        });
      }
    }
  );
};

exports.getDicaDoDia = (req, res) => {
  getDicaDoDia((err, dica) => {
    if (err) {
      console.error('Erro na rota /dica-diaria:', err);
      res.status(500).json({ message: 'Erro ao buscar dica do dia' });
      return;
    }
    res.json(dica);
  });
};
