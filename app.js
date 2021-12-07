// 引入各種模組
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')  // 引用路由器，這樣寫程式會自動去找routes 底下的index.js 檔案

require('./config/mongoose')
const app = express()


// 引入express 內建的body-parser
app.use(express.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 將 request 導入路由器
app.use(routes)

// 設定模板引擎
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 啟動伺服器
app.listen(3000, () => {
  console.log('app is running')
})