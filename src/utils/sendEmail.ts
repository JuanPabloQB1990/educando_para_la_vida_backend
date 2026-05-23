import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface SendPasswordEmailParams {
    to: string;
    nombres: string;
    password: string;
}

export async function sendPasswordEmail({
    to,
    nombres,
    password,
}: SendPasswordEmailParams): Promise<void> {
    const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: 'Credenciales de acceso',
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Bienvenido ${nombres}</h2>

                <p>Su cuenta ha sido creada correctamente.</p>

                <p>
                    <strong>Contraseña temporal:</strong>
                    ${password}
                </p>

                <p>
                    Por seguridad, cambie su contraseña después de iniciar sesión.
                </p>
            </div>
        `,
    };

    await sgMail.send(msg);
}