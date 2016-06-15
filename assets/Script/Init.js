//加载脚本文件
var sys = require("sys");
require("BattlePanel");
cc.Class({
    
    extends: sys,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        
        // 组件引用
        this.canvasScript = cc.find('Canvas').getComponent('Init'); 
        this.choicePanel = cc.find('Canvas/Choice');
        this.choiceLabel = cc.find('Canvas/Choice/label'); 
        this.sChoice = cc.find('swordChoice', this.node);
        this.talkContent = cc.find('Canvas/talkPanel/view/content');
        this.talkView = cc.find('Canvas/talkPanel').getComponent(cc.ScrollView);
        this.inputPanel = cc.find('Canvas/inputPanel');
        this.inputHolder = cc.find('holder', this.inputPanel)
        this.editBox = cc.find('EditBox', this.inputPanel).getComponent(cc.EditBox);
        this.battlePanel = cc.find('Canvas/BattlePanel').getComponent('BattlePanel');
        this.swordButtons1 = cc.find('swordChoice/buttons1', this.node);
        this.swordButtons2 = cc.find('swordChoice/buttons2', this.node);
        this.myItems = cc.find('items1', this.node);
        this.items1 = cc.find('items1', this.node);
        this.items2 = cc.find('items2', this.node);
        this.items3 = cc.find('items3', this.node);
        this.items4 = cc.find('items4', this.node);
        // 将talkpanel置于顶层
        cc.find('Canvas/talkPanel').zIndex = 2;
        // 将输入框置于顶层
        this.inputPanel.zIndex = 2;
        this.editBox.node.zIndex = 1;
        
        // if it's mobile
        //设置输入框在inputpanel被单击时才能输入
        // this.editBox.enabled = false;
        // var callback=this.inputHolder.on(cc.Node.EventType.TOUCH_END, function(event){
        //     this.editBox.enabled = true;
        //     this.inputHolder.off(cc.Node.EventType.TOUCH_END, callback, this);
        // }, this);
        
        // 加载配置文件
        this.loadDir(this);
        
        // 创建websocket对象
        var ws = new WebSocket("ws://ServerIP");
        this.webSock = ws;
        // 设置自身指针
        var self=this;
        // 声明变量
        var panel = null;
        var btpanel = null;
        var submit = null;
        // 设置回调函数侦听
        ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
            ws.send(str);
        };
        ws.onmessage = function (event) {
            var data = JSON.parse(event.data);
            console.log("serversend: cmd: " + data.cmd + ' data: ' + data.data + ' to: ' + data.to);
            
            switch(data.cmd)
            {
                case "login":
                    self.grpNum = data.data;
                    break;
                case "battle choice":
                    cc.log('System: '+data.to+'号的回合开始');
                    self.insertTalk('System: '+data.to+'号的回合开始');
                    if(data.to==self.grpNum)
                        panel = self.getChoice(1);
                    
                    break;
                case "monster choice":
                    let mon;
                    if(data.to==self.grpNum)
                    {
                        panel = self.getChoice(2);
                        mon = self.getMon(data.data);
                    }else
                        mon = self.getMon(0);
                    
                    break;
                case "monster choosed":
                    cc.log("System: 怪物被送入地下城");
                    self.insertTalk("System: 怪物被送入地下城");
                    mon = self.getMon(0);
                    self.choose(mon);
                    if(data.to==self.grpNum)
                        self.hide(panel);
                    
                    break;
                case "finish":
                    cc.log('System: '+data.to+'号的回合结束');
                    self.insertTalk('System: '+data.to+'号的回合结束');
                    if(data.to==self.grpNum)
                    {
                        submit='{"cmd":"next","data":"","from":"'+self.grpNum+'"}';
                        cc.log(submit);
                        ws.send(submit);
                    }
                
                    break;
                case "finished":
                    cc.log("System: " + data.data + "号  认怂了");
                    self.insertTalk("System: " + data.data + "号 认怂了");
                    break;
                case "discard":
                    mon = self.getMon(0);
                    self.pass(mon);
                    if(data.to==self.grpNum)
                    {
                        cc.log("System: 请选择一张装备卡丢弃");
                        self.insertTalk("System: 请选择一张装备卡丢弃");
                        let items = self.myItems;
                        items.getComponent('eventHandle').itemCanDiscard = true;
                    }
                    
                    break;
                case "discarded":
                    cc.log("System: 一张装备卡被丢弃");
                    self.insertTalk("System: 一张装备卡被丢弃");
                    // 丢弃装备卡
                    self.discard(data.data);
                    break;
                case "prepare item":
                    if(data.to==self.grpNum)
                    {
                        switch(data.data)
                        {
                            case '1':
				                break;
                			case '5':
                				break;
                			case '6':
                				let choice = self.getSwordChoice();
                				break;
                        }
                    }
                    
                    break;
                case "prepare ok":
                    self.hide(self.sChoice);
                    self.insertTalk('战报！ '+data.to+'号勇者进入了地下城！');
                    btpanel = self.getBattlePanel();
                    btpanel.setHP(data.data);
                    if(data.to==self.grpNum)
                    {
                       submit='{"cmd":"prepare ok","data":"","from":"'+self.grpNum+'"}';
                       cc.log(submit);
                       ws.send(submit);
                    }
                    
                    break;
                case "monster atk":
                    btpanel = self.getBattlePanel();
                    btpanel.showMon(data.data);
                    self.insertTalk('战报！ '+self.monName(data.data)+'出现了！');
                    
                    break;
                case "battle harm":
                    btpanel = self.getBattlePanel();
                    btpanel.beatLeft();
                    btpanel.beatRight();
                    btpanel.harm(data.data);
                    self.insertTalk('战报！ '+data.to+'号勇者受到了'+data.data+'点伤害！(剩余HP:'+btpanel.HP+')');
                    
                    break;
                case "win":
                    btpanel = self.getBattlePanel();cc.log(btpanel);
                    //btpanel.node.removeAllChildren();
                    btpanel.hide();
                    self.insertTalk('战报！ 勇者通关了地下城！ 游戏结束，'+data.to+'号勇者不愧是纯爷们！\n\r\n\r');
                    // 发送重新开始信息到服务器
                    if(data.to==self.grpNum){
                        submit='{"cmd":"restart","data":"","from":"'+self.grpNum+'"}';
                        cc.log(submit);
                        ws.send(submit);
                    }
                    self.restart();
                    self.insertTalk('System: 游戏再次开始');
                    break;
                case "lose":
                    btpanel = self.getBattlePanel();cc.log(btpanel);
                    btpanel.hide();
                    self.insertTalk('战报！ 勇者被打败了！ 游戏结束，'+data.to+'号装b失败！\n\r\n\r');
                    // 发送重新开始信息到服务器
                    if(data.to==self.grpNum){
                        submit='{"cmd":"restart","data":"","from":"'+self.grpNum+'"}';
                        cc.log(submit);
                        ws.send(submit);
                    }
                    self.restart();
                    self.insertTalk('System: 游戏再次开始');
                    
                    break;
                case "talk":
                    self.insertTalk(data.data);
                    break;
            }
            
        };
        ws.onerror = function (event) {
        console.log("Send Text fired an error");
        };
        ws.onclose = function (event) {
        console.log("WebSocket instance closed.");
        };
        var str='{"cmd":"login","data":"","to":""}';
       
    },

    // called every frame
    update: function (dt) {

    },
    
    
});
