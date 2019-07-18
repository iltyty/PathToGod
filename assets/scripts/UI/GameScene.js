cc.Class({
    extends: cc.Component,

    properties: {
        bgs: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.loadRandomBg();
    },

    loadRandomBg() {
        // 加载一张随机的背景图片
        let index = parseInt(Math.random() * 4);
        
        this.node.getChildByName('background').getComponent(cc.Sprite).spriteFrame = this.bgs[index];
    },

    start() {

    },

    update (dt) {},
});
