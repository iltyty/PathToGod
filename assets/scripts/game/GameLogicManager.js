var dataManager = require('DataManager');

cc.Class({
    /*
     * 管理游戏逻辑的类
     */

    extends: cc.Component,

    properties: {
        // 游戏是否结束
        gameOver: false,

        // 游戏是否暂停
        gamePaused: false,

        // 人物是否开始移动
        moveBegan: false,

        // GameScene脚本
        gameScene: null,

        // 当前分数
        score: -1,

        // 当前钻石数
        diamondCount: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameScene = cc.find('Canvas').getComponent('GameScene');
    },

    start () {

    },

    // update (dt) {},

    // 刷新分数和钻石数的显示
    refreshUI () {
        this.gameScene.scoreText.getComponent(cc.RichText).string = this.score.toString();
        this.gameScene.diamondText.getComponent(cc.RichText).string = this.diamondCount.toString();
    },

    // 游戏结束，调用结束面板
    toGameOverScene () {
        dataManager.instance.singleGameScore = this.score;
        dataManager.instance.singleGameDiamond = this.diamondCount;
        
        dataManager.instance.diamondTotal += this.diamondCount;
        dataManager.instance.saveScoreAndDiamond();

        cc.director.loadScene('GameOverScene');
    }
});
