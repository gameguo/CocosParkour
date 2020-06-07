import Ground from "./Ground";
import Player from "./Player";
import GroundPrefab from "./GroundPrefab";

//刚体同步移动位置
const {ccclass, property} = cc._decorator;

@ccclass
export default class GroundCollider extends cc.Component {

    //private box:cc.BoxCollider;
    //private phy:cc.PhysicsBoxCollider;
    private rig:cc.RigidBody;
    
    private pos:cc.Vec3;

    private myBox:cc.BoxCollider;
    onLoad () {
        //this.box = this.node.getComponent(cc.BoxCollider);
        this.rig = this.node.getComponent(cc.RigidBody);
        //this.phy = this.node.getComponent(cc.PhysicsBoxCollider);
        this.pos = this.node.position;
    }
    start(){
        //先实例化金币
        this.instaBold();
        //再实例化Box  否则连Box中也会随机生成金币
        this.instaBox();
    }
    lateUpdate(){
        this.node.position = this.pos;
        this.rig.syncPosition(true);
    }
    // // 只在两个碰撞体开始接触时被调用一次
    // onBeginContact(contact, selfCollider, otherCollider){
    //     console.log("进入" + otherCollider.node.group);
    // }

    // // 只在两个碰撞体结束接触时被调用一次
    // onEndContact(contact, selfCollider, otherCollider){
    //     console.log("离开" + otherCollider.node.group);
    // }
    //生成一个Box 用来判断Player是否已经踩到边缘地带
    instaBox(){
        var n = new cc.Node('null');
        this.myBox = n.addComponent(cc.BoxCollider);
        n.parent = this.node;
        n.group = "GroundOver";

        //主角的碰撞器 宽是60  所以X轴离开地面60的位置处应该下落
        //同时 地图缩放为参数为4  则需60 / 4 得到应该触发的位置
        this.myBox.offset = new cc.Vec2(Player.Instance.myBoxWidth / Ground.Instance.myScale, 1);
        this.myBox.size = new cc.Size(5, this.node.getContentSize().height);
    }
    //生成金币 
    instaBold(){
        //TODO 排除初始地图第一段路的金币
        let isOne = this.node.parent.getComponent(GroundPrefab).isOne && this.node.getSiblingIndex() == 0;
        //三个档次宽度的金币数量
        let goldTempType = [30, 60, 180];
        let nums = [1,2,4,4];
        for (let index = 0; index < this.node.children.length; index++) {
            //如果是第一张地图第一块的第一小块 则跳过生成金币
            if(isOne && index == 0)continue;
            const item = this.node.children[index];
            //获取一个随机数,0-1 有80%的几率会出现金币
            if(Math.random() < 0.8){//如果成功出现金币
                let size = item.getContentSize();
                //计算金币统一的Y轴
                let tempY = (size.height / 2) + 8;
                //得出几个档次的金币数量
                let num = size.width <= goldTempType[0]? nums[0]:size.width <= goldTempType[1]? nums[1]:
                    size.width < goldTempType[2]? nums[2]:nums[3];
                if(num == 1) {
                    let pos = new cc.Vec3(0, tempY);
                    var gold = Ground.Instance.LoadGold(item, pos);
                    continue;
                }
                let tempX = size.width / (num + 1);
                for (let index = 0; index < num; index++) {
                    let x = (tempX * index) - (size.width/2) + tempX;
                    let pos = new cc.Vec3(x, tempY);
                    //实例化一个金币
                    var gold = Ground.Instance.LoadGold(item, pos);
                }
            }
        }
    }
}
