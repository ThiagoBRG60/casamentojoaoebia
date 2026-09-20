// Formata um número para uma moeda válida (ex: R$ 50,00)
function formatCurrency(value) {
   const numeric = Number(value.trim())

   if (Number.isNaN(numeric)) throw new Error(`Valor inválido: ${value}`)

   return numeric.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
}

export { formatCurrency }