var dataManager = require('DataManager');

cc.Class({
    extends: cc.Component,

    properties: {
        // 本局游戏得分
        score: 0,

        // 得分显示
        scoreText: {
            default: null,
            type: cc.Node
        },

        // 最高分显示
        bestScoreText: {
            default: null,
            type: cc.Node
        },

        // 本局吃到的钻石数显示
        diamondText: {
            default: null,
            type: cc.Node
        },

        // 排行榜按钮
        btnRank: {
            default: null,
            type: cc.Node
        },

        // 重玩按钮
        btnRePlay: {
            default: null,
            type: cc.Node
        },

        // 主页按钮
        btnHome: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.addBtnEvents();
        this.setText();
    },

    addBtnEvents () {
        this.btnRank.on('touchend', function (event) {
            cc.director.loadScene('RankScene');
        }, this);

        this.btnRePlay.on('touchend', function (event) {
            cc.director.loadScene('GameScene');
        }, this);

        this.btnHome.on('touchend', function (event) {
            cc.director.loadScene('StartScene');
        }, this);
    },

    setText () {
        // 设置本局游戏分数和钻石数并显示
        this.scoreText.getComponent(cc.RichText).string = dataManager.instance.singleGameScore.toString();
        this.diamondText.getComponent(cc.RichText).string = '+' + dataManager.instance.singleGameDiamond.toString();
    },

    start () {

    },

    // update (dt) {},
});
