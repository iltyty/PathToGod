var DataManager = cc.Class({
    /*
     * 管理游戏所有的数据
     */

    statics: {
        instance: null
    },

    extends: cc.Component,

    properties: {
        // 游戏音效是否开启
        isMusicOn: true,

        // 本局游戏是否为新的最高分
        isNewBest: false, 

        // 单局游戏分数
        singleGameScore: 0,

        // 排行榜的分数
        bestScores: {
            default: [],
            type: [cc.Integer]
        },

        // 单局得到的钻石个数
        singleGameDiamond: 0,

        // 玩家当前的钻石总数
        diamondTotal: 0,

        // 玩家当前正在使用的皮肤的索引，默认为第一个
        skinChosen: 0,

        // 记录所有皮肤是否已解锁
        skinUnlocked: {
            default: [],
            type: [cc.Boolean]
        }
    },

    onLoad () {
        console.log('onload');
        this.bestScores = [0, 0, 0];
        this.skinUnlocked = [true, false, false, false];
        this.saveDataToMemory();
    },

    start () {
        console.log('start');
        this.bestScores = [0, 0, 0];
        this.skinUnlocked = [true, false, false, false];
        this.saveDataToMemory();
    },

    // 从内存中读取钻石总数和最好分数
    getDataFromMemory () {
        let isNewBest = cc.sys.localStorage.getItem('isNewBest');
        let isMusicOn = cc.sys.localStorage.getItem('isMusicOn');
        let bestScores = cc.sys.localStorage.getItem('bestScores');
        let diamondTotal = cc.sys.localStorage.getItem('diamondTotal');
        let skinChosen = cc.sys.localStorage.getItem('skinChosen');
        let skinUnlocked = cc.sys.localStorage.getItem('skinUnlocked');

        // if (bestScores) {
        //     let slice = '';
        //     let result = [];
        //     let index = 0;
        //     for (let i = 0; i < bestScores.length; i++) {
        //         if (bestScores[i] === ',') {
        //             result[index++] = slice;
        //             slice = '';
        //         } else {
        //             slice += bestScores[i];
        //         }
        //     }
        //     result[index] = slice;
        //     bestScores = result;
        // }
        // if (skinUnlocked) {
        //     let slice = '';
        //     let result = [];
        //     let index = 0;
        //     for (let i = 0; i < skinUnlocked.length; i++) {
        //         if (skinUnlocked[i] === ',') {
        //             result[index++] = slice;
        //             slice = '';
        //         } else {
        //             slice += skinUnlocked[i];
        //         }
        //     }
        //     result[index] = slice;
        //     skinUnlocked = result;
        // }

        // for (let i in bestScores) {
        //     bestScores[i] = parseInt(bestScores[i]);
        // }
        // for (let i in skinUnlocked) {
        //     if (skinUnlocked[i] === 'true') {
        //         skinUnlocked[i] = true;
        //     } else {
        //         skinUnlocked[i] = false;
        //     }
        // }

        if (!isNewBest || isNewBest === 'false') {
            this.isNewBest = false;
        } else {
            this.isNewBest = true;
        }
        
        if (!isMusicOn || isMusicOn === 'false') {
            this.isMusicOn = false;
        } else {
            this.isMusicOn = true;
        }

        if (!bestScores) {
            this.bestScores = [0, 0, 0];
        } else {
            this.bestScores = bestScores;
        }

        if (!skinUnlocked) {
            this.skinUnlocked = [true, false, false, false];
        } else {
            this.skinUnlocked = skinUnlocked;
        }

        if (!diamondTotal) {
            this.diamondTotal = 0;
        } else {
            this.diamondTotal = parseInt(diamondTotal);
        }

        if (!skinChosen) {
            this.skinChosen = 0;
        } else {
            this.skinChosen = parseInt(skinChosen);
        }

        // this.isNewBest = (isNewBest === 'true' ? true : false);
        // this.isMusicOn = (isMusicOn === 'true' ? true : false);
        // this.bestScores = (bestScores != null ? bestScores : [0, 0, 0]);
        // this.diamondTotal = (diamondTotal != null ? parseInt(diamondTotal) : 0);
        // this.skinChosen = (skinChosen != null ? parseInt(skinChosen) : 0);
        // this.skinUnlocked = (skinUnlocked != null ? skinUnlocked : [true, false, false, false]);
    },

    // 将最好分数和钻石总数存入内存中方便下次重新进入游戏时读取
    saveDataToMemory () {
        cc.sys.localStorage.setItem('isNewBest', this.isNewBest);
        cc.sys.localStorage.setItem('isMusicOn', this.isMusicOn);
        cc.sys.localStorage.setItem('bestScores', this.bestScores);
        cc.sys.localStorage.setItem('diamondTotal', this.diamondTotal);
        cc.sys.localStorage.setItem('skinChosen', this.skinChosen);
        cc.sys.localStorage.setItem('skinUnlocked', this.skinUnlocked);
    },
    
    // 从内存中删除数据
    removeDataFromMemory () {
        cc.sys.localStorage.removeItem('isNewBest');
        cc.sys.localStorage.removeItem('isMusicOn');
        cc.sys.localStorage.removeItem('bestScores');
        cc.sys.localStorage.removeItem('diamondTotal');
        cc.sys.localStorage.removeItem('skinChosen');
        cc.sys.localStorage.removeItem('skinUnlocked');
    },
});

DataManager.instance = new DataManager();

export default DataManager;
