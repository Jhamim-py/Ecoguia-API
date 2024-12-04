import multer from 'multer';
import path   from 'path';

//configuração de armazenamento do Multer
const storage = multer.memoryStorage();

//validação de tipo de arquivo aceito
const fileFilter = (req, file, msg) => {
    const filetypes = /jpeg|jpg|png|jfif/; // Tipos de arquivos aceitos
    const mimetype  = filetypes.test(file.mimetype); // Verifica o tipo MIME do arquivo
    const extname   = filetypes.test(path.extname(file.originalname).toLowerCase()); // Verifica a extensão do arquivo

    if (mimetype && extname) {
        //aceita o arquivo
        msg(null, true);
    } else {
        //rejeita o arquivo
        msg(new Error('O tipo de arquivo enviado não é aceito. Envie um arquivo JPEG, JPG, PNG ou JFIF.'), false);
    }
};

//upload do arquivo num armazenamento interno, próprio do Multer
const upload = multer({
    storage,   //`diskStorage`
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB
    fileFilter //validação de arquivo
}).single('file');

//middleware personalizado para validar a existência do arquivo
function validateFile(req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            //erros específicos do Multer
            return res.status(400).json({ msg: `Erro no upload: ${err.message}` });
        } else if (err) {
            //outros erros
            return res.status(400).json({ msg: `Erro no upload: ${err.message}` });
        }

        // if (!req.file) {
        //     //nenhum arquivo foi enviado
        //     return res.status(400).json({ msg: 'Nenhum arquivo foi enviado. Por favor, envie um arquivo válido.' });
        // }

        next();
    });
}

// Exporta o middleware para uso direto nas rotas
export default validateFile;