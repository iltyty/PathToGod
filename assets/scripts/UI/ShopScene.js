var dataManager = require('DataManager');

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

        // 当前正在浏览的皮肤的索引
        skinIndex: 0,

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
        dataManager.instance.getDataFromMemory();

        this.resManager = cc.find('Canvas/resManager').getComponent('ResManager');
        this.contentNode = cc.find('Canvas/view/content');
        this.diamondText.getComponent(cc.RichText).string = dataManager.instance.diamondTotal.toString();

        this.addSkins();
        this.addBtnEvents();
    },

    addBtnEvents () {
        this.btnBack.on('touchend', function (event) {
            cc.director.loadScene('StartScene');
        }, this);

        this.btnBuy.on('touchend', function (event) {
            this.onBtnBuyTouchend();
        }, this);

        cc.find('Canvas/scrollRect').on('scroll-ended', function (event) {
            this.refresh();
        }, this); 
    },

    // 找到view结点下的content结点，添加皮肤图片
    addSkins () {
        let skinPrefabs = this.resManager.skinPrefabs;

        this.contentNode.setContentSize((skinPrefabs.length + 1) * 285 + 150, 250)

        for (let i = 0; i < skinPrefabs.length; i++) {
            let skin = cc.instantiate(skinPrefabs[i]);

            if (!dataManager.instance.skinUnlocked[i]) {
                // 如果这个皮肤未解锁，则将其颜色设置为灰色
                skin.children[0].color = cc.Color.GRAY;
            }

            skin.setPosition(285 * (i + 1), 0);
            this.contentNode.addChild(skin);
        }
    },

    start () {

    },

    update (dt) {
        // 通过content结点的位置来判断当前浏览的是哪个皮肤
        let index = Math.round((this.contentNode.position.x + 400) / (-285));

        this.skinIndex = index;
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

    // 购买皮肤按钮点击事件处理函数
    onBtnBuyTouchend () {
        let price = parseInt(this.btnBuy.getChildByName('price').getComponent(cc.RichText).string);

        if (price > dataManager.instance.diamondTotal) {
            // 钻石不足，无法购买
            return;
        }
        
        // 更新游戏数据
        dataManager.instance.diamondTotal -= price;
        dataManager.instance.skinUnlocked[this.skinIndex] = true;
        dataManager.instance.skinChosen = this.skinIndex;
        dataManager.instance.saveDataToMemory();

        this.btnBuy.active = false;
        this.btnSelect.active = true;
        // 更新钻石数
        this.diamondText.getComponent(cc.RichText).string = dataManager.instance.diamondTotal.toString();
        // 将皮肤颜色设置为白色
        this.contentNode.children[this.skinIndex].children[0].color = cc.Color.WHITE;
    },

    // 根据当前正在浏览的皮肤更改content结点的位置
    refresh () {
        let index = Math.round((this.contentNode.position.x + 360) / (-285));

        if (index < 0) {
            index = 0;
        } else if (index >= this.resManager.skinPrefabs.length) {
            index = this.resManager.skinPrefabs.length - 1;
        }

        this.skinIndex = index;

        // 设置滑动的位置
        this.contentNode.runAction(cc.moveTo(0.5, -360 - index * 285, 0));

        // 设置对应按钮的显示
        if (dataManager.instance.skinUnlocked[index]) {
            // 当前浏览的皮肤已解锁，则显示开始游戏按钮
            this.btnSelect.active = true;
            this.btnBuy.active = false;
        } else {
            // 当前皮肤未解锁，显示购买按钮，同时更新该皮肤的价格
            this.btnSelect.active = false;
            this.btnBuy.active = true;
            this.btnBuy.getChildByName('price').getComponent(cc.RichText).string = this.resManager.skinPrices[index].toString();
        }
    }
});
