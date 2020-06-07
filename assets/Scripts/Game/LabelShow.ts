//控制提示字体动画
const {ccclass, property} = cc._decorator;

@ccclass
export default class LabelShow extends cc.Component 
{
    // 旧版Action 已弃用
    // fadeIn = cc.fadeIn(1.0);//渐显
    // fadeOut = cc.fadeOut(1.0);//渐隐效果
    // action = cc.tintTo(2, 255, 0, 255);//修改颜色到指定值
    // action = cc.fadeTo(1.0, 0);//修改透明度到指定值
    start () {
        this.onFadeOut();
    }

    onFadein(){
        cc.tween(this.node).to(1, {opacity: 255}).start();
        //this.node.runAction(this.fadeIn);
        this.scheduleOnce(this.onFadeOut, 1.0);
    }

    onFadeOut(){
        cc.tween(this.node).to(1, {opacity: 0}).start();
        //this.node.runAction(this.fadeOut);
        this.scheduleOnce(this.onFadein, 1.0);
    }
}
