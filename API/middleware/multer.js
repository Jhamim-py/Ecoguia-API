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
        msg(null, true); // Aceita o arquivo
    } else {
        msg(new Error('O tipo de arquivo enviado não é aceito. Envie um arquivo JPEG, JPG, PNG ou JFIF.'), false); // Rejeita o arquivo
    }
};

//upload do arquivo num armazenamento temporário local
const upload = multer({
    storage, // Utilizando `diskStorage`
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter // Filtro para validar os tipos de arquivo
}).single('file');

// Middleware personalizado para validar a existência do arquivo
function validateFile(req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Erros específicos do Multer (ex: limite de tamanho)
            return res.status(400).json({ msg: `Erro no upload: ${err.message}` });
        } else if (err) {
            // Outros erros (ex: tipo de arquivo inválido)
            return res.status(400).json({ msg: `Erro no upload: ${err.message}` });
        }

        if (!req.file) {
            // Nenhum arquivo foi enviado
            return res.status(400).json({ msg: 'Nenhum arquivo foi enviado. Por favor, envie um arquivo válido.' });
        }

        next();
    });
}

// Exporta o middleware para uso direto nas rotas
export default validateFile;

// function uploadImage(req, res, next) {
//     upload.single('file')(req, res, function (err){
//         let json = {
//             result: []
//         };

//         if (err instanceof multer.MulterError) {
//             // Erros específicos do multer
//             json.result.push({
//                 error: `Erro do multer: ${err.message}`
//             });
//             return res.status(400).json(json);
//         } else if (err) {
//             // Outros erros de upload
//             json.result.push({
//                 error: `Erro no upload: ${err.message}`
//             });
//             return res.status(400).json(json);
//         }

//         if (!req.file) {
//             json.result.push({
//                 error: 'Arquivo não fora recebido.'
//             });
//             return res.status(400).json(json);
//         }

//         next(); // Continua para o próximo middleware
//     });
// };