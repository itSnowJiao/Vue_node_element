// login & register
const express = require('express');
const router = express.Router();
// 使用User
const User = require('../../models/User');
// 引入bcrypt
const bcrypt = require('bcrypt');
// 引入gravatar
const gravatar = require('gravatar');
// 引入jwt
const jwt = require('jsonwebtoken');
// 引入keys.js
const keys = require('../../config/keys');
// 引入passport
const passport = require('passport');

// $route GET请求，地址为api/users/test
// @desc 返回请求的json 数据
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: "login works"
    })
});

// $route POST请求，地址为api/users/register
// @desc 返回请求的json 数据
// @access public
router.post('/register', (req, res) => {
    // console.log(req.body)
    // 查询数据库中是否拥有邮箱
    User.findOne({
        email: req.body.email
    }).then((user) => {
        if (user) {
            return res.status(400).json(
                "邮箱已被占用！"
            )
        } else {
            // 头像
            var avatar = gravatar.url(req.body.avatar, { s: '200', r: 'pg', d: 'mm' });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
                identity: req.body.identity
            });
            // 密码加密
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => res.json(user)).catch(err => console.log(err));
                });
            });
        }
    })
});

// $route POST请求，地址为api/users/login
// @desc 返回token jwt passport
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json("用户不存在");
        };

        // 密码匹配
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // jwt.sign(规则，加密名字，过期时间s，箭头函数)
                const rule = { 
                    id: user.id, 
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity
                };
                jwt.sign(rule, keys.seceretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                });
                // res.json({msg: "success"})
            } else {
                return res.status(400).json(
                    "密码错误"
                )
            }
        });
    })
});

// $route GET请求，地址为api/users/current
// @desc 返回当前用户信息
// @access private
router.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
});

module.exports = router;