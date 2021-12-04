// 引入各種模組
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')

const app = express()
// 資料庫連線
mongoose.connect('mongodb://localhost/todo-list')

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
// 引入express 內建的body-parser
app.use(express.urlencoded({ extended: true}))
// 設定模板引擎
app.engine('hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// 設定路由
  // 首頁
  app.get('/', (req, res) => {
    Todo.find()  // 取出 Todo model 裡的所有資料
      .lean()    // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
      .then(todos => res.render('index', { todos }))    // 將資料傳給 index 樣板
      .catch(error => console.error(error))             // 錯誤處理
  })
  // 新增todo
  app.get('/todos/new', (req, res) => {
    res.render('new')
  })
  app.post('/todos', (req, res) => {
    const name = req.body.name
    return Todo.create({ name })          // 從 req.body 拿出表單裡的 name 資料
      .then(() => res.redirect('/'))      // 存入資料庫
      .catch(error => console.log(error)) // 新增完成後導回首頁
  })
  // 瀏覽特定todo
  app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then(todo => res.render('detail', { todo }))
      .catch(error => console.log(error))
  })
  // 修改特定todo
  app.get('/todos/:id/edit', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .lean()
      .then(todo => res.render('edit', { todo }))
      .catch(error => console.log(error))
  })
  app.post('/todos/:id/edit', (req, res) => {
    const id = req.params.id
    const { name, isDone} = req.body

    return Todo.findById(id)
      .then(todo => {
        todo.name = name
        todo.isDone = isDone === 'on'
        return todo.save()
      })
      .then(() => res.redirect(`/todos/${id}`))
      .catch(error => console.log(error))
  })
  // 刪除特定todo
  app.post('/todos/:id/delete', (req, res) => {
    const id = req.params.id
    return Todo.findById(id)
      .then(todo => todo.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

// 啟動伺服器
app.listen(3000, () => {
  console.log('app is running')
})