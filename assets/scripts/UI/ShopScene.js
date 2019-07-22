cc.Class({
    extends: cc.Component,

    properties: {
        // 返回主页按钮
        btnBack: {
            default: null,
            type: cc.Node
        },

        // 购买皮肤按钮
        btnBuy: {
            default: null,
            type: cc.Node
        },

        // 选择皮肤后的开始按钮
        btnSelect: {
            default: null,
            type: cc.Node
        },

        // 当前拥有的钻石数
        diamondText: {
            default: null,
            type: cc.Node
        },

        // content结点
        contentNode: {
            default: null,
            type: cc.Node
        },

        // 当前正在浏览的皮肤的名字
        skinName: {
            default: null,
            type: cc.Node
        },

        // 资源管理器
        resManager: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.resManager = cc.find('Canvas/resManager').getComponent('ResManager');
        this.contentNode = cc.find('Canvas/view/content');

        this.addSkins();

        this.addBtnEvents();
    },

    addBtnEvents () {
        this.btnBack.on('touchend', function (event) {
            cc.director.loadScene('StartScene');
        }, this);

        cc.find('Canvas/scrollRect').on('touch-up', function (event) {
            console.log('touch up')
            this.refresh();
        }, this);
    },

    // 找到view结点下的content结点，添加皮肤图片
    addSkins () {
        let skinPrefabs = this.resManager.skinPrefabs;

        this.contentNode.setContentSize((skinPrefabs.length + 1) * 285 + 150, 250)

        for (let i = 0; i < skinPrefabs.length; i++) {
            let skin = cc.instantiate(skinPrefabs[i]);
            skin.setPosition(285 * (i + 1), 0);
            this.contentNode.addChild(skin);
        }
    },

    start () {

    },

    update (dt) {
        // 通过content结点的位置来判断当前浏览的是哪个皮肤
        let index = Math.round((this.contentNode.position.x + 400) / (-285));
        this.setSkinImageSize(index);
        this.skinName.getComponent(cc.RichText).string = this.resManager.skinNames[index];
    },

    // 根据当前浏览的皮肤的索引来修改皮肤图片的大小
    // 当前浏览的皮肤放大，其他皮肤缩小
    setSkinImageSize (index) {
        let skins = this.contentNode.children;
        for (let i = 0; i < skins.length; i++) {
            // 遍历content的所有子节点，即所有皮肤
            if (i === index) {
                // 放大正在浏览的皮肤
                skins[i].children[0].scale = new cc.Vec2(1, 1);
            } else {
                // 缩小其他皮肤
                skins[i].children[0].scale = new cc.Vec2(0.5, 0.5);
            }
        }
    },

    // 根据当前正在浏览的皮肤更改content结点的位置
    refresh () {
        let index = Math.round((this.contentNode.position.x + 360) / (-285));
        
        this.contentNode.runAction(cc.moveTo(0.5, -360 - index * 285, 0));
    }
});
