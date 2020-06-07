import GameUIRoot from "./GameUIRoot";
import Player from "./Player";
import Ground from "./Ground";
import AudioManager, { AudioType } from "../Manager/AudioManager";

// 金币
const {ccclass, property} = cc._decorator;

@ccclass
export default class Gold extends cc.Component {
    //摧毁金币
    public GoldDestory(){
        //此处调用声音
        AudioManager.PlayEffect(AudioType.gold);
        this.onFlutter();
    }

    onFlutter(){
        if(GameUIRoot.Instance==null){
            this.node.destroy();
            return;
        }
        var pos1 = this.node.parent.convertToWorldSpaceAR(this.node.position);
        this.node.parent = Player.Instance.node.parent;
        this.node.scale = Ground.Instance.myScale;
        this.node.position = pos1;
        let pos = GameUIRoot.Instance.goldPos;//this.node.convertToNodeSpaceAR(GameUIRoot.Instance.goldPos);
        cc.tween(this.node).to(1, {position: pos}).start();
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 1.0);
    }
}
