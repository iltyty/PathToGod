cc.Class({
    extends: cc.Component,

    properties: {
        // 第一个平台生成的位置
        initSpawnPos: {
            default: new cc.Vec2()
        },

        // 与下一个平台的x坐标差绝对值
        deltaX: 69,

        // 与下一个平台的y坐标差绝对值
        deltaY: 80,

        // 一次性生成平台的数量
        spawnCount: 5,

        // 钉子平台方向要生成的平台数量
        spikeSpawnCount: 3,

        // 下一个生成的平台是否朝向右
        isRightSpawn: false,  
        
        // 下一个平台生成的位置
        spawnPosition: {
            default: new cc.Vec2()
        },

        // 钉子平台方向的下一个平台生成位置
        spikeSpawnPos: {
            default: new cc.Vec2()
        },

        // 随机选择的单个平台的sprite frame
        selectedSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },

        // 组合平台的主题种类枚举
        PlatformGroupType: {
            default: {},
            type: cc.Enum,
        },

        // 生成平台对应的组合平台的主题
        groupType: 0,

        // 资源管理器
        resManager: null,

        // 平台对象池
        platformPool: null,

        // GameLogicManager脚本
        gameInstance: null,

        // 每个平台被添加之后的默认掉落时间
        fallTime: 3,

        // 平台最小的掉落时间
        minFallTime: 0.5,

        // 里程碑分数，每次玩家超过这个分数后平台掉落时间都会减少一个系数
        milestoneScore: 10,

        // 掉落时间的衰减系数
        dampingFactor: 0.9,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        
        cc.director.getCollisionManager().enabled = true;

        this.spawnPosition = this.initSpawnPos;
        this.PlatformGroupType = cc.Enum({
            Grass: 0,
            Winter: 1,
        });
        this.resManager = this.node.parent.getChildByName('resManager').getComponent('ResManager');
        this.platformPool = this.node.parent.getChildByName('platformPool').getComponent('PlatformPool');
        this.gameInstance = cc.find('Canvas/gameLogicManager').getComponent('GameLogicManager');

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

        this.selectedSpriteFrame = this.resManager.singlePlatformSpriteFrame[index];
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
            this.spawnSinglePlatform(this.spawnPosition, this.platformPool.getSinglePlatform(), true);
        } else {
            // 随机化生成不同主题的组合平台(common, winter, grass)
            let random = parseInt(Math.random() * 3);
            this.spawnRandomPlatformGroup(this.spawnPosition, random);
        }

        this.spawnPosition = this.getNewPosition(this.spawnPosition, false);
    },

    // 生成单个平台
    spawnSinglePlatform (pos, platform, isMainPath) {
        // 显示平台
        platform.active = true;
        // 设置生成平台的位置
        platform.setPosition(pos);
        // 添加平台
        this.node.addChild(platform);
        // 更改平台样式
        platform.getComponent('PlatformManager').init(this.selectedSpriteFrame, this.fallTime);

        let random = parseInt(Math.random() * 10);
        if (random === 5 && this.gameInstance.moveBegan && isMainPath) {
            // 1/10的概率生成钻石
            let diamond = this.platformPool.getDiamond();
            diamond.active = true;
            diamond.setPosition(new cc.Vec2(pos.x, pos.y + 80));
            this.node.addChild(diamond);
            diamond.zIndex = 3;
        }
    },

    // 决定生成哪种主题的组合平台
    spawnRandomPlatformGroup (pos, random) {
        switch (random) {
            case 0:
                // 生成common主题的组合平台
                this.spawnCommonPlatform(pos);
                break;
            case 1:
                // 根据groupType生成对应主题的平台
                switch (this.groupType) {
                    case this.PlatformGroupType.Winter:
                        // 生成winter主题的组合平台
                        this.spawnWinterPlatform(pos);
                        break;
                    case this.PlatformGroupType.Grass:
                        // 生成grass主题的组合平台
                        this.spawnGrassPlatform(pos);
                        break;
                    default:
                        break;
                }
                break;
            case 2:
                // 生成钉子平台的主题
                this.spawnSpikePlatform(pos);
                break;
            default:
                break;
        }
    },

    // 生成common主题的组合平台
    spawnCommonPlatform (pos) {
        let platform = this.platformPool.getCommonPlatform();
        platform.zIndex = 2;

        this.spawnSinglePlatform(pos, platform, true);
    },

    // 生成winter主题的组合平台
    spawnWinterPlatform (pos) {
        let platform = this.platformPool.getWinterPlatform();
        platform.zIndex = 2;

        this.spawnSinglePlatform(pos, platform, true);
    },

    // 生成grass主题的组合平台
    spawnGrassPlatform (pos) {
        let platform = this.platformPool.getWinterPlatform();
        platform.zIndex = 2;

        this.spawnSinglePlatform(pos, platform, true);
    },

    // 生成钉子平台
    spawnSpikePlatform (pos) {
        let platform = null;
        if (this.isRightSpawn) {
            // 当前向右生成，选择左边的钉子平台
            platform = this.platformPool.getLeftSpikePlatform();
        } else {
            // 当前向左生成，选择右边的钉子平台
            platform = this.platformPool.getRightSpikePlatform();
        }
        platform.zIndex = 2;

        this.spawnSinglePlatform(pos, platform, true)

        if (this.isRightSpawn) {
            this.spikeSpawnPos = new cc.Vec2(this.spawnPosition.x - 3 * this.deltaX, this.spawnPosition.y + this.deltaY);
        } else {
            this.spikeSpawnPos = new cc.Vec2(this.spawnPosition.x + 3 * this.deltaX, this.spawnPosition.y + this.deltaY);
        }

        this.spawnSpikeDirPlatforms();
    },

    // 在钉子平台方向生成平台
    spawnSpikeDirPlatforms () {
        for (let i = 0; i < this.spikeSpawnCount; i++) {
            this.spawnSinglePlatform(this.spikeSpawnPos, this.platformPool.getSinglePlatform(), false);
            this.spikeSpawnPos = this.getNewPosition(this.spikeSpawnPos, true);
        }
    },

    // 获取下一个将要生成的平台的位置，第二个参数表示是否为钉子方向的生成
    getNewPosition(pos, isSpikeSpawn) {
        if (this.isRightSpawn) {
            // 当前正在向右生成平台
            if (isSpikeSpawn) {
                // 钉子方向向右生成
                return new cc.Vec2(pos.x - this.deltaX, pos.y + this.deltaY);
            } else {
                // 主路径向右生成
                return new cc.Vec2(pos.x + this.deltaX, pos.y + this.deltaY);
            }
        } else {
            // 正在向左生成
            if (isSpikeSpawn) {
                return new cc.Vec2(pos.x + this.deltaX, pos.y + this.deltaY);
            } else {
                return new cc.Vec2(pos.x - this.deltaX, pos.y + this.deltaY);
            }
        }
    },

    start () {

    },

    update (dt) {
        // 更新平台掉落时间
        if (this.gameInstance.score > this.milestoneScore) {
            this.updateFallTime();
        }
    },

    updateFallTime () {
        // 玩家分数超过了里程碑分数，更新掉落时间时间
        this.milestoneScore *= 2;
        this.fallTime *= this.dampingFactor;

        if (this.fallTime < this.minFallTime) {
            this.fallTime = this.minFallTime;
        }
    }
});
