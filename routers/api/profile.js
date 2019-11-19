// login & register
const express = require('express');
const router = express.Router();
// 使用Profile
const Profile = require('../../models/Profile');
// 引入passport
const passport = require('passport');

// $route GET请求，地址为api/profile/test
// @desc 返回请求的json 数据
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: "profile works"
    })
});

// $route POST请求，地址为api/profile/add
// @desc 创建信息接口
// @access private
router.post('/add',passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileObj = {};
    if(req.body.type) profileObj.type = req.body.type;
    if(req.body.describe) profileObj.describe = req.body.describe;
    if(req.body.income) profileObj.income = req.body.income;
    if(req.body.expend) profileObj.expend = req.body.expend;
    if(req.body.cash) profileObj.cash = req.body.cash;
    if(req.body.remark) profileObj.remark = req.body.remark;

    new Profile(profileObj).save().then(profile => {
        res.json(profile);
    })
});

// $route GET请求，地址为api/profile
// @desc 获取所有信息
// @access private
router.get('/',passport.authenticate("jwt", { session: false }), (req, res) =>{
    Profile.find().then(profile => {
        if(!profile) {
            return res.status(404).json('没有内容')
        }
        res.json(profile);
    }).catch(err => {
        return res.status(404).json(err);
    })
});

// $route GET请求，地址为api/profile/:id
// @desc 获取单个信息
// @access private
router.get('/:id',passport.authenticate("jwt", { session: false }), (req, res) =>{
    Profile.findOne({_id: req.params.id}).then(profile => {
        if(!profile) {
            return res.status(404).json('没有内容')
        }
        res.json(profile);
    }).catch(err => {
        return res.status(404).json(err);
    })
});

// $route POST请求，地址为api/profile/edit
// @desc 编辑信息接口
// @access private
router.post('/edit/:id',passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileObj = {};
    if(req.body.type) profileObj.type = req.body.type;
    if(req.body.describe) profileObj.describe = req.body.describe;
    if(req.body.income) profileObj.income = req.body.income;
    if(req.body.expend) profileObj.expend = req.body.expend;
    if(req.body.cash) profileObj.cash = req.body.cash;
    if(req.body.remark) profileObj.remark = req.body.remark;

    Profile.findOneAndUpdate(
        {_id: req.params.id},
        {$set: profileObj},
        {new: true}
    ).then(profile => res.json(profile))
});

// $route GET请求，地址为api/profile/delete/:id
// @desc 删除接口
// @access private
router.delete('/delete/:id',passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOneAndRemove(
        {_id: req.params.id}
    ).then(profile => {
        profile.save().then(profile => res.json(profile))
    }).catch(err => res.status(404).json('删除失败'))
});



module.exports = router;