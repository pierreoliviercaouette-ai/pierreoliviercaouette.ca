export function calcDebtAnnualInterest(debt) {
  if (!debt || (parseFloat(debt.currentBalance) || 0) <= 0) return 0;
  const monthlyRate = ((parseFloat(debt.interestRate) || 0) / 100) / 12;
  let balance = parseFloat(debt.currentBalance) || 0;
  let totalInterest = 0;
  const payment = parseFloat(debt.monthlyPayment) || 0;
  for (let m = 0; m < 12; m++) {
    if (balance <= 0) break;
    const interest = balance * monthlyRate;
    totalInterest += interest;
    const principal = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - Math.max(0, principal));
  }
  return totalInterest;
}
