const express = require('express');
const app = express();
const mongoose = require('mongoose');
// DB config
const db = require('./config/keys').MongoURL;
// 引入users.js
const users = require('./routers/api/users');
// 引入profile.js
const profile = require('./routers/api/profile');
// 引入body-parser
const bodyParser = require('body-parser');
// 引入passport
const passport = require('passport');



// 连接到db
mongoose.connect(db, { useNewUrlParser: true }).then(() => {
    console.log('Mongoose connected')
}).catch(err => {
    console.log(err)
});
// passport初始化
app.use(passport.initialize());
// 配置passport
require('./config/passport')(passport);
// 使用body-parser中间件
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// 发送信息
app.get('/', (req, res) => {
    res.send('欢迎来到node的世界')
});

// 使用routers
app.use('/api/users',users);
app.use('/api/profile',profile);
// 设置端口
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});