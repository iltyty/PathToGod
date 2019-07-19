cc.Class({
    /*
     *  管理实例化平台的对象池
     *  含有单平台以及各种组合平台的list
     *  每次生成新平台时从此对象池中取出一个平台实例
     *  若此对象池中无相应实例，则添加新的平台到对象池中
     */

    extends: cc.Component,

    properties: {
        // 资源管理器
        resManager: null,

        // 游戏开始时每个list含有的平台个数
        initSpawnCount: 5,

        // 单个平台的list
        singlePlatformList: [],

        // common主题组合平台的list
        commonPlatformList: [],

        // winter主题组合平台的list
        winterPlatformList: [],

        // grass主题组合平台的list
        grassPlatformList: [],

        // spikeLeft主题组合平台的list
        spikePlatformLeftList: [],

        // spikeRight主题组合平台的list
        spikePlatformRightList: [],
    },

    onLoad () {
        this.resManager = this.node.parent.getChildByName('resManager').getComponent('ResManager');
        this.initList();
    },

    // 初始化所有列表，对每个列表都添加5个对应类型的平台
    initList () {
        
        for (let i = 0; i < this.initSpawnCount; i++) {
            // 单个普通平台列表
            this.addPlatform(this.resManager.singlePlatformPrefab, this.singlePlatformList);

            // 左钉子平台列表
            this.addPlatform(this.resManager.spikePlatformPrefabs[0], this.spikePlatformLeftList);
            
            // 右钉子平台列表
            this.addPlatform(this.resManager.spikePlatformPrefabs[1], this.spikePlatformRightList);

            // common主题组合平台列表
            let random = parseInt(Math.random() * this.resManager.commonPlatformPrefabs.length);
            this.addPlatform(this.resManager.commonPlatformPrefabs[random], this.commonPlatformList);

            // winter主题组合平台列表
            let random1 = parseInt(Math.random() * this.resManager.winterPlatformPrefabs.length);
            this.addPlatform(this.resManager.winterPlatformPrefabs[random1], this.winterPlatformList);

            // grass主题组合平台列表
            let random2 = parseInt(Math.random() * this.resManager.grassPlatformPrefabs.length);
            this.addPlatform(this.resManager.grassPlatformPrefabs[random2], this.grassPlatformList);
        }
    },

    // 给指定的list添加对应的实例化平台
    addPlatform (prefab, list) {
        let platform = cc.instantiate(prefab);
        platform.active = false;
        list.push(platform);

        return platform;
    },

    // 获取一个单个平台
    getSinglePlatform () {
        for (let i = 0; i < this.singlePlatformList.length; i++) {
            if (!this.singlePlatformList[i].active) {
                // 当前结点未被添加至场景中
                return this.singlePlatformList[i];
            }
        }

        // 当前平台池中所有单个平台均已被添加至场景中
        // 添加新的单个平台至平台池后返回
        return this.addPlatform(this.resManager.singlePlatformPrefab, this.singlePlatformList);
    },

    // 获取一个左钉子平台
    getLeftSpikePlatform () {
        for (let i = 0; i < this.spikePlatformLeftList.length; i++) {
            if (!this.spikePlatformLeftList[i].active) {
                // 当前结点未被添加至场景中
                return this.spikePlatformLeftList[i];
            }
        }

        return this.addPlatform(this.resManager.spikePlatformPrefabs[0], this.spikePlatformLeftList);
    },

    // 获取一个右钉子平台
    getRightSpikePlatform () {
        for (let i = 0; i < this.spikePlatformRightList.length; i++) {
            if (!this.spikePlatformRightList[i].active) {
                // 当前结点未被添加至场景中
                return this.spikePlatformRightList[i];
            }
        }

        return this.addPlatform(this.resManager.spikePlatformPrefabs[1], this.spikePlatformRightList);
    },

    // 获取一个随机的common主题平台
    getCommonPlatform () {
        for (let i = 0; i < this.commonPlatformList.length; i++) {
            if (!this.commonPlatformList[i].active) {
                // 当前结点未被添加至场景中
                return this.commonPlatformList[i];
            }
        }

        let random = parseInt(Math.random() * this.resManager.commonPlatformPrefabs.length);
        return this.addPlatform(this.resManager.commonPlatformPrefabs[random], this.commonPlatformList);
    },

    // 获取一个随机的winter主题平台
    getWinterPlatform () {
        for (let i = 0; i < this.winterPlatformList.length; i++) {
            if (!this.winterPlatformList[i].active) {
                // 当前结点未被添加至场景中
                return this.winterPlatformList[i];
            }
        }

        let random = parseInt(Math.random() * this.resManager.winterPlatformPrefabs.length);
        return this.addPlatform(this.resManager.winterPlatformPrefabs[random], this.winterPlatformList);
    },
    
    // 获取一个随机的grass主题平台
    getGrassPlatform () {
        for (let i = 0; i < this.grassPlatformList.length; i++) {
            if (!this.grassPlatformList[i].active) {
                // 当前结点未被添加至场景中
                return this.grassPlatformList[i];
            }
        }

        let random = parseInt(Math.random() * this.resManager.grassPlatformPrefabs.length);
        return this.addPlatform(this.resManager.grassPlatformPrefabs[random], this.grassPlatformList);
    },

    start () {

    },

    // update (dt) {},
});
