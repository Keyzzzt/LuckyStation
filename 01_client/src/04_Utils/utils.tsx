export function addData(amount: number) {
  const arr = []
  for (let i = 0; i < amount; i++) {
    // min 50, max 100
    arr.push(Math.round(Math.random() * (100 - 50 + 1) + 50))
  }
  return arr
}
