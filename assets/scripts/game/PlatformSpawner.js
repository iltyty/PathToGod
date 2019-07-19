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

        // 要生成的平台预制资源
        platformPrefab: {
            default: null,
            type: cc.Prefab
        },

        // 所有平台的预制资源
        platformPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有common主题的组合平台的预制资源
        platformCommonPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有winter主题的组合平台的预制资源
        platformWinterPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有grass主题的组合平台的预制资源
        platformGrassPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有钉子平台的预制资源
        platformSpikePrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 组合平台的主题种类枚举
        PlatformGroupType: {
            default: {},
            type: cc.Enum,
        },

        // 生成平台对应的组合平台的主题
        groupType: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        cc.director.getPhysicsManager().enabled = true;

        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit;

        let collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;

        this.spawnPosition = this.initSpawnPos;
        this.PlatformGroupType = cc.Enum({
            Grass: 0,
            Winter: 1,
        });

        this.randomPlatformTheme();

        this.node.parent.on('decidepath', this.decidePath, this);

        for(let i = 0; i < 5; i++){
            this.spawnCount = 5;
            this.decidePath();
        }
    },

    // 每次进入游戏时随机化平台的主题
    randomPlatformTheme () {
        // 随机平台种类（共4种）
        let index = parseInt(Math.random() * 4);
        
        if (index == 1) {
            // 随机化结果为ice主题的平台
            this.groupType = this.PlatformGroupType.Winter;
        } else {
            // 随机化结果为其他三种主题的平台
            this.groupType = this.PlatformGroupType.Grass;
        }

        this.platformPrefab = this.platformPrefabs[index];
    },

    decidePath () {
        if(this.spawnCount > 0){
            this.spawnCount--;
            this.spawnPlatform();
        } else {
            this.isRightSpawn = !this.isRightSpawn;
            this.spawnCount = Math.random() * 4 + 1;  // 1 - 4
            this.spawnPlatform();
        }
    },

    spawnPlatform () {
        if (this.spawnCount > 0) {
            // 生成单个平台
            this.spawnSinglePlatform();
        } else {
            // 随机化生成哪种主题的组合平台(common, winter, grass)
            let random = parseInt(Math.random() * 3);
            switch (random) {
                case 0:
                    // 生成common主题的组合平台
                    this.spawnCommonPlatform();
                    break;
                case 1:
                    // 根据groupType生成对应主题的平台
                    switch (this.groupType) {
                        case this.PlatformGroupType.Winter:
                            // 生成winter主题的组合平台
                            this.spawnWinterPlatform();
                            break;
                        case this.PlatformGroupType.Grass:
                            // 生成grass主题的组合平台
                            this.spawnGrassPlatform();
                            break;
                        default:
                            break;
                    }
                    break;
                case 2:
                    // 生成钉子平台的主题
                    this.spawnSpikePlatform();
                    break;
                default:
                    break;
            }
        }

        this.spawnPosition = this.getNewPosition();
    },

    // 生成单个平台
    spawnSinglePlatform () {
        // 生成新平台
        let platform = cc.instantiate(this.platformPrefab);
        // 设置生成平台的位置
        platform.setPosition(this.spawnPosition);
        // 添加平台
        this.node.addChild(platform);
    },

    // 生成common主题的组合平台
    spawnCommonPlatform () {
        // 从4种common组合平台种随机一种
        let random = parseInt(Math.random() * this.platformCommonPrefabs.length);

        let platform = cc.instantiate(this.platformCommonPrefabs[random]);
        platform.setPosition(this.spawnPosition);
        platform.getComponent('PlatformChanger').change(cc.instantiate(this.platformPrefab).getComponent(cc.Sprite));
        
        this.node.addChild(platform);
    },

    // 生成winter主题的组合平台
    spawnWinterPlatform () {
        let random = parseInt(Math.random() * this.platformWinterPrefabs.length);

        let platform = cc.instantiate(this.platformWinterPrefabs[random]);
        platform.setPosition(this.spawnPosition);
        platform.getComponent('PlatformChanger').change(cc.instantiate(this.platformPrefab).getComponent(cc.Sprite));
        
        this.node.addChild(platform);
    },

    // 生成grass主题的组合平台
    spawnGrassPlatform () {
        let random = parseInt(Math.random() * this.platformGrassPrefabs.length);

        let platform = cc.instantiate(this.platformGrassPrefabs[random]);
        platform.setPosition(this.spawnPosition);
        platform.getComponent('PlatformChanger').change(cc.instantiate(this.platformPrefab).getComponent(cc.Sprite));
        
        this.node.addChild(platform);
    },

    // 生成钉子平台
    spawnSpikePlatform () {
        let platform;
        if (this.isRightSpawn) {
            // 当前向右生成，选择左边的钉子平台
            platform =  cc.instantiate(this.platformSpikePrefabs[0]);
        } else {
            // 当前向左生成，选择右边的钉子平台
            platform = cc.instantiate(this.platformSpikePrefabs[1]);
        }

        platform.setPosition(this.spawnPosition);
        platform.getComponent('PlatformChanger').change(cc.instantiate(this.platformPrefab).getComponent(cc.Sprite));
        
        this.node.addChild(platform);
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
