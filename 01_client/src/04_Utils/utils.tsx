export function addData(amount: number) {
  const arr = []
  for (let i = 0; i < amount; i++) {
    // min 50, max 100
    arr.push(Math.round(Math.random() * (100 - 50 + 1) + 50))
  }
  return arr
}
export const getRandom = () => {
  console.log('getRandom()')
  //@ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

export const isEmail = (email: string) => {
  let matchEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.toLocaleLowerCase().match(matchEmail)) {
    return true
  } else {
    return false
  }
}
