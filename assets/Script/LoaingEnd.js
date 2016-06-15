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
    },

    // use this for initialization
    onLoad: function () {
        
        cc.loader.loadRes('Scene/game.fire', function(err, res) {
            cc.director.runScene(res.scene); //注意通过 res.scene 获取场景实例
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
