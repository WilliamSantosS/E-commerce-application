//Após pegarmos o nunjuncks podemos setar o motor de visualização que será utilizado
const nunjucks = require('nunjucks')
const express = require('express')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')
const server = express();

//Midllewars
server.use(session)
//acessando a pasta que contem os arquivos staticos CSS

server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

//Dizendo qual motor será utilizado que nesse caso é a view engine
server.set("view engine", "njk");

//Depois podemos fazer a configuração da rota que ele irá utilizar
//que nesse caso será a pasta views e também dizemos que vamos usar o express e a variavel que 
//estamos utilizando
nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false
});

server.listen(5000, function() {
    console.log('Server is running ')
})