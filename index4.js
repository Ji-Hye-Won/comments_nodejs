var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:'); // 가져온 부분, 메모리에 db를 올려 사용! 파일로 저장하고 싶을땐?
const sequelize = new Sequelize({
  dialect: 'sqlite', 
  storage: "database.sqlite"}); // 가져온 부분, 경로에 db를 저장하여 사용! 파일로 저장하고 싶을땐?


const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false // 비어있어도 되냐? 빈 데이터도 받아들일거냐? (반드시 입력*)
  }
}, {
  // Other model options go here
});


Comments.sync();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
// set the view engine to ejs (새로 생긴 부분!, ejs라는 파일을 만들어 응답에 실어 보낸다)
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page (res.send 가 res.render로 바뀐 것을 확인하실 수 있습니다~)
// ejs 라고 하는 파일을 render로 내보낸다 (res: index라고 하는 것을 render 하겠다)
app.get('/', async function(req, res) {
  const comments = await Comments.findAll();// 다 찾아서 comments에 넣고 comments: 로 보내주겠다
  res.render('index4', {comments : comments});
});


app.post('/create', async function(req, res){
    console.log(req.body)
    const { content } = req.body

    // push 대신에!
    const newcomment = await Comments.create({ content: content });//orm방식
    console.log("The newest comment:", newcomment.id);
    res.redirect('/') // 모든 과정이 끝나고 나서, 다시 루트 경로로 이동시켜주겠다!

})
app.post('/update/:id', async function(req, res){
  console.log(req.params)
  console.log(req.body)
  const { content } = req.body
  const { id } = req.params

  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  })
  res.redirect('/') // 모든 과정이 끝나고 나서, 다시 루트 경로로 이동시켜주겠다!

})
app.post('/delete/:id', async function(req, res){
  console.log(req.params)
  const { id } = req.params

  await Comments.destroy({
    where: {
      id: id
    }
  })
  res.redirect('/') // 모든 과정이 끝나고 나서, 다시 루트 경로로 이동시켜주겠다!

})

app.listen(3000);
console.log('Server is listening on port 3000');