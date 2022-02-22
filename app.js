const port = 3000
const express = require('express')
const app = express()

// body parser
app.use(express.urlencoded({ extended: false, limit: '5mb' }))
app.use(express.json({ extended: false, limit: '5mb' }))

// view engine
const { engine } = require('express-handlebars')
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

// static files
app.use(express.static('public'))

// use Routes
const Controller = require('./server/controller')
app.get('/get_chip_by_stock/:stockCode', Controller.getChipByStock)
app.get(
  '/get_chip_by_trader/:traderCode/:startDate/:endDate',
  Controller.getChipByTrader
)
app.get('/get_chip_buy_rank', Controller.getTraderRank)
app.get('/chip_buy_by_trader/:traderCode', Controller.getChipBuyByTrader)

app.get('/', (req, res) => {
  res.render('home')
})

// Page not found
app.use(function (req, res, next) {
  res.status(404).render('404', { style: '404.css' })
})

app.listen(port, () => {
  console.log(`This server is running on http://localhost:${port}`)
})
