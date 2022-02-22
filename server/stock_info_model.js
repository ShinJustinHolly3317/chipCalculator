// Require mysql connection
const db = require('./mysqlConnection')

async function getChipByStock(stock_code) {
  const getQry = `
  select * from chip 
  inner join stock on chip.stock_id=stock.stock_id
  where stock_code = ?
  order by date desc, net_buy desc
  limit 20;
  `
  try {
    const [result] = await db.query(getQry, [stock_code])
    return result
  } catch (error) {
    console.log(error)
    return { error }
  }
}

async function getChipByTrader(trader_code, dateRange) {
  const getQry = `
  SELECT chip.trader_name, sum(net_buy) as total, stock.stock_code, stock.company_name FROM chipmaster.chip
  inner join stock on chip.stock_id=stock.stock_id
  where date between ? and ? and
  trader_name= ?
  group by chip.stock_id
  order by total desc
  limit 50;
  `
  try {
    const [result] = await db.query(getQry, [
      dateRange.startDate,
      dateRange.endDate,
      trader_code
    ])
    return result
  } catch (error) {
    console.log(error)
    return { error }
  }
}

async function getChipBuyRank(dateRange) {
  const getQry = `
  select sum(net_buy) as total_buy, trader_name, trader_code, row_number() over(order by sum(net_buy) desc) as t_rank
  from chip
  where date > '2021-10-01'
  group by trader_name
  order by total_buy desc
  limit 50
  `

  try {
    const [result] = await db.query(getQry)
    return result
  } catch (error) {
    console.log(error)
    return { error }
  }
}

async function getChipBuyByTrader(tradeCode) {
  const getQry = `
    select trader_code, trader_name, company_name, sum(net_buy) as total_buy
    from chip
    inner join stock on chip.stock_id=stock.stock_id
    where trader_code = ?
    group by chip.stock_id
    order by total_buy desc
    limit 30
  `

  try {
    const [result] = await db.query(getQry, [tradeCode])
    return result
  } catch(error) {
    console.log(error)
    return { error }
  }
}

async function getStockList() {
  const stockList = await db.query('SELECT * FROM stock')
  return stockList[0].map((item) => {
    if (item.stock_code) {
      return [item.stock_id, item.stock_code, item.company_name]
    }
  })
}

async function insertChip(chipData, stockCode) {
  const insertQry = `
  INSERT INTO chip (stock_id, trader_name, trader_code, net_buy, date) VALUES ?
  `
  await db.query(insertQry, [chipData])
}

module.exports = {
  getChipByStock,
  getChipByTrader,
  getStockList,
  insertChip,
  getChipBuyRank,
  getChipBuyByTrader
}
