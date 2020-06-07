//设置
import GameManager from "../Manager/GameManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingUIRoot extends cc.Component {

    @property(cc.Button)
    backBtn: cc.Button = null;

    @property(cc.Button)
    okBtn: cc.Button = null;

    @property(cc.ToggleContainer)
    toggleContainer:cc.ToggleContainer = null;

    @property(cc.Toggle)
    toggleJump:cc.Toggle = null;

    start () {
        this.backBtn.node.on('click', this.OnBackClick, this);
        this.okBtn.node.on('click', this.OnOkClick, this);
    }

    onEnable(){
        var diff = GameManager.getDifficulty();
        this.toggleContainer.toggleItems[diff].isChecked = true;

        this.toggleJump.isChecked = GameManager.getFullJump();
    }
    OnBackClick(){
        this.node.active = false;
    }
    OnOkClick(){
        for (let index = 0; index < this.toggleContainer.toggleItems.length; index++) {
            if(this.toggleContainer.toggleItems[index].isChecked){
                GameManager.setDifficulty(index);
                GameManager.setFullJump(this.toggleJump.isChecked);
                this.OnBackClick();
                console.log("设置成功：难度-" + index + " 全屏跳跃-" + this.toggleJump.isChecked);
                return;
            }
        }
    }
}
