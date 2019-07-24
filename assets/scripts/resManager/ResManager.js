cc.Class({
    /*
     *  资源管理器
     *  储存所有平台的预制体资源
     */
    
    extends: cc.Component,

    properties: {
        // 所有单个平台的图片
        singlePlatformSpriteFrame: {
            default: [],
            type: [cc.SpriteFrame]
        },

        // 单个平台的预制资源
        singlePlatformPrefab: {
            default: null,
            type: cc.Prefab
        },

        // 所有common主题的组合平台的预制资源
        commonPlatformPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有winter主题的组合平台的预制资源
        winterPlatformPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有grass主题的组合平台的预制资源
        grassPlatformPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有钉子平台的预制资源
        spikePlatformPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 钻石的预制资源
        diamondPrefab: {
            default: null,
            type: cc.Prefab
        },

        // 所有皮肤的预制资源
        skinPrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        // 所有皮肤的图片
        skinSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },

        // 所有皮肤的名字
        skinNames: {
            default: [],
            type: [cc.String]
        },

        // 所有皮肤对应的价格
        skinPrices: {
            default: [],
            type: [cc.Integer]
        },

        // 按钮点击音效
        buttonClip: {
            default: null,
            type: cc.AudioClip
        },

        // 吃到钻石音效
        diamondClip: {
            default: null,
            type: cc.AudioClip
        },

        // 掉落音效
        fallClip: {
            default: null,
            type: cc.AudioClip
        },

        // 撞到障碍物音效
        hitClip: {
            default: null,
            type: cc.AudioClip
        },

        // 跳跃音效
        jumpClip: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
