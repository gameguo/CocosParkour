//
// 该类处理了角色购买、角色选择
//
import GameManager from "../Manager/GameManager";

const {ccclass, property} = cc._decorator;

export class PlayerText{
    public string:string;
    public num:number;
}

@ccclass
export default class PlayerUIRoot extends cc.Component {

    static Instance:PlayerUIRoot;

    //返回
    @property(cc.Button)
    backBtn: cc.Button = null;

    //角色设置Ok
    @property(cc.Button)
    haveSelectOkBtn: cc.Button = null;

    //购买
    @property(cc.Button)
    buyBtn: cc.Button = null;

    //购买Ok
    @property(cc.Button)
    buyOkBtn: cc.Button = null;

    //购买关闭
    @property(cc.Button)
    buyBackBtn: cc.Button = null;

    //拥有面板
    @property(cc.Node)
    haveNode: cc.Node = null;
    //购买面板
    @property(cc.Node)
    buyNode: cc.Node = null;

    //拥有的角色
    @property(cc.Node)
    havePlayer:cc.Node = null;
    //购买的角色
    @property(cc.Node)
    buyPlayer:cc.Node = null;

    //当前选择项的名字Label
    @property(cc.Label)
    currentSelectName: cc.Label = null;
    //当前的金币Label
    @property(cc.Label)
    currentGold: cc.Label = null;

    //提示文字
    @property(cc.Label)
    log: cc.Label = null;

    start () {
        this.backBtn.node.on('click', this.OnBackClick, this);
        this.buyBtn.node.on('click', this.OnBuyClick, this);
        this.buyBackBtn.node.on('click', this.OnBuyBackClick, this);
        this.buyOkBtn.node.on('click', this.OnBuyOkClick, this);
        this.haveSelectOkBtn.node.on('click', this.OnHaveSelectOkClick, this);
    }
    public Init(){
        PlayerUIRoot.Instance = this;
        cc.loader.loadRes("Player/player", cc.TextAsset, function (err, file){
            if(err!=null){
                console.log("player.txt 加载失败：" + err);
                return;
            }
            PlayerUIRoot.parseText(file.text);
            //console.log("player.txt:" + file.text);
        });

        // // 测试 角色与金币
        // GameManager.setHaveNums([0,1,2]);
        // GameManager.setGold(700);
    }

    static sprites:cc.SpriteFrame[] = null;
    static playerText:PlayerText[] = [];
    static haveNodes:cc.Node[] = [];
    static buyNodes:cc.Node[] = [];

    onEnable(){
        this.buyNode.active = false;
        this.haveNode.active = true;

        this.currentSelectName.string = "";

        this.updateGold();

        if(PlayerUIRoot.sprites != null){
            PlayerUIRoot.startInstance();
            return;
        }

        cc.loader.loadResDir("Player/", cc.SpriteAtlas, function (err, atlas, urls) {
            if(err!=null){
                console.log("资源加载失败：" + err);
                return;
            }
            PlayerUIRoot.sprites = [];
            for (let index = 0; index < urls.length; index++) {
                //console.log(urls[index]);
                PlayerUIRoot.sprites.push(atlas[index].getSpriteFrame('2'));
            }
            PlayerUIRoot.startInstance();
        });
    }
    onDisable(){
        this.clearPlayerNodes();
    }
    clearPlayerNodes(){
        for(let item of PlayerUIRoot.haveNodes){
            item.destroy();
        }
        for(let item of PlayerUIRoot.buyNodes){
            item.destroy();
        }
        PlayerUIRoot.haveNodes = [];
        PlayerUIRoot.buyNodes = [];
    }

    //开始实例化
    static startInstance(){
        if(PlayerUIRoot.Instance!=null){
            PlayerUIRoot.Instance.localStartInstance();
        }
    }
    localStartInstance(){
        if(PlayerUIRoot.sprites == null)return;
        var selectNum = GameManager.getSelectNum();
        var haveNums = GameManager.getHaveNums();
        for (let index = 0; index < PlayerUIRoot.sprites.length; index++) {
            let isInstance = false;
            for (let item of haveNums) {
                if(item == index){
                    isInstance = true;
                    break;
                }
            }
            //console.log(selectNum);
            if(isInstance){
                var node = cc.instantiate(this.havePlayer);
                node.name = String(index); //PlayerUIRoot.playerText[index].string;
                node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = PlayerUIRoot.sprites[index];
                node.getChildByName("checkmark").getComponent(cc.Sprite).spriteFrame = PlayerUIRoot.sprites[index];
                node.parent = this.havePlayer.parent;
                node.getComponent(cc.Toggle).isChecked = index == selectNum;
                node.active = true;
                //console.log(node.position);
                PlayerUIRoot.haveNodes.push(node);
            }else{
                var node = cc.instantiate(this.buyPlayer);
                node.name = String(index);//PlayerUIRoot.playerText[index].string;
                node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = PlayerUIRoot.sprites[index];
                node.getChildByName("checkmark").getComponent(cc.Sprite).spriteFrame = PlayerUIRoot.sprites[index];
                cc.find("gold/money", node).getComponent(cc.Label).string = String(PlayerUIRoot.playerText[index].num);
                node.parent = this.buyPlayer.parent;
                node.getComponent(cc.Toggle).isChecked = false;
                node.active = true;
                //console.log(node.position);
                PlayerUIRoot.buyNodes.push(node);
            }
        }

        this.updateCurrentName();
        //延迟更新当前选择
        this.scheduleOnce(function() {
            this.updateHaveDefaultSelect();
        }, 0.1);
        //console.log(PlayerUIRoot.sprites.length + " " + PlayerUIRoot.playerText.length);
    }
    //解析player.txt为数据
    static parseText(text:string){
        var tempDatas = text.split('\n');
        for (let item of tempDatas) {
            try{
                var datas = item.split('.');
                var data = new PlayerText();
                data.string = datas[1];
                data.num = Number(datas[2]);
                PlayerUIRoot.playerText.push(data);
                //PlayerUIRoot.playerText.push(datas[1]);
            }
            catch(e){
                console.log("某行解析出错：" + e);
            }
        }
    }

    //更新当前角色名字显示
    updateCurrentName(){
        var array:cc.Node[];
        if(this.haveNode.active){
            array = PlayerUIRoot.haveNodes;
        }else{
            array = PlayerUIRoot.buyNodes;
        }
        for(let item of array){
            if(item.getComponent(cc.Toggle).isChecked){
                this.currentSelectName.string = PlayerUIRoot.playerText[Number(item.name)].string;
                return;
            }
        }
    }
    //更新购买的默认选择
    updateBuyDefaultSelect(){
        if(PlayerUIRoot.buyNodes.length > 0){
            PlayerUIRoot.buyNodes[0].getComponent(cc.Toggle).isChecked = true;
            this.currentSelectName.string = PlayerUIRoot.playerText[Number(PlayerUIRoot.buyNodes[0].name)].string;
        }
    }
    //更新已有的默认选择
    updateHaveDefaultSelect(){
        let num = GameManager.getSelectNum();
        if(PlayerUIRoot.haveNodes.length > 0){
            for (let index = 0; index < PlayerUIRoot.haveNodes.length; index++) {
                if(num == index){
                    PlayerUIRoot.haveNodes[index].getComponent(cc.Toggle).isChecked = true;
                    this.currentSelectName.string = PlayerUIRoot.playerText[Number(PlayerUIRoot.haveNodes[index].name)].string;
                }
            }
        }
    }
    //更新金币显示
    updateGold(){
        // console.log(GameManager.getGold());
        // console.log(GameManager.getGold().toFixed(0));
        this.currentGold.string = GameManager.getGold().toFixed(0);
    }

    onDestroy(){
        //cc.loader.releaseResDir("Player/");
    }
    //返回
    OnBackClick(){
        this.node.active = false;
    }
    //购买
    OnBuyClick(){
        this.buyNode.active = true;
        this.haveNode.active = false;
        this.updateBuyDefaultSelect();
        //此处第一次打开需要稍微延迟才能反应过来
        this.scheduleOnce(function() {
            this.updateBuyDefaultSelect();
        }, 0.1);
    }
    //购买返回
    OnBuyBackClick(){
        this.buyNode.active = false;
        this.haveNode.active = true;

        var currentNum = GameManager.getSelectNum();
        if(PlayerUIRoot.haveNodes.length > 0){
            for(let item of PlayerUIRoot.haveNodes){
                if(Number(item.name) == currentNum){
                    item.getComponent(cc.Toggle).isChecked = true;
                    this.currentSelectName.string = PlayerUIRoot.playerText[currentNum].string;
                    return;
                }
            }
        }
    }
    //选择角色
    OnHaveSelectOkClick(){
        if(PlayerUIRoot.haveNodes.length > 0){
            for(let item of PlayerUIRoot.haveNodes){
                if(item.getComponent(cc.Toggle).isChecked){
                    let num = Number(item.name);
                    GameManager.setSelectNum(num);
                    //设置角色完毕 返回主界面
                    this.OnBackClick();
                    console.log("成功选择角色 : " + num);
                    return;
                }
            }
        }
        this.onShowLog("竟然没有选择...");
    }
    //购买完成
    OnBuyOkClick(){
        var gold = GameManager.getGold();

        for(let item of PlayerUIRoot.buyNodes){
            if(!item.getComponent(cc.Toggle).isChecked)continue;
            let num = Number(item.name);
            let player = PlayerUIRoot.playerText[num];
            if (gold < player.num){
                this.onShowLog("您的金钱不足以购买" + player.string);
            }else{
                //购买成功！

                //扣掉金钱
                GameManager.setGold(gold - player.num);
                //添加进拥有列表
                GameManager.addHaveNums(num);
                this.onShowLog("购买成功");

                //清除list 重新加载
                this.clearPlayerNodes();
                this.localStartInstance();

                //更新购买的默认选择
                this.updateBuyDefaultSelect();
                //更新金币
                this.updateGold();
                //更新当前名字显示
                this.updateCurrentName();
            }
            return;
        }
        this.onShowLog("竟然没有选择...");
    }

    onShowLog(text:string){
        console.log(text);
        this.unscheduleAllCallbacks();
        this.log.string = text;
        this.log.node.active = true;
        this.scheduleOnce(function() {
            this.log.node.active = false;
            // 这里的 this 指向 component
        }, 2);
    }
}
