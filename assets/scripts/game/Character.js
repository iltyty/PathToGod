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

        // GameScene脚本
        gameInstance: null,

        // 上一次碰撞的平台，用于分数增加时的判断
        lastHitPlatform: {
            default: null,
            type: cc.PhysicsBoxCollider
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.currentPos = this.initPos;

        this.node.parent.on('touchend', this.onMouseDown, this);

        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.rigidbody.enabledContactListener = true;

        this.gameInstance = this.node.parent.getComponent('GameScene');

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit
        ;
    },

    // 屏幕点击响应函数
    onMouseDown(event) {
        let pos = event.getLocation();

        if (this.gameInstance.gamePaused) {
            return;
        }

        if (new cc.Rect(this.gameInstance.btnPause.getBoundingBoxToWorld()).contains(pos) || 
            new cc.Rect(this.gameInstance.btnPlay.getBoundingBoxToWorld()).contains(pos)) {
            return;
        }

        if (pos.x <= cc.winSize.width / 2) {
            // 点击了左半边屏幕
            this.isHeadRight = false;
            this.node.scale = new cc.Vec2(-1, 1);
        } else {
            this.isHeadRight = true;
            this.node.scale = new cc.Vec2(1, 1);
        }

        if (!this.isJumping) {
            if (!this.gameInstance.moveBegan) {
                this.gameInstance.moveBegan = true;
            }
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
        if (otherCollider.node.group === 'Platform') {
            let platPos = otherCollider.node.getPosition();

            this.isJumping = false;

            this.nextPosLeft = new cc.Vec2(platPos.x - this.deltaX, platPos.y + this.deltaY);
            this.nextPosRight = new cc.Vec2(platPos.x + this.deltaX, platPos.y + this.deltaY);
        
            if (this.lastHitPlatform !== otherCollider){
                this.gameInstance.score++;
                this.gameInstance.scoreText.getComponent(cc.RichText).string = this.gameInstance.score.toString();
                this.lastHitPlatform = otherCollider;
            }
        } else if (otherCollider.node.group === 'Obstacle') {
            this.node.active = false;
        }
    },

    start () {

    },

    update (dt) {
        if (this.rigidbody.linearVelocity.y < -200) {
            // 人物正在下落，判断是否跳跃至平台
            if (!this.isFallingTowardsPlatform() && !this.gameInstance.gameOver) {
                // 没有落到平台
               this.node.zIndex = -1;
               this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
               this.gameInstance.gameOver = true;
            }
        }
    },

    isFallingTowardsPlatform () {
        // 判断此次跳跃有没有跳至平台上
        // 利用人物的刚体射线检测判断下方有没有平台
        let p = this.node.parent.convertToWorldSpaceAR(this.node.position);
        let p1 = new cc.Vec2(p.x + 15, p.y);
        let p2 = new cc.Vec2(p1.x, p1.y - 100);
        
        let rayCastResult = cc.director.getPhysicsManager().rayCast(p1, p2, cc.RayCastType.All);
        if (rayCastResult.length !== 0){
            if (rayCastResult[0].collider.node.group !== 'Platform') {
                // 没有跳至平台
                return false;
            } else {
                return true;
            }
        }
    },

    jump () {
        // 人物跳跃函数
        if (this.isHeadRight) {
            // 向右跳
            //this.node.runAction(cc.moveTo(0.05, this.nextPosRight.x, this.node.position.y));
            this.node.runAction(cc.moveBy(0.05, this.nextPosRight.x - this.node.position.x, 0))
            this.node.runAction(cc.moveBy(0.05, 0, this.nextPosRight.y - this.node.position.y + 85))
        } else {
            // 向左跳
            this.node.runAction(cc.moveTo(0.05, this.nextPosLeft.x, this.nextPosLeft.y + 85));
        }
    }
});
