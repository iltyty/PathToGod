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

        this.updateBestScoreArr();

        dataManager.instance.saveDataToMemory();
        cc.director.loadScene('GameOverScene');
    },

    // 将本局得分存储
    updateBestScoreArr () {
        // 若此局分数大于前三名，则更新排行榜数据
        let bestArr = dataManager.instance.bestScores;
        
        if (bestArr.indexOf(this.score) >= 0) {
            // 已经有相同的分数，直接返回
            return;
        }

        bestArr.push(this.score);
        bestArr.sort(function (a, b) {
            return b - a;
        });
        bestArr.pop();

        if (this.score === bestArr[0]) {
            // 为新的最高分
            dataManager.instance.isNewBest = true;
        } else {
            dataManager.instance.isNewBest = false;
        }
    }
});
