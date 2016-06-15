cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // 申明组标记
        grpNum: 0
        ,
        
        webSock: null
        ,
        
        directory: {
            default: null,
            type: cc.Object,
        },
        
        labelButton: {
            default: null,
            type: cc.Prefab,
        },
        
        talkLabel: {
            default: null,
            type: cc.Prefab,
        },
        
        mon0: {
            default: null,
            type: cc.Prefab,
        },
        
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
        }
    },

    // use this for initialization
    onLoad: function () {
        
        
    },
    
    // 获得Choice组件
    getChoice: function(type)
    {
        var btpanel = this.choicePanel;
        btpanel.active=true;
        var label = this.choiceLabel;
        switch(type)
        {
            case 1:
                label.color=new cc.Color(255, 255, 255);
                label.getComponent(cc.Label).string="继续地下城冒险吗？";
            break;
                
            case 2:
                label.color=new cc.Color(255, 255, 255);
                var callback = new cc.CallFunc(function(){
                    btpanel.active = true;
                    label.getComponent(cc.Label).string="要将怪物送入地下城吗？";
                },this);
                btpanel.runAction(cc.sequence(cc.delayTime(0.31), callback, cc.fadeIn(.3)));
                return btpanel;
            
            case 3:
                label.color=new cc.Color(255,255,0);
                label.getComponent(cc.Label).string="游戏结束，挑战成功！";
            break;
            
            case 4:
                label.color=new cc.Color(255,0,0);
                label.getComponent(cc.Label).string="游戏结束，挑战失败！";
            break;
        }
        btpanel.runAction(cc.fadeIn(.3));
        return btpanel;
    },
    
    // 获得swordChoice
    getSwordChoice: function()
    {
        var sChoice = this.sChoice;
        sChoice.active=true;
        sChoice.runAction(cc.fadeIn(.3));
        return sChoice;
    },
    
    // 获取战斗面板
    getBattlePanel: function()
    {
        var btpanel = this.battlePanel;
        btpanel.show();
        return btpanel;
    },
    
    // 增加聊天框文字
    insertTalk: function(str)
    {
        var content = this.talkContent;
        var talkView = this.talkView;
        var newLabel = cc.instantiate(this.talkLabel);
        var label = newLabel.getComponent(cc.Label);
        var blank = cc.instantiate(this.talkLabel);
        blank.getComponent(cc.Label).string = "\n";
        
        // 当插入文字为系统消息时改变文本颜色
        if(str.indexOf("System: ") === 0)
        {
            newLabel.color = new cc.Color(255, 0, 0);
        }
        else if(str.indexOf('战报！') === 0)
        {
            newLabel.color = new cc.Color(255, 255, 0);
        }
        
        label.string = decodeURI(str);
        content.removeChildByTag(213);
        content.addChild(newLabel);
        content.addChild(blank, 1, 213);
        // 文字插入时自动滚到最下方
        if(talkView.node.height <= content.height)
        {
            talkView.schedule(function() {
               talkView.scrollToBottom(0.5);
            },0.2,1);
        }
    },
    
    // 取得怪物卡
    getMon: function(type)
    {
        let mon = this.node.getChildByName('mon');
        if(mon !== null && mon !== undefined)
            return mon;
        
        var monster = cc.instantiate(this['mon'+type]);
        monster.parent=this.node;
        monster.name = 'mon';
        monster.setPosition(-210,-30);
        return monster;
    },
    
    // 丢弃怪物卡
    pass: function(mon)
    {
        var act1=cc.moveTo(.3, cc.p(695,-100));
        var callback = new cc.CallFunc(function(){
            mon.removeFromParent();
        },this);
        var seq = cc.sequence(act1, callback);
        mon.runAction(seq);
    },
    
    // 选择怪物卡
    choose: function(mon)
    {
        var act1=cc.moveTo(.3, cc.p(-120,-80));
        var act2=cc.fadeOut(.3);
        var callback = new cc.CallFunc(function(){
            mon.removeFromParent();
        },this);
        var seq = cc.sequence(cc.spawn(act1,act2), callback);
        mon.runAction(seq);
    },
    
    // 丢弃装备卡
    discard: function(num)
    {
        this.items1.getChildByName('item'+num).active = false;
        this.items2.getChildByName('item'+num).active = false;
        this.items3.getChildByName('item'+num).active = false;
        this.items4.getChildByName('item'+num).active = false;
        /*var act1=cc.fadeOut(0.3);
        var callback = new cc.CallFunc(function(){
            mon.removeFromParent();
        },this);*/
    },
    
    // 加载配置文件和swordChoice
    loadDir: function(self)
    {
        // 读取配置文件
        var labelButton=self.labelButton;
        var buttons1 = self.swordButtons1;
        var buttons2 = self.swordButtons2;
        
        cc.loader.load(cc.url.raw('resources/directory.json'), function(err, result) 
        {
                
          // 读取成功，err为null，读取失败才会有错误信息：err:{‘status':0,’errorMessage’:’….'}
            if(err !== null)
            {
                console.log("Load text error happened!");
                return;
            }
            let json = result;
            self.directory = json;
            
            // 读取完配置文件后加载swordChoice
            for(var i=0;i<4;i++)
            {
                let lbt;
                lbt = cc.instantiate(labelButton);
                lbt.parent=buttons1;
                lbt.name = 'm'+(i+1);
                lbt.getComponent(cc.Label).string=self.directory.monsterName['m'+(i+1)];
                lbt.on(cc.Node.EventType.TOUCH_END, function (event) {
                    let submit = '{"cmd":"swordChoice","data":"'+lbt.name.substr(1,1)+'","from":"'+self.grpNum+'"}';
                    cc.log(submit);
                    self.webSock.send(submit);
                    self.insertTalk('战报！ 斩首剑斩杀了'+self.monName(lbt.name.substr(1,1))+'！');
                });
            }
                
            for(i=0;i<4;i++)
            {
                let lbt;
                lbt = cc.instantiate(labelButton);
                lbt.parent = buttons2;
                lbt.name = 'm'+((i===3?4:i)+5);
                lbt.getComponent(cc.Label).string=self.directory.monsterName['m'+((i===3?4:i)+5)];
                lbt.on(cc.Node.EventType.TOUCH_END, function (event) {
                    let submit = '{"cmd":"swordChoice","data":"'+lbt.name.substr(1,1)+'","from":"'+self.grpNum+'"}';
                    cc.log(submit);
                    self.webSock.send(submit);
                });
            }
        });
    },
    
    // 让组件渐隐后不活动
    hide: function(item)
    {
        if(!item.active)
            return false;
        var act1=cc.fadeOut(.3);
        var callback = new cc.CallFunc(function(){
            item.active = false;
        },this);
        var seq = cc.sequence(act1, callback);
        item.runAction(seq);
    },
    
    // 获得怪物名字
    monName: function(id)
    {
        switch(Number(id))
        {
            case 1:
            return '哥布林';
            
            case 2:
            return '骷髅兵';
            
            case 3:
            return '兽人';
            
            case 4:
            return '吸血鬼';
            
            case 5:
            return '魔像';
            
            case 6:
            return '巫妖';
            
            case 7:
            return '恶魔';
            
            case 9:
            return '巨龙';
        }
        return '未知生物';
    },
    
    // 重置场景，准备重新开始游戏
    restart: function(){
        for(var i=1;i<7;i++)
        {
            this.items1.getChildByName('item'+i).active = true;
            this.items2.getChildByName('item'+i).active = true;
            this.items3.getChildByName('item'+i).active = true;
            this.items4.getChildByName('item'+i).active = true;
        }
    },
    
    // 防止xss注入函数。不过貌似引擎内部已经定义了类似的东西用不到了^_^
	escapeHtml: function(string) 
	{
	    var entityMap = {
		    "&": "&amp;",
		    "<": "&lt;",
		    ">": "&gt;",
		    '"': '&quot;',
		    "'": '&#39;',
		    "/": '&#x2F;'
		  };
	    
	    return String(string).replace(/[&<>"'\/]/g, function (s) {
		  return entityMap[s];
		});
	},
});
