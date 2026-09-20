import express from "express"
import { validateWebhookSignature } from "../utils/webhook.js"
import { validateEmail, validateGift } from "../utils/validation.js"
import { sendPaymentEmail } from "../utils/email.js"

const app = express()

app.use("/utils", express.static("utils"))
app.use(express.static("public"))
app.use(express.json())

// Detecta o pagamento feito pelo usuário e envia o email para o destinatário
app.post("/api/payments/webhook", async (req, res) => {
   try {
      if (!validateWebhookSignature(req)) return res.sendStatus(401)

      const { type, data } = req.body
   
      if (type !== "payment") return res.sendStatus(200)
      
      const paymentId = data.id
   
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
         headers: {
            "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
         }
      })
   
      const payment = await response.json()

      if (!response.ok) return res.sendStatus(500)

      if (payment.status !== "approved") return res.sendStatus(200)

      const { phrase, message } = payment.metadata
      const email = payment.payer.email
      const amount = payment.transaction_amount

      await sendPaymentEmail(paymentId, email, amount, phrase, message)
   
      res.sendStatus(200)
   } catch (error) {
      res.sendStatus(500)
   }
})

// Rota backend de geração de pix com o valor definido (qr code e chave pix)
app.post("/api/payments/pix", async (req, res) => {
   try {
      const { email, amount, phrase, message } = req.body
   
      if (!validateEmail(email)) return res.status(400).json({error: "O email informado é inválido"})

      if (!validateGift(amount, phrase)) return res.status(400).json({error: "O presente selecionado é inválido"})

      const response = await fetch("https://api.mercadopago.com/v1/payments", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            "X-Idempotency-Key": crypto.randomUUID()
         },
         body: JSON.stringify({
            transaction_amount: Number(amount.trim()),
            payment_method_id: "pix",
            payer: {
               email: email.trim()
            },
            metadata: {
               phrase: phrase.trim(),
               message: message.trim()
            }
         })
      })

      const data = await response.json()

      if (!response.ok) return res.status(502).json({error: "Não foi possível gerar o pagamento. Tente novamente"})

      res.status(200).json(data)
   } catch (error) {
      res.status(500).json({error: "Ocorreu um erro ao criar o pagamento, tente novamente mais tarde"})
   }
})

app.listen(3000, () => console.log("Servidor rodando no endereço http://localhost:3000"))