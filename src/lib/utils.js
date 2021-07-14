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
  }

}