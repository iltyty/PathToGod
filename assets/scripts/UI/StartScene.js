var dataManager = require('DataManager');

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

        // 重置游戏数据按钮
        btnReset: {
            default: null,
            type: cc.Node
        },

        // 重置游戏的否按钮
        btnNo: {
            default: null,
            type: cc.Node
        },

        // 重置游戏的是按钮
        btnYes: {
            default: null,
            type: cc.Node
        },

        // 显示重置界面时将主界面变灰
        bgColor: {
            default: null,
            type: cc.Node
        },

        // 重置界面结点
        resetPanel: {
            default: null,
            type: cc.Node
        },

        // 资源管理脚本
        resManager: null,

        // 显示重置界面时所有按钮不处理点击事件
        isListening: true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        dataManager.instance.getDataFromMemory();

        this.resManager = cc.find('Canvas/resManager').getComponent('ResManager');

        // 给每个按钮添加点击事件
        this.addBtnEvents();

        // 根据当前选择的皮肤更新商店界面按钮的图片
        this.updateShopBtnImage();
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

    onBtnResetClicked () {
        this.bgColor.opacity = 100;
        this.isListening = false;
        this.resetPanel.scale = new cc.Vec2(1, 1);
        this.resetPanel.active = true;
    },

    onBtnNoClicked () {
        this.bgColor.opacity = 0;
        this.isListening = true;
        this.resetPanel.getComponent(cc.Animation).play('ResetPanelClip');
    },

    onBtnYesClicked () {
        this.bgColor.opacity = 0;
        this.isListening = true;
        this.resetPanel.getComponent(cc.Animation).play('ResetPanelClip');
        dataManager.instance.removeDataFromMemory();
        this.updateShopBtnImage();
    },

    addBtnEvents() {
        this.btnStart.on('touchend', function (event) {
            if (this.isListening) {
                cc.audioEngine.playEffect(this.resManager.buttonClip, false);
                this.toGameScene();
            }
        }, this);

        this.btnShop.on('touchend', function (event) {
            if (this.isListening) {
                cc.audioEngine.playEffect(this.resManager.buttonClip, false);
                this.toShopScene();
            }
        }, this);

        this.btnRank.on('touchend', function (event) {
            if (this.isListening) {
                cc.audioEngine.playEffect(this.resManager.buttonClip, false);
                this.toRankScene();
            }
        }, this);

        this.btnSound.on('touchend', function (event) {
            if (this.isListening) {
                cc.audioEngine.playEffect(this.resManager.buttonClip, false);
                this.switchSoundState();
            }
        }, this);

        this.btnReset.on('touchend', function () {
            cc.audioEngine.playEffect(this.resManager.buttonClip, false);
            this.onBtnResetClicked();
        }, this);

        this.btnNo.on('touchend', function () {
            cc.audioEngine.playEffect(this.resManager.buttonClip, false);
            this.onBtnNoClicked();
        }, this);

        this.btnYes.on('touchend', function () {
            cc.audioEngine.playEffect(this.resManager.buttonClip, false);
            this.onBtnYesClicked();
        }, this);
    },

    updateShopBtnImage () {
        this.btnShop.getChildByName('image').getComponent(cc.Sprite).spriteFrame
        = this.resManager.skinSpriteFrames[dataManager.instance.skinChosen];
    },

    start() {

    },

    update (dt) {

    },
});
