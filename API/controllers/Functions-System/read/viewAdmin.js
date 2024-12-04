import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../../../data/connection.js';

const loginAdmin = async (req, res) => {
    const { email, pwd } = req.body;
    const executeConnection = await connection();

    if (!email || !pwd) {
        return res.status(422).json({
            msg: "É necessário preencher todos os campos para realizar o login."
        });
    }
    try {
        const query = `SELECT * FROM ViewAllAdmins WHERE email=?;`;
        const values = [email];

        const [results] = await executeConnection.query(query, values);
        
        if (results.length === 0) {
            return res.status(401).json({ msg: "Email ou senha incorretos." });
        }

        const user = results[0];

        const checkPwd = await bcrypt.compare(pwd, user.pwd);

        if (!checkPwd) {
            return res.status(401).json({ msg: "Email ou senha incorretos." });
        }

        const isAdmin = results.length > 0;

        const token = jwt.sign(
            { id: user.pk_IDadmin, email: user.email, isAdmin: isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            msg: "Autenticação realizada com sucesso.",
            token: token
        });
    } catch (error) {
        console.error("Algo deu errado ao realizar o login: ", error);
        res.status(500).json({
            msg: "Algo deu errado na conexão com o servidor, tente novamente."
        });
    } finally {
        await executeConnection.end();
    }
};

export default loginAdmin;