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

        // 新的最高分时显示new
        newNode: {
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
        dataManager.instance.getDataFromMemory();

        this.resManager = cc.find('Canvas/resManager').getComponent('ResManager');
        this.addBtnEvents();
        this.setUI();
    },

    addBtnEvents () {
        this.btnRank.on('touchend', function (event) {
            this.resManager.playEffect(this.resManager.buttonClip);
            cc.director.loadScene('RankScene');
        }, this);

        this.btnRePlay.on('touchend', function (event) {
            this.resManager.playEffect(this.resManager.buttonClip);
            cc.director.loadScene('GameScene');
        }, this);

        this.btnHome.on('touchend', function (event) {
            this.resManager.playEffect(this.resManager.buttonClip);
            cc.director.loadScene('StartScene');
        }, this);
    },

    setUI () {
        // 设置本局游戏分数和钻石数并显示
        let singleScore = dataManager.instance.singleGameScore;
        let singleDiamond = dataManager.instance.singleGameDiamond;
        let theBestScore = dataManager.instance.bestScores[0];

        if (dataManager.instance.isNewBest) {
            this.newNode.active = true;
        }

        this.scoreText.getComponent(cc.RichText).string = singleScore.toString();
        this.diamondText.getComponent(cc.RichText).string = '+' + singleDiamond.toString();
        this.bestScoreText.getComponent(cc.RichText).string = '最高分：' + theBestScore.toString();
    },

    start () {

    },

    // update (dt) {},
});
