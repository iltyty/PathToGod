cc.Class({
    extends: cc.Component,

    properties: {
        sprites: {
            default: [],
            type: [cc.Sprite]
        },

        // 平台距离掉落剩余的时间
        timeLeft: 0,

        // 当前平台是否开始计时准备掉落
        timerBegan: false,

        // 游戏实例
        gameInstance: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    },

    // 修改组合平台中间的平台样式，随机障碍物左右的位置，设置平台掉落时间
    init (spriteFrame, fallTime) {
        this.timeLeft = fallTime;
        this.timerBegan = true;
        this.gameInstance = cc.find('Canvas/gameLogicManager').getComponent('GameLogicManager');

        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].spriteFrame = spriteFrame;
        }

        if (this.node.name !== 'SpikeGroupLeft' && this.node.name !== 'SpikeGroupRight') {
            // 钉子平台不进行左右随机
            let random = parseInt(Math.random() * 2);
            if (random == 0) {
                // 修改障碍物位置为平台的右边（默认预制资源均为左边）
                this.node.scale = new cc.Vec2(-1, 1);
            }
        }
    },

    start () {

    },

    update (dt) {
        if (this.timerBegan && this.gameInstance.moveBegan) {
            this.timeLeft -= dt;
            
            if (this.timeLeft < 0) {
                // 掉落
                this.timerBegan = false;

                let rigidBody = this.node.getComponent(cc.RigidBody);

                if (!rigidBody.awake) {
                    rigidBody.awake = true;
                }

                if (rigidBody.type === cc.RigidBodyType.Static) {
                    rigidBody.type = cc.RigidBodyType.Dynamic;
                }

                for (let child of this.node.children) {
                    let rigid = child.getComponent(cc.RigidBody);
                    if (!rigid.awake) {
                        rigid.awake = true;
                    }
    
                    if (rigid.type === cc.RigidBodyType.Static) {
                        rigid.type = cc.RigidBodyType.Dynamic;
                    }
                }

                this.scheduleOnce(function () {
                    this.node.destroy();
                }, 1);
            }
        }
    },

});
