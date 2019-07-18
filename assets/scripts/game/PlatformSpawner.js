cc.Class({
    extends: cc.Component,

    properties: {
        // 第一个平台生成的位置
        initSpawnPos: {
            default: new cc.Vec2(),
        },

        // 与下一个平台的x坐标差绝对值
        deltaX: 69,

        // 与下一个平台的y坐标差绝对值
        deltaY: 80,

        // 一次性生成平台的数量
        spawnCount: 5,

        // 下一个生成的平台是否朝向右
        isRightSpawn: false,  
        
        // 下一个平台生成的位置
        spawnPosition: {
            default: new cc.Vec2(),
        },

        // 普通平台预制资源
        normalPrefab: {
            default: null,
            type: cc.Prefab
        },

        // 火焰平台预制资源
        firePrefab: {
            default: null,
            type: cc.Prefab
        },

        // 草地平台预制资源
        grassPrefab: {
            default: null,
            type: cc.Prefab
        },

        // 冰原平台预制资源
        icePrefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍1平台预制资源
        obstacle1Prefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍2平台预制资源
        obstacle2Prefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍3平台预制资源
        obstacle3Prefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍4平台预制资源
        obstacle4Prefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍5平台预制资源
        obstacle5Prefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍6平台预制资源
        obstacle6Prefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍7平台预制资源
        obstacle7Prefab: {
            default: null,
            type: cc.Prefab
        },

        // 障碍8平台预制资源
        obstacle8Prefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        cc.director.getPhysicsManager().enabled = true;

        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit;

        let collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;

        this.spawnPosition = this.initSpawnPos;

        this.node.parent.on('decidepath', this.decidePath, this);

        for(let i = 0; i < 5; i++){
            this.spawnCount = 5;
            this.decidePath();
        }
    },

    decidePath() {
        if(this.spawnCount > 0){
            this.spawnCount--;
            this.spawnPlatform();
        } else {
            this.isRightSpawn = !this.isRightSpawn;
            this.spawnCount = Math.random() * 4 + 1;  // 1 - 4
            this.spawnPlatform();
        }
    },

    spawnPlatform() {
        // 生成新平台
        let platform = cc.instantiate(this.normalPrefab);
        // 设置生成平台的位置
        platform.setPosition(this.spawnPosition);
        // 设置平台的分组为Platform，以便与分组为Character的人物进行碰撞
        // platform.group = 'Platform';
        // // 给平台添加刚体组件
        // platform.addComponent(cc.RigidBody);
        // // 给平台添加物理碰撞组件
        // platform.addComponent(cc.PhysicsBoxCollider);
        // // 设置平台的刚体类型为static，使其不受重力影响
        // platform.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        // // 开启平台的刚体碰撞监听
        // platform.getComponent(cc.RigidBody).enabledContactListener = true;
        // // 设置平台碰撞盒大小
        // platform.getComponent(cc.PhysicsBoxCollider).size = new cc.Size(30, 6);
        // // 设置平台碰撞盒的偏移量
        // platform.getComponent(cc.PhysicsBoxCollider).offset = new cc.Vec2(10, 0);
        this.node.addChild(platform);

        this.spawnPosition = this.getNewPosition();
    },

    getNewPosition() {
        // 获取新平台的位置
        let newX = this.spawnPosition.x;
        let newY = this.spawnPosition.y;

        if(this.isRightSpawn){
            // 下一个向右生成
            newX += this.deltaX;
            newY += this.deltaY;
        } else {
            // 下一个向左生成
            newX -= this.deltaX;
            newY += this.deltaY;
        }

        return new cc.Vec2(newX, newY);
    },

    start () {

    },

    update (dt) {},
});
