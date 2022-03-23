import nodemailer from "nodemailer";

// create reusable transporter object using the default SMTP transport
const emailOlvidePassword = async (datos) => {
    /** Credenciales del email */
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    const {email, nombre, token} = datos;

    /** Envio del Email */
    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email, 
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu Password',
        html: `<p> Hola: ${nombre}, has solicitado reestablecer tu Password.</p>
            <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
            
            <p>Sigue el siguiente enlace para generar un nuevo password:</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Resçestablecer Password</a> </p>

            <p>Si tu no creaste esta solicitud, puedes ignorar este mensaje</p>
        `,
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;