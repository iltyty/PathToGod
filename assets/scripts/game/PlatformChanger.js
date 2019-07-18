cc.Class({
    extends: cc.Component,

    properties: {
        sprites: {
            default: [],
            type: [cc.Sprite]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    // 修改组合平台中间的平台样式
    changeTheme (sprite) {
        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].spriteFrame = sprite.spriteFrame;
        }
    },

    start () {

    },

});
