const res = require('express/lib/response')
const Chip = require('./stock_info_model')

const getChipByStock = async (req, res) => {
  const { stockCode } = req.params
  console.log('param', stockCode)
  const result = await Chip.getChipByStock(stockCode)

  return res.send({ data: result })
}

const getChipByTrader = async (req, res) => {
  const { traderCode, startDate, endDate } = req.params
  console.log('trader', req.params)
  const result = await Chip.getChipByTrader(traderCode, { startDate, endDate })

  return res.send({ data: result })
}

const getTraderRank = async (req, res) => {
  const { dateRange } = req.params
  const result = await Chip.getChipBuyRank(dateRange)

  return res.send({ data: result })
}

const getChipBuyByTrader = async (req, res) => {
  const { traderCode } = req.params
  const result = await Chip.getChipBuyByTrader(traderCode)

  return res.send({ data: result })
}

module.exports = {
  getChipByStock,
  getChipByTrader,
  getTraderRank,
  getChipBuyByTrader
}
