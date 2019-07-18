cc.Class({
    extends: cc.Component,

    properties: {
        // 初始人物位置
        initPos: {
            default: new cc.Vec2(),
        },

        // 向左跳跃的下一个位置
        nextPosLeft: {
            default: new cc.Vec2(),
        },

        // 向右跳跃的下一个位置
        nextPosRight: {
            default: new cc.Vec2(),
        },

        // 每次跳动之后变化的x坐标的绝对值
        deltaX: 0,

        // 每次跳动之后变化的y坐标的绝对值
        deltaY: 0,

        // 当前人物是否朝向右
        isHeadRight: false,

        // 当前人物是否正在跳跃
        isJumping: false,

        // 当前结点挂载的刚体
        rigidbody: {
            default: null,
            type: cc.RigidBody
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.currentPos = this.initPos;

        this.node.parent.on('touchend', this.onMouseDown, this);

        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.rigidbody.enabledContactListener = true;

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        let collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
    },

    // 屏幕点击响应函数
    onMouseDown(event) {
        let pos = event.getLocation();

        if (pos.x <= cc.winSize.width / 2) {
            // 点击了左半边屏幕
            this.isHeadRight = false;
            this.node.scale = new cc.Vec2(-1, 1);
        } else {
            this.isHeadRight = true;
            this.node.scale = new cc.Vec2(1, 1);
        }

        if (!this.isJumping) {
            this.isJumping = true;
            this.jump();
        }

        this.node.dispatchEvent( new cc.Event.EventCustom('decidepath', true) );
    },

    // 得到人物的下一个坐标
    getNewPosition (platform) {
        if (this.isHeadRight) {
            // 下一次向右跳跃
            return new cc.Vec2(platform.getPosition().x + this.deltaX, platform.getPosition().y + this.deltaY);
        } else {
            // 下一次向左跳跃
            return new cc.Vec2(platform.getPosition().x - this.deltaX, platform.getPosition().y + this.deltaY);
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.isJumping = false;
        let platPos = otherCollider.node.getPosition();
        this.nextPosLeft = new cc.Vec2(platPos.x - this.deltaX, platPos.y + this.deltaY);
        this.nextPosRight = new cc.Vec2(platPos.x + this.deltaX, platPos.y + this.deltaY);
        this.rigidbody.linearVelocity = new cc.Vec2();
    },

    start () {

    },

    update (dt) {

    },

    jump () {
        // 人物跳跃函数
        if (this.isHeadRight) {
            // 向右跳
            this.node.runAction(cc.moveTo(0.05, this.nextPosRight.x, this.nextPosRight.y + 85));
            this.rigidbody.linearVelocity = new cc.Vec2(0, -300)
        } else {
            // 向左跳
            this.node.runAction(cc.moveTo(0.05, this.nextPosLeft.x, this.nextPosLeft.y + 85));
            this.rigidbody.linearVelocity = new cc.Vec2(0, -300)
        }
    }
});
