const axios = require('axios')
const moment = require('moment')

// user agent list
const USER_AGNET = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36 ',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9 ',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
  'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36 '
]
const cookie =
  'buuid=VWNnNmVMb1FKSEoxNk8wOUtBMDJvVitaVGM1ckdmZTQ4ZDJkQWNFQmVCY3l3Um5reU5KdUVReERPT2tCOGJtMS0tNm9PdmRJSWhvY0hXZ0RxcmtDZzBDZz09--b74b881997402b405545f1cfcf4487bd40c63fdd; easy_ab=a9ccb89c-3cb2-4b1d-a7ff-8c0accbd6296; _gid=GA1.2.235890240.1638718977; upgrade_browser=1; amplitude_id_0ab77a441fbc226251ef1a272380fcd7statementdog.com=eyJkZXZpY2VJZCI6ImMwZWNkMWRiLTQ3NjktNGFjZS1iMjcxLTM1ODg2Y2FlODU5YlIiLCJ1c2VySWQiOiI1MDg0NDAiLCJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOjE2Mzg3MTg5NzY2MDMsImxhc3RFdmVudFRpbWUiOjE2Mzg3MTkyNDM0MjQsImV2ZW50SWQiOjM1NywiaWRlbnRpZnlJZCI6MjgzLCJzZXF1ZW5jZU51bWJlciI6NjQwfQ==; _ga=GA1.2.445107378.1597071652; intercom-session-d5wdetwg=U0Y4ekRQS3hDN1BBVCtxT2R0aWt3K1g0enNJWWQyV21VTEp4bXRBUXdESnY1KzdRSFlvVWlQc0Z6ZEN4NTRnaS0tMTFGSjE5aXg1bU5Balo5VkE0cURKZz09--b4211dcba888932cb54b670ac5704a0fdb1e86b2; _ga_K9Y9Y589MM=GS1.1.1638718976.33.1.1638719245.52; _statementdog_session_v2=LNJ11tMaC9CV64%2Bv9CpWe8kuRPj3ekjdAj4d%2FpOMr0K29EHIAe6tcslBQh8UlKzWo%2BV7RGlbdNVM%2FRPPA2bCiC5mKHWCcxQwybxNn7QRxnXogFUiHSKxmk%2Blq9PvDBqEKTJuXkw57HRyclx1%2Fi899CK5IWWwVOx8o2Uxisrj3uVBsDJqHWq8ckpUp0QTbLtmvl3kZYf%2FrnK9QowdvIJWdBfJx0eexgUOO00m4ynANp8t9Jnq3Dt5SyfRqpFpolZA%2BJuItldYyJeeTOwd1XuclLjm7QYXAycUwRpOZQ5042hfcxNRhEewRirEDj8ybhw4lTh6hQQu6Hx6ay3ulXBvT2Il1lZ634AvJZIKRBTDXB7FFb7NwmebbzKE8LrdQXMwndv1B22X4xEKV6P67yb2QFzWNzlgDC0%2F%2BK0BX9qGXFwD0U6l3F5KhjdSmYptrCBA%2Be%2BCLcm9f0pnWMqF4XHK7J0q8DfJHrpc%2FH94w2C0rz41RQk6dDsaSdeigotvg8x49OMVsluv8ou%2FxR2h4m%2Bs4BOiNFwi4jjdGVMC6g6Jy5pVjU8HwrZ1FesXGrCp6LUPQW580tc2--5RBuylrxB6yXDAOe--eR3UmXCSe17jwxpDV1ixkQ%3D%3D'

// model
const { insertChip, getStockList } = require('./server/stock_info_model')

// missing counter
const missingStock = []

// Functions
async function main() {
  const stockList = await getStockList()

  for (let i = 0; i < stockList.length; i++) {
    console.log('Round ID', i)

    console.log('Company:', stockList[i])
    await chipScrape(stockList[i][0], stockList[i][1])
    // await sleep(Math.floor(Math.random() * 1000))
    console.log('missingStock', missingStock)
  }
  console.log(stockList)
  // await Promise.all(stockList.map((stockId) => {
  //   console.log('Company:', stockId)
  //   return chipScrape(stockId[0], stockId[1])
  // }))

  console.log('missingStock', missingStock)
  process.exit()
}

async function chipScrape(stockId, stockCode) {
  const url = `https://statementdog.com/api/v1/stocks/${stockCode}/chips?days=1`
  const chipData = []

  try {
    let result = await axios.get(url, {
      headers: {
        'user-agent': USER_AGNET[Math.floor(Math.random() * 4)],
        'content-type': 'text/html; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
        'Accept-Encoding': 'br, gzip, deflate',
        'Accept-Language': 'en-gb',
        Accept: `test/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
        Cookie: cookie
      },
      withCredentials: true
    })

    if (!result) {
      missingStock.push([stockCode])
      return
    }

    const buyResult = result.data.traders.buyers
    const sellResult = result.data.traders.sellers

    for (let item of buyResult) {
      chipData.push([
        stockId,
        item.name,
        item.code,
        item.netBuySell,
        result.data.start_date
      ])
    }

    for (let item of sellResult) {
      chipData.push([
        stockId,
        item.name,
        item.code,
        -item.netBuySell,
        result.data.start_date
      ])
    }

    console.log('This round', chipData.length)
    await insertChip(chipData, stockCode)
  } catch (error) {
    missingStock.push([stockCode])
    console.log(error.message)
  }
}

function sleep(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

// Main function
main()
