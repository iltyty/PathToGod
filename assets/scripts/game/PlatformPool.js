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

        // 钻石的list
        diamondList: [],
    },

    onLoad () {
        this.resManager = this.node.parent.getChildByName('resManager').getComponent('ResManager');
        this.initList();
    },

    // 初始化所有列表，对每个列表都添加5个对应类型的平台
    initList () {
        
        for (let i = 0; i < this.initSpawnCount; i++) {
            // 单个普通平台列表
            this.addList(this.resManager.singlePlatformPrefab, this.singlePlatformList);

            // 左钉子平台列表
            this.addList(this.resManager.spikePlatformPrefabs[0], this.spikePlatformLeftList);
            
            // 右钉子平台列表
            this.addList(this.resManager.spikePlatformPrefabs[1], this.spikePlatformRightList);

            // 钻石列表
            this.addList(this.resManager.diamondPrefab, this.diamondList);

            // common主题组合平台列表
            let random = parseInt(Math.random() * this.resManager.commonPlatformPrefabs.length);
            this.addList(this.resManager.commonPlatformPrefabs[random], this.commonPlatformList);

            // winter主题组合平台列表
            let random1 = parseInt(Math.random() * this.resManager.winterPlatformPrefabs.length);
            this.addList(this.resManager.winterPlatformPrefabs[random1], this.winterPlatformList);

            // grass主题组合平台列表
            let random2 = parseInt(Math.random() * this.resManager.grassPlatformPrefabs.length);
            this.addList(this.resManager.grassPlatformPrefabs[random2], this.grassPlatformList);
        }
    },

    // 给指定的list添加对应的实例化平台
    addList (prefab, list) {
        let object = cc.instantiate(prefab);
        object.active = false;
        list.push(object);

        return object;
    },

    // 获取一个单个平台
    getSinglePlatform () {
        for (let i = 0; i < this.singlePlatformList.length; i++) {
            if (!this.singlePlatformList[i].activeInHierarchy) {
                // 当前结点未被添加至场景中
                let platform = this.singlePlatformList.shift();
                return platform;
            }
        }

        // 当前平台池中所有单个平台均已被添加至场景中
        // 添加新的单个平台至平台池后返回
        for (let i = 0; i < this.initSpawnCount; i++) {
            this.addList(this.resManager.singlePlatformPrefab, this.singlePlatformList);
        }

        let platform = this.singlePlatformList.shift();
        return platform;
    },

    // 获取一个左钉子平台
    getLeftSpikePlatform () {
        for (let i = 0; i < this.spikePlatformLeftList.length; i++) {
            if (!this.spikePlatformLeftList[i].activeInHierarchy) {
                let platform = this.spikePlatformLeftList.shift();
                return platform;
            }
        }

        for (let i = 0; i < this.initSpawnCount; i++) {
            this.addList(this.resManager.spikePlatformPrefabs[0], this.spikePlatformLeftList);
        }
        
        let platform = this.spikePlatformLeftList.shift();
        return platform;
    },

    // 获取一个右钉子平台
    getRightSpikePlatform () {
        for (let i = 0; i < this.spikePlatformRightList.length; i++) {
            if (!this.spikePlatformRightList[i].activeInHierarchy) {
                let platform = this.spikePlatformRightList.shift();
                return platform;
            }
        }

        for (let i = 0; i < this.initSpawnCount; i++) {
            this.addList(this.resManager.spikePlatformPrefabs[1], this.spikePlatformRightList);
        }
        
        let platform = this.spikePlatformRightList.shift();
        return platform;
    },

    // 获取一个钻石
    getDiamond () {
        for (let i = 0; i < this.diamondList.length; i++) {
            if (!this.diamondList[i].activeInHierarchy) {
                let diamond = this.diamondList.shift();
                return diamond;
            }
        }

        for (let i = 0; i < this.initSpawnCount; i++) {
            this.addList(this.resManager.diamondPrefab, this.diamondList);
        }
        
        let diamond = this.diamondList.shift();
        return diamond;
    },

    // 获取一个随机的common主题平台
    getCommonPlatform () {
        for (let i = 0; i < this.commonPlatformList.length; i++) {
            if (!this.commonPlatformList[i].activeInHierarchy) {
                let platform = this.commonPlatformList.shift();
                return platform;
            }
        }

        let random = parseInt(Math.random() * this.resManager.grassPlatformPrefabs.length);
        for (let i = 0; i < this.initSpawnCount; i++) {
            this.addList(this.resManager.commonPlatformPrefabs[random], this.commonPlatformList);
        }
        
        let platform = this.commonPlatformList.shift();
        return platform;
    },

    // 获取一个随机的winter主题平台
    getWinterPlatform () {
        for (let i = 0; i < this.winterPlatformList.length; i++) {
            if (!this.winterPlatformList[i].activeInHierarchy) {
                let platform = this.winterPlatformList.shift();
                return platform;
            }
        }

        let random = parseInt(Math.random() * this.resManager.grassPlatformPrefabs.length);
        for (let i = 0; i < this.initSpawnCount; i++) {
            this.addList(this.resManager.winterPlatformPrefabs[random], this.winterPlatformList);
        }
        
        let platform = this.winterPlatformList.shift();
        return platform;
    },
    
    // 获取一个随机的grass主题平台
    getGrassPlatform () {
        for (let i = 0; i < this.grassPlatformList.length; i++) {
            if (!this.grassPlatformList[i].activeInHierarchy) {
                let platform = this.grassPlatformList.shift();
                return platform;
            }
        }

        let random = parseInt(Math.random() * this.resManager.grassPlatformPrefabs.length);
        for (let i = 0; i < this.initSpawnCount; i++) {
            this.addList(this.resManager.grassPlatformPrefabs[random], this.grassPlatformList);
        }
        
        let platform = this.grassPlatformList.shift();
        return platform;
    },

    start () {

    },

    // update (dt) {},
});
