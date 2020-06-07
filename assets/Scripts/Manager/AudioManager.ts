//声音管理

const { ccclass, property } = cc._decorator;

//所有声音名称枚举
export enum AudioType{
    none = 0,
    jump = 1,
    gold = 2,
    die = 3,
};

@ccclass("M_AudioType")
export class M_AudioType {

    @property({
        type :cc.Enum(AudioType),
        displayName: "音频类型"
    })
    audioType:AudioType = AudioType.none;
    @property({
        type :cc.AudioClip,
        displayName: "音频Clip"
    })
    clip:cc.AudioClip = null;
}

@ccclass
export default class AudioManager extends cc.Component {

    //单例
    public static Instance: AudioManager = null;

    //所有声音组件的字典
    @property(M_AudioType)
    audioClips: M_AudioType[] = [];

    onLoad(){
        AudioManager.Instance = this;
    }
    public static PlayEffect(type: AudioType) {
        if (AudioManager.Instance == null) return;
        if(AudioManager.Instance.audioClips == null || AudioManager.Instance.audioClips.length <= 0)return;

        for (let item of AudioManager.Instance.audioClips) 
        {
            if(item.audioType == type){
                cc.audioEngine.playEffect(item.clip, false);
                return;
            }
        }
    }

}
