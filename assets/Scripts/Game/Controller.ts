//基本操作控制
import GameUIRoot from "./GameUIRoot";
import MapMove from "./MapMove";
import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Controller extends cc.Component {

    private isPlay:boolean = false;
    private setisPlay(play){
        this.isPlay = play;
        this.gamePlayInfo.active = !play;
    }

    public static Instance:Controller;

    //游戏提示
    @property(cc.Node)
    gamePlayInfo:cc.Node = null;

    onLoad(){
        Controller.Instance = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        //this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onTouchStartCallback, this);
        
    }
    start () {
        this.setisPlay(false);
    }


    //按键点击
    onKeyDown(event) {
        if(!this.isPlay){
            this.onResume();
            return;
        }
        switch(event.keyCode) {
            case cc.macro.KEY.escape:
                if(GameUIRoot.Instance == null)break;
                if(cc.director.isPaused()){
                    GameUIRoot.Instance.OnResumeClick();
                }else{
                    GameUIRoot.Instance.OnPauseClick();
                }
                break;
            case cc.macro.KEY.space:
                this.onUp();
                break;
            case cc.macro.KEY.up:
                this.onUp();
                break;
            case cc.macro.KEY.w:
                this.onUp();
                break;
        }
    }

    onUp(){
        if(Player.Instance != null)
            Player.Instance.onJump();
    }


    onTouchStartCallback(){
        if(!this.isPlay)this.onResume();
    }

    public onReset(){
        this.onPause();
        if(MapMove.Instance != null)MapMove.Instance.setIsStop(true);
    }

    public onResume(){
        this.setisPlay(true);
        if(MapMove.Instance != null)MapMove.Instance.setIsStop(false);
        if(Player.Instance != null)Player.Instance.onPlay();
    }

    public onPause(){
        this.setisPlay(false);
        if(Player.Instance != null)Player.Instance.onPause();
    }
}
