//Ground移动
import Ground from "./Ground";
import MapMove from "../Game/MapMove";
import GroundPrefab from "./GroundPrefab";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GroundMove extends cc.Component {

    //父对象Ground
    private ground:Ground = null;

    //另外一个Ground
    @property(GroundMove)
    public target:GroundMove = null;

    //当前的宽度
    public thisWidth:number;
    //第一个Ground的宽度
    public defaultWidth:number;
    
    //当前物体处于父对象的下标
    private myIndex:number;

    onLoad(){
        this.ground = this.node.parent.getComponent(Ground);
        this.thisWidth = this.node.getContentSize().width;
        this.defaultWidth = this.thisWidth;
        this.myIndex = this.node.getSiblingIndex();
        if(this.myIndex == 0){
            //设置最起始的第一个地图
            this.node.children[0].getComponent(GroundPrefab).isOne = true;
        }
    }
    start(){
        MapMove.Instance.resetCallBacks.push(this.onReset);
        MapMove.Instance.onUpdates.push(this.onUpdate);
    }

    initGround2Pos(){
        //初始化精准起始地图位置
        if(this.myIndex != 0){
            let tempPos = this.node.position;
            tempPos.x = this.target.node.position.x + this.target.thisWidth;
            this.node.position = tempPos;
            //console.log(this.node.position);
        }
    }

    onUpdate = (speed) => {
        let tempPos = this.node.position;
        //当前地图如果跑完了话
        if(tempPos.x <= -this.thisWidth){
            //加载一个新地图并更新自己的宽度
            this.thisWidth = this.ground.LoadGround(this.node);
            //把自己移动到最后面
            tempPos.x = this.target.node.position.x + this.target.thisWidth;
            console.log("Ground" + this.myIndex + "结束，切换并实例化新Ground备用");
        }
        //MapMove.Instance.moveSpeed * dt
        tempPos.x -= (speed / Ground.Instance.myScale);
        this.node.position = tempPos;
    }
    onReset = () => {
        //console.log("我调用了");
        //console.log(this.name);
        for (const item of this.node.children) {
            item.destroy();
        }
        if(this.myIndex == 0){
            this.node.position = cc.Vec3.ZERO;
        }else{
            this.node.position = new cc.Vec3(this.target.defaultWidth, 0);
        }
        //恢复默认地图
        this.thisWidth = this.ground.LoadGroundDefault(this.node, this.myIndex);
    }

}
