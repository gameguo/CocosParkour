//开始场景主UI功能
import PlayerUIRoot from "./PlayerUIRoot";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BeginUIRoot extends cc.Component {


    @property(cc.Button)
    play: cc.Button = null;

    @property(cc.Button)
    player: cc.Button = null;

    @property(cc.Button)
    setting: cc.Button = null;

    @property(cc.Button)
    about: cc.Button = null;

    @property(cc.Button)
    quit: cc.Button = null;

    @property(cc.Node)
    playerNode: cc.Node = null;
    @property(cc.Node)
    settingNode: cc.Node = null;
    @property(cc.Node)
    aboutNode: cc.Node = null;

    start () {

        this.play.node.on('click', this.OnPlayClick, this);
        this.player.node.on('click', this.OnPlayerClick, this);
        this.setting.node.on('click', this.OnSettingClick, this);
        this.about.node.on('click', this.OnAboutClick, this);
        this.quit.node.on('click', this.OnQuitClick, this);
        
        if(cc.sys.platform == cc.sys.ANDROID || cc.sys.platform == cc.sys.WIN32){
            this.quit.node.on('click', this.OnQuitClick, this);
        }else{
            this.quit.node.active = false;
        }
        this.playerNode.getComponent(PlayerUIRoot).Init();
        this.playerNode.active = false;
        this.settingNode.active = false;
        this.aboutNode.active = false;
    }
    OnPlayClick() {
        cc.director.loadScene("Game");
    }
    OnPlayerClick() {
        this.playerNode.active = true;
    }
    OnSettingClick() {
        this.settingNode.active = true;
    }
    OnAboutClick() {
        this.aboutNode.active = true;
    }
    OnQuitClick() {
        cc.game.end();
    }
}
