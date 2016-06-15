cc.Class({
    extends: cc.Component,

    properties: {
        
        mon1: {
            default: null,
            type: cc.Prefab,
        },
        
        mon2: {
            default: null,
            type: cc.Prefab,
        },
        
        mon3: {
            default: null,
            type: cc.Prefab,
        },
        
        mon4: {
            default: null,
            type: cc.Prefab,
        },
        
        mon5: {
            default: null,
            type: cc.Prefab,
        },
        
        mon6: {
            default: null,
            type: cc.Prefab,
        },
        
        mon7: {
            default: null,
            type: cc.Prefab,
        },
        
        mon9: {
            default: null,
            type: cc.Prefab,
        },
        
        hero: {
            default: null,
            type: cc.Prefab,
        },
        
        beat: {
            default: null,
            type: cc.Prefab,
        },
        
        HP: 0
    },

    // use this for initialization
    onLoad: function () {

        var hero = cc.instantiate(this.hero);
        hero.parent=this.node;
        hero.Opacity=0;
        hero.runAction(cc.fadeIn(0.3));
        hero.width *=2.1;hero.height *=2.1;
        hero.setPosition(220,17);
        
        var hp = new cc.Node("hp");
        hp.addComponent(cc.Label);
        let label = hp.getComponent(cc.Label);
        label.string = "hp: ";
        label.fontSize = 20;
        hp.parent = this.node;
        hp.setPosition(220,-65);
        hp.zIndex = 2;
    },
    
    setHP: function(num){
        this.HP = num;
        
        var hp = cc.find("hp",this.node);
        let label = hp.getComponent(cc.Label);
        label.string = "hp: " + num;
    },
    
    harm:function(num)
    {
        // 修改hp
        this.HP -= num;
        // 改变hp文本
        var hp = cc.find("hp",this.node);
        let label = hp.getComponent(cc.Label);
        label.string = "hp: " + this.HP;
        // 创建伤害文本
        var harm = new cc.Node("harm");
        harm.addComponent(cc.Label);
        label = harm.getComponent(cc.Label);
        label.string = num;
        label.fontSize = 40;
        // /label.font = cc.Font.;
        harm.parent = this.node;
        harm.setPosition(260,-80);
        harm.zIndex = 6;
        harm.color = new cc.Color(255, 0, 0);
        harm.opacity = 0;
        // 启动动作
        let act1=cc.fadeIn(0.2);
        let act2=cc.fadeOut(0.2);
        let act3=cc.moveBy(0.6, cc.p(0, 200));
        var callback = new cc.CallFunc(function(){
           harm.removeFromParent();
        },this);
        var seq = cc.sequence(act1, cc.delayTime(0.2), act2, callback);
        var spawn = cc.spawn(seq, act3);
        harm.runAction(spawn);
    },
    
    showMon: function(type)
    {
        var monster = cc.instantiate(this['mon'+type]);
        monster.parent=this.node;
        monster.Opacity=0;
        monster.runAction(cc.fadeIn(.3));
        monster.width *=2.1;monster.height *=2.1;
        monster.setPosition(-220,17);
        return monster;
    },
    
    hideMon: function(monster)
    {
        let act1=cc.fadeOut(.3);
        var callback = new cc.CallFunc(function(){
            monster.removeFromParent();
        },this);
        var seq = cc.sequence(act1, callback);
        monster.runAction(seq);
    },
    
    beatLeft: function()
    {
        let act1=cc.fadeIn(.15);
        let act2=cc.moveTo(.3, cc.p(0,-200));
        let act3=cc.fadeOut(.15);
        var seq=cc.sequence(act1,act3);
        var spawn=cc.spawn(act2,seq);
        
        var beat = cc.instantiate(this.beat);
        beat.parent=this.node;
        beat.opacity=0;
        beat.setPosition(-370,200);
        beat.zIndex=5;
        beat.runAction(spawn);
    },
    
    beatRight: function()
    {
        let act1=cc.fadeIn(.15);
        let act2=cc.moveTo(.3, cc.p(370,-200));
        let act3=cc.fadeOut(.15);
        var seq=cc.sequence(act1,act3);
        var spawn=cc.spawn(act2,seq);
        
        var beat = cc.instantiate(this.beat);
        beat.parent=this.node;
        beat.opacity=0;
        beat.setPosition(0,200);
        beat.zIndex=5;
        beat.runAction(spawn);
    },
    
    show: function()
    {
        if(this.node.active)
            return;
        this.node.active=true;
        this.node.runAction(cc.fadeIn(.3));
    },
    
    hide: function()
    {
        let act1=cc.fadeOut(1.5);
        var callback = new cc.CallFunc(function(){
            this.node.active = false;
        },this);
        var seq = cc.sequence(act1, callback);
        this.node.runAction(seq);
    }
});
