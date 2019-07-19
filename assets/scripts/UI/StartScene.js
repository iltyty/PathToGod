cc.Class({
    extends: cc.Component,

    properties: {
        // 开始游戏按钮
        btnStart: {
            default: null,
            type: cc.Node
        },

        // 商店按钮
        btnShop: {
            default: null,
            type: cc.Node
        },

        // 排行榜按钮
        btnRank: {
            default: null,
            type: cc.Node
        },

        // 游戏音量按钮
        btnSound: {
            default: null,
            type: cc.Node
        },

        // 按钮点击音效
        audioClick: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 给每个按钮添加点击事件
        this.addBtnEvents();
    },

    toGameScene() {
        // 切换至游戏场景
        cc.director.loadScene('GameScene');
    },

    toShopScene() {
        // 切换至商店场景
        cc.director.loadScene('ShopScene');
    },

    toRankScene() {
        // 切换至排行榜场景
        cc.director.loadScene('RankScene');
    },

    switchSoundState() {
        // 游戏是否静音
        
    },

    addBtnEvents() {
        this.btnStart.on('touchend', function(event) {
            cc.audioEngine.playEffect(this.audioClick, false, 1);
            this.toGameScene();
        }, this);

        this.btnShop.on('touchend', function(event) {
            cc.audioEngine.playEffect(this.audioClick, false, 1);
            this.toShopScene();
        }, this);

        this.btnRank.on('touchend', function(event) {
            cc.audioEngine.playEffect(this.audioClick, false, 1);
            this.toRankScene();
        }, this);

        this.btnSound.on('touchend', function(event) {
            cc.audioEngine.playEffect(this.audioClick, false, 1);
            this.switchSoundState();
        }, this);
    },

    start() {

    },

    update (dt) {

    },
});
