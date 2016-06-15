cc.Class({
    extends: cc.Component,

    properties: {
        itemCanDiscard: false,
        waitingForBtn: 0
    },

    // use this for initialization
    onLoad: function () {
        
        this.canvasScript = cc.find('Canvas').getComponent('Init'); 
        this.choice = cc.find('Canvas/Choice');
        this.choiceLabel = cc.find('Canvas/Choice/label').getComponent(cc.Label); 
        this.talkContent = cc.find('Canvas/talkPanel/view/content');
        this.talkLabel = cc.find('Canvas/talkPanel/view/content/label').getComponent(cc.Label);
        this.editBox = cc.find('Canvas/inputPanel/EditBox').getComponent(cc.EditBox);
        this.item1 = cc.find('item1', this.node);
        this.item2 = cc.find('item2', this.node);
        this.item3 = cc.find('item3', this.node);
        this.item4 = cc.find('item4', this.node);
        this.item5 = cc.find('item5', this.node);
        this.item6 = cc.find('item6', this.node);
        
        this.item1.on(cc.Node.EventType.TOUCH_START, this.addScale, this);
        this.item1.on(cc.Node.EventType.TOUCH_END, this.deleScale, this);
        this.item1.on(cc.Node.EventType.TOUCH_CANCEL, this.deleScale, this);
        
        this.item2.on(cc.Node.EventType.TOUCH_START, this.addScale, this);
        this.item2.on(cc.Node.EventType.TOUCH_END, this.deleScale, this);
        this.item2.on(cc.Node.EventType.TOUCH_CANCEL, this.deleScale, this);
        
        this.item3.on(cc.Node.EventType.TOUCH_START, this.addScale, this);
        this.item3.on(cc.Node.EventType.TOUCH_END, this.deleScale, this);
        this.item3.on(cc.Node.EventType.TOUCH_CANCEL, this.deleScale, this);
        
        this.item4.on(cc.Node.EventType.TOUCH_START, this.addScale, this);
        this.item4.on(cc.Node.EventType.TOUCH_END, this.deleScale, this);
        this.item4.on(cc.Node.EventType.TOUCH_CANCEL, this.deleScale, this);
        
        this.item5.on(cc.Node.EventType.TOUCH_START, this.addScale, this);
        this.item5.on(cc.Node.EventType.TOUCH_END, this.deleScale, this);
        this.item5.on(cc.Node.EventType.TOUCH_CANCEL, this.deleScale, this);
        
        this.item6.on(cc.Node.EventType.TOUCH_START, this.addScale, this);
        this.item6.on(cc.Node.EventType.TOUCH_END, this.deleScale, this);
        this.item6.on(cc.Node.EventType.TOUCH_CANCEL, this.deleScale, this);
            
    },
    
    addScale: function(event){
        
        // if(this.waitingForBtn != 0)
        //     return;
        // this.waitingForBtn=1;
        // this.schedule(function() {
        //        this.waitingForBtn=0;
        //     },0.8,1);
            
        var target = event.currentTarget;
        if(target.scale == 1){
            this.localP = cc.p(target.x, target.y);
            var scaleAction = cc.spawn(cc.scaleTo(0.2, 2), cc.moveBy(0.2, cc.p(0,75)));
            scaleAction.setTag(1);
            target.runAction(scaleAction);
        }
    },
    
    deleScale: function(event){
        var target = event.currentTarget;
        if(target.scale > 1){
            target.stopActionByTag(1);
            target.runAction(cc.spawn(cc.scaleTo(0.2, 1), cc.moveTo(0.2, this.localP)));
        }
    },

    onDisChoose: function(touch, event)
    {
        let label=this.choiceLabel;
        let sys;
        let submit;
        
        if(this.waitingForBtn != 0)
            return;
        this.waitingForBtn=1;
        this.schedule(function() {
               this.waitingForBtn=0;
            },0.8,1);
        
        switch(label.string)
        {
            case "继续地下城冒险吗？":
                sys = this.canvasScript;
                submit='{"cmd":"nobattle","data":"","from":"'+sys.grpNum+'"}';
                cc.log(submit);
                sys.webSock.send(submit);
            break;
                
            case "要将怪物送入地下城吗？":
                sys = this.canvasScript;
                submit='{"cmd":"monster passed","data":"","from":"'+sys.grpNum+'"}';
                cc.log(submit);
                sys.webSock.send(submit);
                let panel = this.choice;
                this.canvasScript.hide(panel);
            return;
            
            case "游戏结束，挑战成功！":
                
            break;
            
            case "游戏结束，挑战失败！":
                
            break;
        }
        let panel = this.choice;
        panel.runAction(cc.fadeOut(0.3));
    },
    
    onChoose: function(touch, event)
    {
        let label=this.choiceLabel;
        let sys;
        let submit;
        
        if(this.waitingForBtn != 0)
            return;
        this.waitingForBtn=1;
        this.schedule(function() {
               this.waitingForBtn=0;
            },0.8,1);
        
        switch(label.string)
        {
            case "继续地下城冒险吗？":
                sys = this.canvasScript;
                submit='{"cmd":"battle","data":"","from":"'+sys.grpNum+'"}';
                cc.log(submit);
                sys.webSock.send(submit);
            break;
                
            case "要将怪物送入地下城吗？":
                sys = this.canvasScript;
                submit='{"cmd":"monster choosed","data":"","from":"'+sys.grpNum+'"}';
                cc.log(submit);
                sys.webSock.send(submit);
                let panel = this.choice;
                this.canvasScript.hide(panel);
            return;
            
            case "游戏结束，挑战成功！":
                
            break;
            
            case "游戏结束，挑战失败！":
                
            break;
        }
        let panel = this.choice;
        panel.runAction(cc.fadeOut(0.3));
    },
    
    onChooseSword: function(touch, event)
    {
        
    },
    
    onItemChoose1: function()
    {
        if(!this.itemCanDiscard)
        return;
        
        this.itemCanDiscard = false;
        var sys = this.canvasScript;
        var target = this.item1;
        target.active = false;
        
        var submit='{"cmd":"discard","data":"'+1+'","from":"'+sys.grpNum+'"}';
        cc.log(submit);
        sys.webSock.send(submit);
    },
    
    onItemChoose2: function()
    {
        if(!this.itemCanDiscard)
        return;
        
        this.itemCanDiscard = false;
        var sys = this.canvasScript;
        var target = this.item2;
        target.active = false;
        
        var submit='{"cmd":"discard","data":"'+2+'","from":"'+sys.grpNum+'"}';
        cc.log(submit);
        sys.webSock.send(submit);
    },
    
    onItemChoose3: function()
    {
        if(!this.itemCanDiscard)
        return;
        
        this.itemCanDiscard = false;
        var sys = this.canvasScript;
        var target = this.item3;
        target.active = false;
        
        var submit='{"cmd":"discard","data":"3","from":"'+sys.grpNum+'"}';
        cc.log(submit);
        sys.webSock.send(submit);
    },
    
    onItemChoose4: function()
    {
        if(!this.itemCanDiscard)
        return;
        
        this.itemCanDiscard = false;
        var sys = this.canvasScript;
        var target = this.item4;
        target.active = false;
        
        var submit='{"cmd":"discard","data":"4","from":"'+sys.grpNum+'"}';
        cc.log(submit);
        sys.webSock.send(submit);
    },
    
    onItemChoose5: function()
    {
        if(!this.itemCanDiscard)
        return;
        
        this.itemCanDiscard = false;
        var sys = this.canvasScript;
        var target = this.item5;
        target.active = false;
        
        var submit='{"cmd":"discard","data":"5","from":"'+sys.grpNum+'"}';
        cc.log(submit);
        sys.webSock.send(submit);
    },
    
    onItemChoose6: function()
    {
        if(!this.itemCanDiscard)
        return;
        
        this.itemCanDiscard = false;
        var sys = this.canvasScript;
        var target = this.item6;
        target.active = false;
        
        var submit='{"cmd":"discard","data":"6","from":"'+sys.grpNum+'"}';
        cc.log(submit);
        sys.webSock.send(submit);
    },
    
    onInput: function()
    {
        var sys = this.canvasScript;
        var edit = this.editBox;
        var str = edit.string;
        edit.string = "";
        
        if(str === "")
        return;
        
        var submit='{"cmd":"talk","data":"'+encodeURI(str)+'","from":"'+sys.grpNum+'"}';
        cc.log(submit);
        sys.webSock.send(submit);
    },
    
    onInputClear: function()
    {
        var edit = this.editBox;
        var str = edit.string;
        edit.string = "";
    }
});
