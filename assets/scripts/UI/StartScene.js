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

        // 根据声音是否开启更新音效按钮的图片
        this.updateBtnSoundImage();
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
        dataManager.instance.isMusicOn = !dataManager.instance.isMusicOn;
        dataManager.instance.saveDataToMemory();
        console.log('music:', dataManager.instance.isMusicOn)
        
        this.updateBtnSoundImage();
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
        this.scheduleOnce(function () {
            this.resetPanel.active = false;
        }, 1);
    },

    onBtnYesClicked () {
        this.bgColor.opacity = 0;
        this.isListening = true;
        this.resetPanel.getComponent(cc.Animation).play('ResetPanelClip');
        this.scheduleOnce(function () {
            this.resetPanel.active = false;
        }, 1);

        dataManager.instance.removeDataFromMemory();
        dataManager.instance.getDataFromMemory();
        this.updateShopBtnImage();
    },

    addBtnEvents() {
        this.btnStart.on('touchend', function (event) {
            if (this.isListening) {
                this.resManager.playEffect(this.resManager.buttonClip);
                this.toGameScene();
            }
        }, this);

        this.btnShop.on('touchend', function (event) {
            if (this.isListening) {
                this.resManager.playEffect(this.resManager.buttonClip);
                this.toShopScene();
            }
        }, this);

        this.btnRank.on('touchend', function (event) {
            if (this.isListening) {
                this.resManager.playEffect(this.resManager.buttonClip);
                this.toRankScene();
            }
        }, this);

        this.btnSound.on('touchend', function (event) {
            if (this.isListening) {
                this.resManager.playEffect(this.resManager.buttonClip);
                this.switchSoundState();
            }
        }, this);

        this.btnReset.on('touchend', function () {
            if (this.isListening) {
                this.resManager.playEffect(this.resManager.buttonClip);
                this.onBtnResetClicked();
            }
        }, this);

        this.btnNo.on('touchend', function () {
            this.resManager.playEffect(this.resManager.buttonClip);
            this.onBtnNoClicked();
        }, this);

        this.btnYes.on('touchend', function () {
            this.resManager.playEffect(this.resManager.buttonClip);
            this.onBtnYesClicked();
        }, this);
    },

    updateShopBtnImage () {
        this.btnShop.getChildByName('image').getComponent(cc.Sprite).spriteFrame
        = this.resManager.skinSpriteFrames[dataManager.instance.skinChosen];
    },

    updateBtnSoundImage () {
        let btnSoundImageNode = this.btnSound.children[0];

        if (dataManager.instance.isMusicOn) {
            btnSoundImageNode.scale = new cc.Vec2(1, 1);
            btnSoundImageNode.getComponent(cc.Sprite).spriteFrame = this.resManager.btnSoundSpriteFrames[0];
        } else {
            btnSoundImageNode.scale = new cc.Vec2(0.75, 1);
            btnSoundImageNode.getComponent(cc.Sprite).spriteFrame = this.resManager.btnSoundSpriteFrames[1];
        }
    },

    start() {

    },

    update (dt) {

    },
});
