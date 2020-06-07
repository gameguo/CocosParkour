//Ground父物体 实例化工具

import MapMove from "./MapMove";
import GroundPrefab from "./GroundPrefab";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ground extends cc.Component {

    public static Instance: Ground;

    // @property({
    //     type :cc.Float,
    //     displayName: "路面间距与移动速度的比值"
    // })
    // ratio:number = 0.35;

    //基础路面间距
    //如果改动了Ground预制体的路面间距,那么最好调节此变量,否则可能出现间距问题
    //默认此变量初始化时自动读取Ground1/Ground中的间距
    @property({
        type :cc.Float,
        displayName: "基础路面间距",
        tooltip:"如果改动了Ground预制体的路面间距,那么最好调节此变量,否则可能出现间距问题,默认此变量初始化时自动读取Ground1/Ground中的间距"
    })
    space:number = 70;
    @property({
        displayName: "是否自动读取路面间距",
        tooltip:"关闭此开关，则不会自动获取Ground1/Ground中的间距，而是以上方输入为准"
    })
    isAutoSpace:boolean = true;

    //游戏初始的两个地图的预制体
    @property({
        type :cc.Prefab,
        displayName: "初始两个地图预制体",
        tooltip:"场景上面默认摆放的两个Ground的预制体资源引用"
    })
    groundDefault:cc.Prefab[] = [];

    //所有地图的预制体
    @property({
        type :cc.Prefab,
        displayName: "所有地图预制体",
        tooltip:"当前需要循环播放的所有预制体引用"
    })
    grounds:cc.Prefab[] = [];

    //金币预制体
    @property({
        type :cc.Prefab,
        displayName: "金币预制体",
        tooltip:"金币预制体"
    })
    goldPrefab:cc.Prefab = null;

    //当前路面进行到的index
    index:number = 0;

    //默认缩放 自动获取
    public myScale:number;

    //难度改变后计算得到的真实间距
    public trueSpace:number;

    onLoad() {
        Ground.Instance = this; 
        this.myScale = this.node.scaleX;
    }

    start(){
        if(this.isAutoSpace){
            //自动读取Ground1/Ground下Layout组件的spacingX 地形行间距
            this.space = this.node.children[0].children[0].getComponent(cc.Layout).spacingX;
        }
        this.trueSpace = this.space;
        //间距 70  计算出基础比
        let ratio = this.space / MapMove.Instance.moveSpeed;
        //如果当前难度真实速度已经改变
        if(MapMove.Instance.moveSpeed < MapMove.Instance.trueSpeed){
            //改变间距
            this.trueSpace = ratio * MapMove.Instance.trueSpeed;
        }
    }

    LoadGround(ground:cc.Node){
        this.index++;
        if(this.index >= this.grounds.length){
            this.index = 0;
        }
        //先销毁自己的子对象
        for (const item of ground.children) {
            item.destroy();
        }
        //从列表中实例化出一个新的
        let temp = this.grounds[this.index];
        var go = cc.instantiate(temp);
        go.parent = ground;
        go.position = cc.Vec3.ZERO;
        go.getComponent(GroundPrefab).isOne = false;
        return go.getContentSize().width;
    }

    LoadGroundDefault(ground:cc.Node, num:number){
        this.index = 0;
        //先销毁自己的子对象
        for (const item of ground.children) {
            item.destroy();
        }
        //从列表中实例化出一个新的
        let temp = this.groundDefault[num];
        var go = cc.instantiate(temp);
        go.parent = ground;
        go.position = cc.Vec3.ZERO;
        go.getComponent(GroundPrefab).isOne = num == 0;
        return go.getContentSize().width;
    }


    LoadGold(parent:cc.Node, pos:cc.Vec3){
        var go = cc.instantiate(this.goldPrefab);
        go.parent = parent;
        go.position = pos;
        return go;
    }
    
}
