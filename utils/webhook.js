import crypto from "node:crypto"

// Valida se o webhook foi enviado pelo Mercado Pago e não por qualquer outro lugar
function validateWebhookSignature(req) {
   const xSignature = req.headers["x-signature"]
   const xRequestId = req.headers["x-request-id"]
   const dataId = req.query["data.id"]

   if (!xSignature || !xRequestId || !dataId) return false

   const parts = xSignature.split(",")

   let ts
   let hash

   for (const part of parts) {
      const [key, value] = part.split("=")

      if (key?.trim() === "ts") ts = value?.trim()
      if (key?.trim() === "v1") hash = value?.trim()
   }

   if (!ts || !hash) return false

   const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`

   const expectedHash = crypto.createHmac("sha256", process.env.MP_WEBHOOK_SECRET).update(manifest).digest("hex")
   const expectedBuffer = Buffer.from(expectedHash)
   const hashBuffer = Buffer.from(hash)

   if (expectedBuffer.length !== hashBuffer.length) return false

   return crypto.timingSafeEqual(expectedBuffer, hashBuffer)
}

export { validateWebhookSignature }