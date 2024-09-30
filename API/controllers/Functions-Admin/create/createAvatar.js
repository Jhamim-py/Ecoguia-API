const connection = require('../../../data/connection');

exports.createAvatar = async (req, res) => {
    const { avatarLink } = req.body;

    const executeConnection = await connection.getConnection();
    
    try {
        // Verificar se o avatar já existe
        const checkQuery = "SELECT * FROM ViewAllAvatar WHERE blob_avatar = ?;";
        const [existingAvatar] = await executeConnection.query(checkQuery, [avatarLink]);

        if (existingAvatar.length > 0) {
            return res.status(400).json({ message: "Este avatar já existe." });
        }

        // Criar o novo avatar
        const createQuery = "CALL CreateAvatar(?);";
        const [response] = await executeConnection.query(createQuery, [avatarLink]);

        if (!response) {
            return res.status(400).json({ message: "Erro ao criar o avatar" });
        }

        return res.status(200).json({ message: "Avatar criado com sucesso!" });
    } catch (error) {
        console.error(error); // Log do erro para debugging
        return res.status(400).json({ message: "Erro ao criar o avatar", error });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        }
    }
};
