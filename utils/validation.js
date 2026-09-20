// Valida o email do usuário
function validateEmail(email) {
   if (typeof email !== "string") return false
   if (email.trim() === "") return false
   if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return false

   return true
}

// Valida o presente escolhido (valor e frase)
function validateGift(value, phrase) {
   if (typeof value !== "string" || typeof phrase !== "string") return false
   if (value.trim() === "" || phrase.trim() === "") return false
   if (!Number.isInteger(Number(value.trim()))) return false

   return true
}

export { validateEmail, validateGift }