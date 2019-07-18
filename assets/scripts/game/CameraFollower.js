cc.Class({
    extends: cc.Component,

    properties: {
        // 摄像头要跟随的对象，即玩家控制的人物
        target: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
    },

    start () {

    },

    lateUpdate: function (dt) {
        if (this.node.position.y < this.target.position.y) {
            let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        }
        
        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },
});
