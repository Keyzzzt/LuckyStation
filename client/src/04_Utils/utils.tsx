export const isEmail = (email: string) => {
  let matchEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.toLocaleLowerCase().match(matchEmail)) {
    return true
  } else {
    return false
  }
}

export let toLocal = {
  style: 'currency',
  currency: 'eur',
}

export const parseCreatedUpdated = (str: string) => {
  const arr = str.split('T')
  return {
    date: arr[0].split('-').reverse().join('.'),
    time: arr[1].slice(0, 8),
  }
}
