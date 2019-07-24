var dataManager = require('DataManager');

cc.Class({
    extends: cc.Component,

    properties: {
        btnBack: {
            default: null,
            type: cc.Node
        },

        goldText: {
            default: null,
            type: cc.Node
        },

        silverText: {
            default: null,
            type: cc.Node
        },

        copperText: {
            default: null,
            type: cc.Node
        },

        resManager: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        dataManager.instance.getDataFromMemory();

        this.resManager = cc.find('Canvas/resManager').getComponent('ResManager');

        this.addBtnEvents();
        this.setUI();
    },

    addBtnEvents () {
        this.btnBack.on('touchend', function () {
            this.resManager.playEffect(this.resManager.buttonClip);
            cc.director.loadScene('StartScene');
        }, this);
    },

    setUI () {

    },

    start () {
        this.goldText.getComponent(cc.RichText).string = dataManager.instance.bestScores[0].toString();
        this.silverText.getComponent(cc.RichText).string = dataManager.instance.bestScores[1].toString();
        this.copperText.getComponent(cc.RichText).string = dataManager.instance.bestScores[2].toString();
    },

    // update (dt) {},
});
