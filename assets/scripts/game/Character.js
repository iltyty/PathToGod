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
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.currentPos = this.initPos;

        this.node.parent.on('touchend', this.onMouseDown, this);

        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.rigidbody.enabledContactListener = true;
        this.rigidbody.allowSleep = false;

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
            this.node.dispatchEvent(new cc.Event.EventCustom('decidepath', true));
            this.isJumping = true;
            this.jump();
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.node.group !== 'Character') {
            return;
        }      
        if (otherCollider.node.group === 'Platform') {
            // 落至平台
            let platPos = otherCollider.node.position;

            if (otherCollider.node.name === 'platform') {
                // 与组合平台相碰
                platPos = otherCollider.node.parent.position;
            }

            this.isJumping = false;

            this.nextPosLeft = new cc.Vec2(platPos.x - this.deltaX, platPos.y + this.deltaY);
            this.nextPosRight = new cc.Vec2(platPos.x + this.deltaX, platPos.y + this.deltaY);
        
            if (this.lastHitPlatform !== otherCollider.node){
                this.gameInstance.score++;
                this.gameInstance.scoreText.getComponent(cc.RichText).string = this.gameInstance.score.toString();
                this.lastHitPlatform = otherCollider.node;
            }
        } else if (otherCollider.node.group === 'Obstacle') {
            // 碰到障碍物，游戏结束
            this.node.active = false;
            this.gameInstance.gameOver = true;
            this.setGlobalValue();
            this.scheduleOnce(function () {
                cc.director.loadScene('GameOverScene');
            }, 1);
        } else if (otherCollider.node.group === 'PickUp') {
            // 吃到钻石
            otherCollider.node.active = false;
            this.gameInstance.diamondCount++;
            this.gameInstance.diamondText.getComponent(cc.RichText).string = this.gameInstance.diamondCount.toString();
        }
    },

    start () {

    },

    update (dt) {
        if (this.rigidbody.linearVelocity.y < -200) {
            // 人物正在下落，判断是否跳跃至平台
            if (!this.isFallingTowardsPlatform() && !this.gameInstance.gameOver) {
                // 没有落到平台，游戏结束
                this.node.zIndex = -1;
                this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
                this.gameInstance.gameOver = true;
                this.setGlobalValue();
                this.scheduleOnce(function () {
                    cc.director.loadScene('GameOverScene');
                }, 1); 
            }
        }

        if (this.node.parent.getChildByName('camera').position.y - this.node.position.y > 200) {
            this.gameInstance.gameOver = true;
            this.setGlobalValue();
            this.scheduleOnce(function () {
                cc.director.loadScene('GameOverScene');
            }, 1);
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
            this.node.runAction(cc.moveBy(0.05, this.nextPosRight.x - this.node.position.x, 0))
            this.node.runAction(cc.moveBy(0.05, 0, this.nextPosRight.y - this.node.position.y + 85))
        } else {
            // 向左跳
            this.node.runAction(cc.moveBy(0.05, this.nextPosLeft.x - this.node.position.x, 0));
            this.node.runAction(cc.moveBy(0.05, 0, this.nextPosLeft.y - this.node.position.y + 85));
        }
    },

    setGlobalValue () {
        // 进入游戏结束场景之前设置全局变量scoreCount和diamondCount的值
        scoreNumber = this.gameInstance.score;
        diamondNumber = this.gameInstance.diamondCount;
    }
});
