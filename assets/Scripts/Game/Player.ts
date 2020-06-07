//角色

import GameManager from "../Manager/GameManager";
import Gold from "./Gold";
import AudioManager, { AudioType } from "../Manager/AudioManager";
//import Controller from "./Controller";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    public static Instance:Player;

    private static sprites:cc.SpriteFrame[] = null;
    private static currentSpriteID:number;

    private num:number = 0;

    private isPlay:boolean = false;

    //是否在地面
    private isGround:boolean = false;

    private initPos:cc.Vec3 = null;

    //动画速度/s
    @property({
        type: cc.Float,
        displayName:"动画速度/s"
    })
    speed:number = 0.15;

    private sprite:cc.Sprite = null;

    private rig:cc.RigidBody = null;

    //我的碰撞器宽度
    public myBoxWidth:number;

    onLoad () {
        //初值初始化
        Player.Instance = this;
        this.isPlay = false;
        this.isGround = false;
        this.initPos = this.node.position;

        //设置刚体静态
        this.rig = this.node.getComponent(cc.RigidBody);
        this.rig.type = cc.RigidBodyType.Kinematic;

        //当前Player的碰撞器的宽度
        this.myBoxWidth = this.getComponent(cc.BoxCollider).size.width;
        

        //物理组件开启
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        //获取当前角色ID 并加载角色Sprite资源
        this.num = GameManager.getSelectNum();
        this.sprite = this.node.getChildByName("Sprite").getComponent(cc.Sprite);
        if(this.num == Player.currentSpriteID && Player.sprites != null){
            this.sprite.spriteFrame = Player.sprites[0];
            return;
        }
        cc.loader.loadRes("Player/" + this.num + "/0", cc.SpriteAtlas,(err, atlas) => {
            if(err != null){
                console.log("Player图片资源加载失败：" + err);
                return;
            }
            Player.currentSpriteID = this.num;
            Player.sprites = atlas.getSpriteFrames();
            this.sprite.spriteFrame = Player.sprites[0];
        });
    }
    onDestroy(){
        //cc.loader.releaseRes("Player/" + this.num + "/0");
    }
    //游戏开始时需要做的
    onPlay(){
        this.isPlay = true;
        if(Player.sprites != null){
            this.onAnim(0);
            this.rig.type = cc.RigidBodyType.Dynamic;
            //console.log(this.rig.type);
        }
    }
    //游戏暂停时需要做的
    onPause(){
        this.isPlay = false;
        this.rig.type = cc.RigidBodyType.Kinematic;
        this.rig.linearVelocity = cc.Vec2.ZERO;
        this.rig.angularVelocity = 0;
        if(Player.sprites != null){
            this.sprite.spriteFrame = Player.sprites[0];
        }
        this.node.position = this.initPos;
        //console.log(this.rig.type);
    }

    //播放Player的序列帧动画
    onAnim(index){
        //是否停止播放动画
        if(!this.isPlay){
            return;
        }
        //图片是否切换
        if (this.isGround){
            if(index >= Player.sprites.length)index = 0;
            this.sprite.spriteFrame = Player.sprites[index];
            this.scheduleOnce(function(){
                this.onAnim(index + 1);
            }, this.speed);
        }else{
            index = 0;
            this.sprite.spriteFrame = Player.sprites[1];
            this.scheduleOnce(function(){
                this.onAnim(index);
            }, this.speed);
        }
    }

    //碰撞监听
    onCollisionEnter(other, self){
        if(other.node.group == "GameOver"){
            GameManager.gameOver();
        }else if(other.node.group == "GroundOver"){
            //进入地形边缘地带
            this.setGround(false);
            console.log("进入地形边缘：" + other.node.parent.name);
            this.setY(this.rig.linearVelocity.y - 1);
        }else if(other.node.group == "Gold"){
            //吃到金币
            //增加分数
            GameManager.setScore(GameManager.getScore() + GameManager.oneGoldScore);
            //销毁金币
            other.node.getComponent(Gold).GoldDestory();
        }
    }

    // 物体碰撞监听 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider){
        if(otherCollider.node.group == "Ground"){

            var worldManifold = contact.getWorldManifold();
            // var points = worldManifold.points;
            var normal = worldManifold.normal;

            //console.log(normal);
            //当落到地面时normal (0,-1,0)
            //当碰撞点不是地面时 (1,0,0)


            //此时 没有向上的作用力
            //将不算做落在地面
            if(normal.y >= 0){
                console.log("碰撞到了没有向上的方向：" + normal);
                return;
            }
            //console.log("进入地面");
            this.setGround(true);
        }
    }

    //设置角色是否在地面上
    setGround(isGround){
        if(isGround != this.isGround){
            this.isGround = isGround;
            this.sprite.spriteFrame = Player.sprites[isGround? 0:1];
        }
    }

    //跳
    onJump(){
        if(this.isGround){
            //跳跃
            this.setY(500);
            this.rig.gravityScale = 2;
            this.setGround(false);


            //此处调用声音
            AudioManager.PlayEffect(AudioType.jump);
        }
    }

    //设置刚体Y轴速度
    setY(y){
        let v = this.rig.linearVelocity;
        v.y = y;
        this.rig.linearVelocity = v;
    }

    //判断偏离起点
    update(dt){
        if(this.node.position.x < this.initPos.x){
            //偏离了起点
            let tempPos = this.node.position;
            tempPos.x = cc.misc.lerp(this.node.position.x, this.initPos.x, dt * 2);
            this.node.position = tempPos;
        }
    }
}
