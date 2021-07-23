module.exports = {
  date(timestamp) {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    //concatenando 0 para que o mês seja exibido como 01 e não apenas 1 e utlizando o slice para
    //caso o valor já tenha dois digitos
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    const hour = date.getHours()
    const minutes = date.getMinutes()

    return {
      day,
      month,
      year,
      hour,
      minutes,
      iso: (`${year}-${month}-${day}`),
      birthDay: `${month}/${day}`,
      format: `${day}/${month}/${year}`
    }
  },

  formatPrice(price) {
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100)
  },

  formatCpfCnpj(value) {
    value = value.replace(/\D/g, "")

    if (value.length > 14) {
      value = value.slice(0, -1)
    }

    if (value.length > 11) {
      value = value.replace(/(\d{2})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1/$2")
      value = value.replace(/(\d{4})(\d)/, "$1-$2")

    } else {
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1-$2")

    }

    return value
  },

  formatCep(value) {
    value = value.replace(/\D/g, "")
    if (value.length > 8) {
      value = value.slice(0, -1)
    }

    value = value.replace(/(\d{5})(\d)/, "$1-$2")
    return value
  }

}