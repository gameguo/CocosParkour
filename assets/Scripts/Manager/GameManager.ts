import GameUIRoot from "../Game/GameUIRoot";
import MapMove from "../Game/MapMove";
import Controller from "../Game/Controller";
import AudioManager, { AudioType } from "./AudioManager";

//GameManager

// const {ccclass, property} = cc._decorator;

//@ccclass
export default class GameManager
{
    private static score:number = 0;

    //游戏是否开始
    private static IsPlay:boolean = false;

    //吃一个金币能得到的分数
    public static oneGoldScore:number = 2;

    //获取当前的分数
    public static getScore(){
        return GameManager.score;
    }
    //设置当前分数
    public static setScore(sc:number){
        GameManager.score = sc;
        if(GameUIRoot.Instance == null)return;
        GameUIRoot.Instance.setScore(sc);
    }

    //保存分数
    public static onScoreSave(){
        let num = GameManager.getScore();
        if(num != 0){
            //分数增加
            GameManager.setGold(GameManager.getGold() + num);
        }
    }
    public static gameOver(){
        GameManager.onScoreSave();
        GameManager.IsPlay = false;
        if(GameUIRoot.Instance!=null)GameUIRoot.Instance.onGameOver();
        cc.director.pause();
        GameManager.setScore(0);

        //此处调用声音
        AudioManager.PlayEffect(AudioType.die);
        console.log("GameOver");
    }

    //重置游戏
    public static resetPlay(){
        GameManager.setScore(0);
        if(MapMove.Instance!=null)MapMove.Instance.Reset();
        if(Controller.Instance!=null)Controller.Instance.onReset();
        cc.director.resume();
    }

    //设置游戏状态
    public static setIsPlay(play){
        GameManager.IsPlay = play;
        if(play){
            cc.director.resume();
        }
        else{
            cc.director.pause();
        }
    }
    //获取游戏状态
    public static getIsPlay(){
        return GameManager.IsPlay;
    }

    //
    //--------------------数据------------------------
    //

    //难度存储数据
    private static difficultyData:number;
    public static getDifficulty(){
        GameManager.difficultyData = Number(cc.sys.localStorage.getItem("Difficulty"));
        if(GameManager.difficultyData == null){
            GameManager.setDifficulty(2);
        }
        // console.log(GameManager.difficultyData);
        return GameManager.difficultyData;
    }
    public static setDifficulty(diffculty:number){
        GameManager.difficultyData = diffculty;
        cc.sys.localStorage.setItem("Difficulty", diffculty);
    }

    //全屏点击功能
    private static fullJump:number;
    public static getFullJump(){
        GameManager.fullJump = Number(cc.sys.localStorage.getItem("FullJump"));
        if(GameManager.fullJump == null){
            GameManager.setFullJump(false);
        }
        // console.log(GameManager.difficultyData);
        return GameManager.fullJump == 1;
    }
    public static setFullJump(fullJump:boolean){
        GameManager.fullJump = fullJump? 1:0;
        cc.sys.localStorage.setItem("FullJump", GameManager.fullJump);
    }

    //金币存储数据
    private static goldData:number;
    public static getGold(){
        GameManager.goldData = Number(cc.sys.localStorage.getItem("Gold"));
        if(GameManager.goldData == null){
            GameManager.setGold(0);
        }
        // console.log(GameManager.goldData);
        return GameManager.goldData;
    }
    public static setGold(gold:number){
        GameManager.goldData = gold;
        cc.sys.localStorage.setItem("Gold", GameManager.goldData);
    }

    //已拥有角色存储数据
    private static haveNumsData:number[];
    public static getHaveNums(){
        GameManager.haveNumsData = JSON.parse(cc.sys.localStorage.getItem("HaveNums"));
        if(GameManager.haveNumsData == null){
            GameManager.setHaveNums([0]);
        }
        // console.log(GameManager.haveNumsData);
        return GameManager.haveNumsData;
    }
    public static addHaveNums(num:number){
        GameManager.haveNumsData.push(num);
        cc.sys.localStorage.setItem("HaveNums", JSON.stringify(GameManager.haveNumsData));
    }
    public static setHaveNums(nums:number[]){
        GameManager.haveNumsData = nums;
        cc.sys.localStorage.setItem("HaveNums", JSON.stringify(nums));
    }
    
    //当前选择角色存储数据
    private static selectNumData:number;
    public static getSelectNum(){
        GameManager.selectNumData = Number(cc.sys.localStorage.getItem("SelectNum"));
        if(GameManager.selectNumData == null){
            GameManager.setSelectNum(0);
        }
        // console.log(GameManager.selectNumData);
        return GameManager.selectNumData;
    }
    public static setSelectNum(num:number){
        GameManager.selectNumData = num;
        cc.sys.localStorage.setItem("SelectNum", num);
    }
}
