import GroundCollider from "./GroundCollider";
import Ground from "./Ground";
import GroundMove from "./GroundMove";

// GroundPrefab
const {ccclass, property} = cc._decorator;

@ccclass
export default class GroundPrefab extends cc.Component {

    //当前预制体是否是地图中的第一个
    public isOne:boolean = false;
    private parentGroundMove:GroundMove = null;
    onLoad () {
        //每当一个新的Prefab加载时
        //给地图中所有碰撞物体添加GroundCollider
        for (const item of this.node.children) {
            item.addComponent(GroundCollider);
        }
        this.parentGroundMove = this.node.parent.getComponent(GroundMove);
    }
    start(){
        //延迟一帧设置X的真实间距
        this.scheduleOnce(()=>{
            this.initSetting();
        }, 0);
        //console.log(this.isOne);
    }

    initSetting(){
        //console.log(Ground.Instance.trueSpace);
        if(this.node.getComponent(cc.Layout).spacingX != Ground.Instance.trueSpace){
            this.node.getComponent(cc.Layout).spacingX = Ground.Instance.trueSpace;
            this.node.getComponent(cc.Layout).paddingRight = Ground.Instance.trueSpace;
            //如果间距修改了 则宽度也需要修改
            this.scheduleOnce(()=>{
                //此处必须再延迟0.1秒设置当前宽度 否则刚设置完spacingX延迟不过来
                this.parentGroundMove.thisWidth = this.node.getContentSize().width;
                this.parentGroundMove.defaultWidth = this.parentGroundMove.thisWidth;
                //console.log(this.thisWidth);
                this.parentGroundMove.initGround2Pos();
            }, 0.1);
        }else{
            this.parentGroundMove.initGround2Pos();
        }
    }
}
