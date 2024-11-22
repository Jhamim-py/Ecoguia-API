import nodemailer from 'nodemailer';
import path       from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';

export default function checkEmail(email, name, message, token) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORDEMAIL
        }
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const logoPath = path.join(__dirname,'assets', 'logo.png');
    const florPath = path.join(__dirname,'assets', 'flor.png');
        
    const htmlContent = `
        <div style="font-family: 'Poppins', Arial, sans-serif; background-color: white; padding: 40px; text-align: center;">
        <!-- Div principal com fundo branco -->

        <!-- Logo e Flor no topo -->
        <div style="text-align: center; padding-bottom: 20px;">
            <img src="cid:logo_ecoguia" alt="Logo Ecoguia" style="width: 40%; display: block; margin: 0 auto;"/>
            <img src="cid:flor_image" alt="Flor" style="width: 40%; display: block; margin: 20px auto;"/>
        </div>
        <div style="background-color: #f0f5f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            
            <!-- Div inferior com borda verde e texto -->
            <div style="padding: 20px; text-align: left;">
                <h2 style="color: #34a853;">Token de verificação</h2>
                <p>Olá ${name},</p>
                <p>${message}</p>
                <h3 style="color: #34a853;">${token}</h3>
                <p>Se não solicitou este serviço, ignore este e-mail.</p>
                <p>Obrigado por escolher nosso app!</p>
                <p style="margin-top: 20px;">Atenciosamente,<br>Ecoguia</p>
            </div>
        </div>

    </div>
`;

    transporter.sendMail({
        from: "eco12biotec@gmail.com",
        to: email,
        subject: "Token de Verificação",
        html: htmlContent,
        attachments: [
            {
                filename: 'logo.png',      
                path: logoPath,            
                cid: 'logo_ecoguia'        
            },
            {
                filename: 'flor.png',      
                path: florPath,            
                cid: 'flor_image'          
            }
        ]
    })
    .then(info => {
        console.log('E-mail enviado:', info.response);
        return info;
    })
    .catch(error => {
        console.error('Erro ao enviar e-mail:', error);
        return error;
    });
};
