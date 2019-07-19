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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
