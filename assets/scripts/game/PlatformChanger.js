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

    // 修改组合平台中间的平台样式，随机障碍物左右的位置
    change (sprite) {
        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].spriteFrame = sprite.spriteFrame;
        }

        let random = parseInt(Math.random() * 2);
        if (random == 0) {
            // 修改障碍物位置为平台的右边（默认预制资源均为左边）
            this.node.scale = new cc.Vec2(-1, 1);
        }
    },

    start () {

    },

});
