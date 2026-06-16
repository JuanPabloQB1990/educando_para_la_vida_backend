import cron from 'node-cron';
import { EmailService } from '../utils/sendEmail';
import ObligacionPagoRepository from '../repositories/ObligacionPagoRepository';
import { avisoProximoVencimiento, avisoVencimientoHoy } from '../templates/templatesSendEmail';

function formatFecha(fecha: Date | string): string {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

async function enviarNotificacionesVencimiento() {
  try {
    const enDiezDias = await ObligacionPagoRepository.findPendientesVencenEn(10);
    for (const ob of enDiezDias) {
      await EmailService.sendMail(
        ob.email_estudiante,
        `Tu mensualidad vence en 10 días – ${ob.nombre_rubro}`,
        avisoProximoVencimiento({
          nombreEstudiante: ob.nombre_estudiante,
          nombreRubro: ob.nombre_rubro,
          montoCuota: ob.monto_cuota,
          fechaVencimiento: formatFecha(ob.fecha_vencimiento),
        })
      ).catch((err: unknown) => {
        console.error(`[NotificacionPago] Error al enviar correo (prox vencimiento) a ${ob.email_estudiante}:`, err);
      });
    }

    const hoy = await ObligacionPagoRepository.findPendientesVencenHoy();
    for (const ob of hoy) {
      await EmailService.sendMail(
        ob.email_estudiante,
        `Tu mensualidad vence hoy – ${ob.nombre_rubro}`,
        avisoVencimientoHoy({
          nombreEstudiante: ob.nombre_estudiante,
          nombreRubro: ob.nombre_rubro,
          montoCuota: ob.monto_cuota,
          fechaVencimiento: formatFecha(ob.fecha_vencimiento),
        })
      ).catch((err: unknown) => {
        console.error(`[NotificacionPago] Error al enviar correo (vence hoy) a ${ob.email_estudiante}:`, err);
      });
    }
  } catch (err) {
    console.error('[NotificacionPago] Error en el job:', err);
  }
}

export function startNotificacionPagoJob() {
  // Runs every day at 7:00 AM (America/Bogota)
  cron.schedule('0 7 * * *', enviarNotificacionesVencimiento, {
    timezone: 'America/Bogota',
  });
  console.log('[NotificacionPago] Job programado: diario a las 7:00 AM');
}
