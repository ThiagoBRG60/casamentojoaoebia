const gifts = new Map([
   ["50", "Uma taça de espumante pro brinde"],
   ["75", "A fatia mais generosa do bolo"],
   ["100", "Gasolina pro carro dos noivos"],
   ["150", "A música do primeiro beijo tocando mais alto"],
   ["200", "Uma noite chique lá na lua de mel"]
])

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

   const expectedGift = gifts.get(value.trim())

   return expectedGift !== undefined && expectedGift === phrase.trim()
}

export { validateEmail, validateGift }