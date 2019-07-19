cc.Class({
    /*
     *  管理平台的对象池
     *  含有单平台以及各种组合平台的list
     *  每次生成新平台时从此对象池中取出一个平台实例
     *  若此对象池中无相应实例，则添加新的平台到对象池中
     */

    extends: cc.Component,

    properties: {
        // 单个平台的list
        singlePlatformList: {
            default: [],
            type: [cc.Node]
        }, 

        // common主题组合平台的list
        commonPlatformList: {
            default: [],
            type: [cc.Node]
        },

        // winter主题组合平台的list
        winterPlatformList: {
            default: [],
            type: [cc.Node]
        },

        // grass主题组合平台的list
        grassPlatformList: {
            default: [],
            type: [cc.Node]
        },

        // spikeLeft主题组合平台的list
        spikePlatformLeftList: {
            default: [],
            type: [cc.Node]
        },

        // spikeRight主题组合平台的list
        spikePlatformRightList: {
            default: [],
            type: [cc.Node]
        },
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
