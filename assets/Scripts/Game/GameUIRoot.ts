import GameManager from "../Manager/GameManager";
import Controller from "./Controller";

//游戏场景主UI功能

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUIRoot extends cc.Component {

    public static Instance:GameUIRoot;

    onLoad(){
        GameUIRoot.Instance = this;
        GameManager.setScore(0);
        this.scheduleOnce(()=>{
            this.goldPos = this.score.node.parent.parent.convertToWorldSpaceAR(this.score.node.parent.position);  
        }, 0.1);
    }

    @property()
    youdieText:string = "你死了";

    @property(cc.Node)
    menuPanel:cc.Node = null;

    //游戏暂停Button
    @property(cc.Button)
    pauseButton: cc.Button = null;
    //游戏继续Button
    @property(cc.Button)
    resumeButton: cc.Button = null;
    //游戏重置Button
    @property(cc.Button)
    resetButton: cc.Button = null;
    //游戏返回Button
    @property(cc.Button)
    backButton: cc.Button = null;

    //Jump
    @property(cc.Button)
    jumpButton: cc.Button = null;

    //Jump
    @property(cc.Button)
    fullJumpButton: cc.Button = null;

    //分数
    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Node)
    youDie:cc.Node = null;

    //金币的位置
    public goldPos:cc.Vec3 = null;

    start() {
        this.menuPanel.active = false;
        this.pauseButton.node.on('click', this.OnPauseClick, this);
        this.resumeButton.node.on('click', this.OnResumeClick, this);
        this.resetButton.node.on('click', this.OnResetClick, this);
        this.backButton.node.on('click', this.OnBackClick, this);
        let full = GameManager.getFullJump();cc.Node.EventType.TOUCH_START
        this.fullJumpButton.node.active = full;
        this.jumpButton.node.active = !full;
        this.jumpButton.node.on(cc.Node.EventType.TOUCH_START, this.OnJump, this);
        this.fullJumpButton.node.on(cc.Node.EventType.TOUCH_START, this.OnJump, this);
        // this.jumpButton.node.on('click', this.OnJump, this);
        // this.fullJumpButton.node.on('click', this.OnJump, this);
    }
    onGameOver() {
        this.menuPanel.active = true;
        this.resumeButton.node.active = false;
        this.youDie.active = true;
        this.youDie.children[0].getComponent(cc.Label).string = this.youdieText + " 金币：" + GameManager.getScore();
    }
    OnPauseClick() {
        cc.log("游戏暂停");
        GameManager.setIsPlay(false);
        this.resumeButton.node.active = true;
        this.youDie.active = false;
        this.menuPanel.active = true;
    }
    OnResumeClick() {
        cc.log("游戏继续");
        GameManager.setIsPlay(true);
        this.menuPanel.active = false;
    }
    OnResetClick() {
        cc.log("游戏重置");
        GameManager.resetPlay();
        this.menuPanel.active = false;
    }
    OnBackClick() {
        cc.log("返回主菜单");
        GameManager.onScoreSave();
        cc.director.loadScene("Begin",function(){ cc.director.resume(); });
    }

    OnJump(){
        if(Controller.Instance != null)
            Controller.Instance.onUp();
    }

    public setScore(sc:number){
        this.score.string = sc.toString();
    }
}
