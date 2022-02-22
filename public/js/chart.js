const loadingCover = document.querySelector('#loading')
const Button = {
  stockBtn: document.querySelector('.stock-btn'),
  traderBtn: document.querySelector('.trader-btn'),
  traderRankBtn: document.querySelector('.trader-rank-btn'),
  chipBuyByTrader: document.querySelector('.chip-buy-by-trader-btn')
}
const Table = {
  tableModal: new bootstrap.Modal(document.getElementById('traderRankModal')),
  chipBuyByTraderModal: new bootstrap.Modal(
    document.getElementById('chip-buy-by-trader-modal')
  ),
  traderBuyRank: document.querySelector('.trader-buy-rank-table tbody'),
  chipBuyByTrader: document.querySelector('.chip-buy-by-trader-table tbody')
}

async function getChipData(stockCode) {
  const response = await fetch(`/get_chip_by_stock/${stockCode}`)
  const chipDataSet = await response.json()

  const chipData = chipDataSet.data.map((item) => {
    return [item.trader_name, item.net_buy]
  })

  return chipData
}

async function getChipDataByTrader(trader, startDate, endDate) {
  const response = await fetch(
    `/get_chip_by_trader/${trader}/${startDate}/${endDate}`
  )
  const chipDataSet = await response.json()

  const chipData = chipDataSet.data.map((item) => {
    return [item.company_name, item.total]
  })

  return chipData
}

async function render(stockInfo) {
  const title = stockInfo.stockCode || stockInfo.trader
  // create data
  const data = stockInfo.stockCode
    ? await getChipData(title)
    : await getChipDataByTrader(title, stockInfo.startDate, stockInfo.endDate)

  console.log(data)
  // create a chart
  chart = anychart.column()

  // set chart title text settings
  chart.title(`${title} / 日期 ${stockInfo.startDate} 至 ${stockInfo.endDate}`)

  // create a column series and set the data
  var series = chart.column(data)

  // set the container id
  chart.container('container')

  // set series tooltip settings
  series.tooltip().format('{%y}')

  // axis label
  chart.xAxis().labels().rotation(-90)

  // initiate drawing the chart
  chart.draw()
}

async function showTraderBuyRank() {
  loadingCover.classList.remove('hidden')
  let rankResult

  // check cache
  const rankCache = localStorage.getItem('traderRank')
  const cahceDate = localStorage.getItem('rankCacheDate')
  const todayDate = new Date()
  if (rankCache && +cahceDate === todayDate.getDate()) {
    rankResult = JSON.parse(rankCache)
  } else {
    const response = await fetch('/get_chip_buy_rank')
    rankResult = await response.json()

    localStorage.setItem('traderRank', JSON.stringify(rankResult))
    localStorage.setItem('rankCacheDate', todayDate.getDate())
  }

  Table.traderBuyRank.innerHTML = ''
  rankResult.data.forEach((rankInfo) => {
    Table.traderBuyRank.innerHTML += `
      <tr class="chip-buy-by-trader-btn">
        <th scope="row">${rankInfo.t_rank}</th>
        <td trader-code=${rankInfo.trader_code} class="rank-trader-code">${rankInfo.trader_name}</td>
        <td>${rankInfo.total_buy}</td>
      </tr>
    `
  })

  loadingCover.classList.add('hidden')

  Table.tableModal.show()
}

async function showChipBuyByTrader(traderCode) {
  loadingCover.classList.remove('hidden')
  Table.tableModal.hide()

  console.log(traderCode)
  const response = await fetch(`/chip_buy_by_trader/${traderCode}`)
  const chipResult = await response.json()
  console.log(chipResult)

  Table.chipBuyByTrader.innerHTML = ''
  chipResult.data.forEach((chipBuyInfo) => {
    Table.chipBuyByTrader.innerHTML += `
      <tr>
        <td trader-code=${chipBuyInfo.trader_code}>${chipBuyInfo.trader_name}</td>
        <td>${chipBuyInfo.company_name}</td>
        <td>${chipBuyInfo.total_buy}</td>
      </tr>
    `
  })

  loadingCover.classList.add('hidden')

  Table.chipBuyByTraderModal.show()
}

Button.stockBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const stockCode = document.querySelector('#input-stock').value

  render({ stockCode, trader: null })
})

Button.traderBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const trader = document.querySelector('#input-trader').value
  const startDate = document.querySelector('#trade-start').value
  const endDate = document.querySelector('#trade-end').value

  render({ stockCode: null, trader, startDate, endDate })
})

Button.traderRankBtn.addEventListener('click', (e) => {
  showTraderBuyRank()
})

Table.traderBuyRank.addEventListener('click', (e) => {
  if (
    !e.target.classList.contains(
      'rank-trader-code'
    )
  ) return 

  showChipBuyByTrader(e.target.attributes[0].value)
})
