export function formatRupiah(value) {
  // Ensure the value is a number, and fix any decimals
  const number = parseFloat(value).toFixed(0)

  // Format with thousand separators
  return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
