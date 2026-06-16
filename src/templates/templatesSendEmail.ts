import config from "../config/environment"

export const matriculaExitosa = (plainPassword: string) => {
    return `
        <div style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
                <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                    
                    <!-- HEADER -->
                    <tr>
                    <td align="center" style="background:#1e3a8a;padding:30px;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;">
                        Educando para la Vida
                        </h1>
                        <p style="color:#dbeafe;margin-top:10px;font-size:14px;">
                        Plataforma de Matrículas Académicas
                        </p>
                    </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                    <td style="padding:40px;">

                        <h2 style="color:#111827;margin-top:0;">
                        ¡Matrícula registrada correctamente!
                        </h2>

                        <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                        Nos alegra informarte que tu proceso de matrícula fue realizado exitosamente en nuestra plataforma educativa.
                        </p>

                        <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                        Ya puedes ingresar al sistema utilizando las siguientes credenciales:
                        </p>

                        <!-- BOX -->
                        <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin:30px 0;">
                        
                        <p style="margin:0 0 10px 0;color:#111827;font-size:15px;">
                            <strong>Correo:</strong> juanpqb_19@hotmail.com
                        </p>

                        <p style="margin:0;color:#111827;font-size:15px;">
                            <strong>Contraseña temporal:</strong> ${plainPassword}
                        </p>

                        </div>

                        <!-- BUTTON -->
                        <div style="text-align:center;margin:35px 0;">
                        <a 
                            href={${config.frontendUrl}/login}
                            style="
                            background:#2563eb;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 28px;
                            border-radius:8px;
                            font-size:16px;
                            display:inline-block;
                            font-weight:bold;
                            "
                        >
                            Ingresar a la Plataforma
                        </a>
                        </div>

                        <p style="color:#6b7280;font-size:14px;line-height:1.6;">
                        Por seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.
                        </p>

                        <p style="color:#6b7280;font-size:14px;line-height:1.6;">
                        Si no realizaste esta solicitud o tienes inconvenientes para acceder, comunícate con la institución.
                        </p>

                    </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                    <td align="center" style="background:#f9fafb;padding:20px;border-top:1px solid #e5e7eb;">
                        
                        <p style="margin:0;color:#9ca3af;font-size:13px;">
                        © ${new Date().getFullYear()} Educando para la Vida
                        </p>

                        <p style="margin-top:8px;color:#9ca3af;font-size:12px;">
                        Este es un correo automático, por favor no responder.
                        </p>

                    </td>
                    </tr>

                </table>

                </td>
            </tr>
            </table>

        </div>
    `
}

interface CreateUserEmailDto {
  nombres: string;
  apellido1: string;
  apellido2: string;
  email: string;
  plainPassword: string;
}

export const creacionUsuario = (userData: CreateUserEmailDto) => {
    const { nombres, apellido1, apellido2, email, plainPassword } = userData;
    return `
              <div style="font-family: Arial, sans-serif; max-width: 520px; color: #333;">
                <h2 style="color: #4f46e5;">Bienvenido(a) a Educando Para La Vida</h2>
                <p>Hola <strong>${nombres} ${apellido1} ${apellido2}</strong>,</p>
                <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>
                <table style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <tr><td style="padding: 4px 8px; color: #6b7280;">Correo:</td><td style="padding: 4px 8px; font-weight: 600;">${email}</td></tr>
                  <tr><td style="padding: 4px 8px; color: #6b7280;">Contraseña:</td><td style="padding: 4px 8px; font-weight: 600; font-family: monospace;">${plainPassword}</td></tr>
                </table>
                <p style="color: #6b7280; font-size: 13px;">Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión por primera vez.</p>
              </div>
            `
}

export const recuperacionPassword = (codigo: string) => {
    return `
            <h2>Recuperación de contraseña</h2>
            <p>Tu código de recuperación es:</p>
            <h1 style="letter-spacing: 8px;">${codigo}</h1>
            <p>Este código es válido por <strong>15 minutos</strong>.</p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
          `
}

interface AvisoVencimientoData {
  nombreEstudiante: string;
  nombreRubro: string;
  montoCuota: number;
  fechaVencimiento: string;
}

export const avisoProximoVencimiento = (data: AvisoVencimientoData) => {
  const { nombreEstudiante, nombreRubro, montoCuota, fechaVencimiento } = data;
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#333;background:#f4f7fb;padding:30px;">
      <div style="background:#fff;border-radius:12px;padding:30px;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
        <div style="background:#f59e0b;border-radius:8px 8px 0 0;margin:-30px -30px 24px;padding:20px 30px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">⚠️ Tu mensualidad vence en 10 días</h1>
        </div>
        <p style="font-size:15px;">Hola <strong>${nombreEstudiante}</strong>,</p>
        <p style="font-size:14px;color:#4b5563;line-height:1.6;">
          Te recordamos que tienes una mensualidad pendiente de pago que vencerá en <strong>10 días</strong>.
          Por favor realiza tu pago a tiempo para evitar recargos.
        </p>
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 8px;font-size:14px;color:#92400e;"><strong>Concepto:</strong> ${nombreRubro}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#92400e;"><strong>Valor:</strong> $${Number(montoCuota).toLocaleString('es-CO')}</p>
          <p style="margin:0;font-size:14px;color:#92400e;"><strong>Fecha límite:</strong> ${fechaVencimiento}</p>
        </div>
        <p style="font-size:13px;color:#6b7280;">
          Ingresa a la plataforma para cargar tu comprobante de pago en la sección <strong>Pagos</strong>.
        </p>
        <p style="font-size:12px;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">
          © ${new Date().getFullYear()} Educando para la Vida · Este es un correo automático, por favor no responder.
        </p>
      </div>
    </div>
  `;
};

export const avisoVencimientoHoy = (data: AvisoVencimientoData) => {
  const { nombreEstudiante, nombreRubro, montoCuota, fechaVencimiento } = data;
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#333;background:#f4f7fb;padding:30px;">
      <div style="background:#fff;border-radius:12px;padding:30px;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
        <div style="background:#dc2626;border-radius:8px 8px 0 0;margin:-30px -30px 24px;padding:20px 30px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">🚨 Tu mensualidad vence HOY</h1>
        </div>
        <p style="font-size:15px;">Hola <strong>${nombreEstudiante}</strong>,</p>
        <p style="font-size:14px;color:#4b5563;line-height:1.6;">
          Hoy es el último día para pagar tu mensualidad sin recargo. Si no realizas el pago hoy,
          tu obligación pasará a estado <strong>vencido</strong> y podrían restringirse algunos servicios.
        </p>
        <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Concepto:</strong> ${nombreRubro}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#991b1b;"><strong>Valor:</strong> $${Number(montoCuota).toLocaleString('es-CO')}</p>
          <p style="margin:0;font-size:14px;color:#991b1b;"><strong>Vence:</strong> ${fechaVencimiento}</p>
        </div>
        <p style="font-size:13px;color:#6b7280;">
          Ingresa a la plataforma y carga tu comprobante de pago en la sección <strong>Pagos</strong>.
        </p>
        <p style="font-size:12px;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">
          © ${new Date().getFullYear()} Educando para la Vida · Este es un correo automático, por favor no responder.
        </p>
      </div>
    </div>
  `;
};

interface ComprobanteRecibidoData {
  nombreEstudiante: string;
  nombreRubro: string;
  fechaPago: string;
}

export const comprobanteRecibido = (data: ComprobanteRecibidoData) => {
  const { nombreEstudiante, nombreRubro, fechaPago } = data;
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#333;background:#f4f7fb;padding:30px;">
      <div style="background:#fff;border-radius:12px;padding:30px;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
        <div style="background:#1e3a8a;border-radius:8px 8px 0 0;margin:-30px -30px 24px;padding:20px 30px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">✅ Comprobante recibido</h1>
        </div>
        <p style="font-size:15px;">Hola <strong>${nombreEstudiante}</strong>,</p>
        <p style="font-size:14px;color:#4b5563;line-height:1.6;">
          Hemos recibido tu comprobante de pago correctamente. Nuestro equipo lo revisará
          y actualizará el estado de tu obligación en los próximos días hábiles.
        </p>
        <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 8px;font-size:14px;color:#1e40af;"><strong>Concepto:</strong> ${nombreRubro}</p>
          <p style="margin:0;font-size:14px;color:#1e40af;"><strong>Fecha de subida:</strong> ${fechaPago}</p>
        </div>
        <p style="font-size:13px;color:#6b7280;">
          Puedes revisar el estado de tu pago en cualquier momento desde la sección <strong>Pagos</strong> de la plataforma.
        </p>
        <p style="font-size:12px;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">
          © ${new Date().getFullYear()} Educando para la Vida · Este es un correo automático, por favor no responder.
        </p>
      </div>
    </div>
  `;
};