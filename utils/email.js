import { Resend } from "resend"
import { formatCurrency } from "./currency.js"

const resend = new Resend(process.env.RESEND_API_KEY)
const OWNER_EMAIL = "joaogabrielalberton@gmail.com"

// Escapar os dados recebidos pelo usuário antes de enviar o email, por segurança
function escapeHtml(value) {
   return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
}

// Envia o email de pagamento para o destinatário, com email, valor, presente e mensagem
async function sendPaymentEmail({paymentId, email, amount, phrase, message}) {
   const { data, error } = await resend.emails.send({
      from: "Casamento <onboarding@resend.dev>",
      to: OWNER_EMAIL,
      subject: "Novo presente recebido",
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
            <h2 style="margin-bottom: 25px;">Novo presente recebido!</h2>

            <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px;">
               <p style="margin: 0 0 15px;">
                  <strong>Email:</strong><br>
                  ${escapeHtml(email.trim())}
               </p>

               <p style="margin: 0 0 15px;">
                  <strong>Valor:</strong><br>
                  ${formatCurrency(amount)}
               </p>

               <p style="margin: 0 0 15px;">
                  <strong>Presente:</strong><br>
                  ${escapeHtml(phrase.trim())}
               </p>
               
               <p style="margin: 0;">
                  <strong>Mensagem:</strong><br>
                  ${escapeHtml(message.trim() || "Nenhuma mensagem foi escrita")}
               </p>
            </div>
         </div>
      `
   }, {
      idempotencyKey: `payment/${paymentId}`
   })

   if (error) throw new Error(`Erro ao enviar email: ${error.message}`)
}

export { sendPaymentEmail }