//关于

const {ccclass, property} = cc._decorator;

@ccclass
export default class AboutUIRoot extends cc.Component {

    static Instance:AboutUIRoot;
    @property(cc.Button)
    backBtn: cc.Button = null;

    @property(cc.Label)
    label: cc.Label = null;
    
    static text:cc.TextAsset = null;
    onLoad(){ AboutUIRoot.Instance = this;}

    start () {
        this.backBtn.node.on('click', this.OnBackClick, this);
    }

    static setLabel(){
        if(AboutUIRoot.Instance != null){
            AboutUIRoot.Instance.label.string = AboutUIRoot.text.text;
        }
    }

    onEnable(){
        if(AboutUIRoot.text != null){
            AboutUIRoot.setLabel();
            return;
        }
        // 加载 Text
        cc.loader.loadRes("about", function (err, file) {
            if(err == null){
                console.log("资源加载成功：" + file.text);
                AboutUIRoot.text = file;
                AboutUIRoot.setLabel();
            }else{
                console.log("资源加载失败：" + err);
            }
        });
    }
    onDestroy(){
        //cc.loader.releaseRes("about");
    }
    OnBackClick(){
        this.node.active = false;
    }
}
