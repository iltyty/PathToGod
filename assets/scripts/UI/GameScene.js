cc.Class({
    extends: cc.Component,

    properties: {
       bg: {
           default: null,
           type: cc.Sprite
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this.loadRandomBg();
    },

    loadRandomBg() {
        // 加载一张随机的背景图片
        let index = parseInt(Math.random() * 4 + 1, 10);
        let bgUrl = 'resources/texture/bg' + index + '.png';

        cc.loader.loadRes(bgUrl, cc.SpriteFrame, function(err,spriteFrame) {
            let node = new cc.Node("New Sprite");
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame= spriteFrame;
            node.parent= this.bg;
        });
    },

    start() {

    },

    update (dt) {},
});
