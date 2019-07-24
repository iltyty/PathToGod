cc.Class({
    extends: cc.Component,

    properties: {
        bgs: {
            default: [],
            type: [cc.SpriteFrame]
        },

        // 暂停按钮
        btnPause: {
            default: null,
            type: cc.Node
        },

        // 继续按钮
        btnPlay: {
            default: null,
            type: cc.Node
        },

        // 显示分数的RichText
        scoreText: {
            default: null,
            type: cc.Node,
        },

        // 记录钻石数目的结点
        diamondText: {
            default: null,
            type: cc.Node
        },

        // 按钮点击音效
        audioClick: {
            default: null,
            type: cc.AudioClip
        },

        // GameLogicManager脚本
        gameInstance: null,

        // ResManager脚本
        resManager: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInstance = cc.find('Canvas/gameLogicManager').getComponent('GameLogicManager');
        this.resManager = cc.find('Canvas/resManager').getComponent('ResManager');

        this.loadRandomBg();
        this.addBtnEvents();
    },

    loadRandomBg () {
        // 加载一张随机的背景图片
        let index = parseInt(Math.random() * 4);
        
        this.node.getChildByName('background').getComponent(cc.Sprite).spriteFrame = this.bgs[index];
    },

    addBtnEvents () {
        this.btnPause.on('touchend', function(event) {
            cc.audioEngine.playEffect(this.resManager.buttonClip, false);
            this.btnPause.active = false;
            this.btnPlay.active = true;
            this.gameInstance.gamePaused = true;
            cc.director.pause();
        }, this);

        this.btnPlay.on('touchend', function(event) {
            cc.audioEngine.playEffect(this.resManager.buttonClip, false);
            this.btnPlay.active = false;
            this.btnPause.active = true;
            this.gameInstance.gamePaused = false;
            cc.director.resume();
        }, this);
    },

    start () {

    },

    // update (dt) {},
});
