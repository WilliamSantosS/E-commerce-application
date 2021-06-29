module.exports = {
   date(timestamp) {
       const date = new Date(timestamp)
    
       const year = date.getUTCFullYear()
       //concatenando 0 para que o mês seja exibido como 01 e não apenas 1 e utlizando o slice para
       //caso o valor já tenha dois digitos
       const month = `0${date.getUTCMonth() + 1}`.slice(-2)
       const day = `0${date.getUTCDate()}`.slice(-2)

        return {
         day,
         month,
         year,
         iso: (`${year}-${month}-${day}`),
         birthDay: `${month}/${day}`,
         format: `${day}/${month}/${year}`
     }
   }
}