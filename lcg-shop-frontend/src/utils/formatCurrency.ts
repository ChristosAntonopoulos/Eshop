export function formatCurrency(amount: number, locale = "el-GR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
