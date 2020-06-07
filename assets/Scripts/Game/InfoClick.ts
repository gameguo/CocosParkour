//点击开始游戏Node
import Controller from "./Controller";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InfoClick extends cc.Component {
    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback);
    }
    onTouchStartCallback(){
        if(!Controller.Instance != null)Controller.Instance.onTouchStartCallback();
    }
}
