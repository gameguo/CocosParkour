//地图移动

import GameManager from "../Manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapMove extends cc.Component 
{
    public static Instance:MapMove;
    //所有子对象
    private children:cc.Node[];
    //所有子对象的初始位置
    private childrenPos:cc.Vec3[];

    //x增量 通过地面数量计算得到
    private addNum:number;
    //地面移动速度
    @property({
        type :cc.Float,
        displayName: "地面基础速度"
    })
    public moveSpeed: number = 200;

    //真实使用的speed
    public trueSpeed: number;

    //重置与update委托
    public resetCallBacks:Function[] = [];
    public onUpdates:Function[] = [];
    

    //缓存变量
    private tempPos:cc.Vec3;
    private tempNode:cc.Node;

    isStop:boolean = false;

    public setIsStop(stop){
        this.isStop = stop;
    }

    onLoad () { 
        MapMove.Instance = this; 
        this.trueSpeed = this.moveSpeed;
        //设置游戏难度
        let dif = GameManager.getDifficulty();
        if(dif != 0){
            this.trueSpeed += (this.moveSpeed * dif * 0.5);
        }
        this.setIsStop(true);
    }
    start () 
    {
        this.children = this.node.children;
        this.addNum = (this.children.length - 1) * 1280;
        this.childrenPos = [];
        for (let index = 0; index < this.children.length; index++) {
            this.childrenPos.push(this.children[index].position);
        }
    }

    public Reset(){
        for (let index = 0; index < this.children.length; index++) {
            this.children[index].position = this.childrenPos[index];
        }
        this.setIsStop(true);
        for (const item of this.resetCallBacks) {
            if(item != null)item();
        }
    }

    update (dt) 
    {
        if(this.isStop){
            return;
        }
        for(this.tempNode of this.children)
        {
            this.tempPos = this.tempNode.position;
            this.tempPos.x -= this.trueSpeed * dt;
            if(this.tempPos.x < -1280)
            {
                this.tempPos.x += this.addNum;
                //console.log("换图:" + this.tempPos.x);
            }
            this.tempNode.position = this.tempPos;
        }
        for (const item of this.onUpdates) {
            if(item != null)item(this.trueSpeed * dt);
        }
    }


}
