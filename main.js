"use strict"
enchant();
var gameScreenSize = [515,515];

var gameEndTimerSprite = Class.create(Sprite, {
    
});

var gameEndTimerLabel = Class.create(Label,{
    
});

var mouseCursoleLine = Class.create(Sprite, {
    initialize: function(width, height){
        var surface = new Surface(width, height);
        Sprite.call(this, width, height);
        
        var context = surface.context;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, height);
        context.closePath();
        context.stroke();
        this.image = surface;
    }
});
    
var mouseCursoleYLine = Class.create(Sprite, {
    
});

var mouseCursoleElipse = Class.create(Sprite, {
    initialize: function(){
        var surface = new Surface(60, 60);
        Sprite.call(this, 60, 60);
        
        var context = surface.context;
        context.beginPath();
        context.arc(30, 30, 28, 0, Math.PI*2, false);
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.stroke();
        
        this.image = surface;
    }
})
var targetElipse = Class.create(Sprite, {
   initialize: function(width, height, aw, ah, ar, x, y, score, scoreLabel, color){
       var surface = new Surface(width, height);
       Sprite.call(this, width, height);
       
       this.score = score;
       this.scoreLabel = scoreLabel;
       this.x = x;
       this.y = y;
       
       var context = surface.context;
       context.beginPath();
       context.arc(aw, ah, ar, 0, Math.PI*2, false);
       context.fillStyle = color;
       context.fill();
       
       this.image = surface;
   }
});

function score(game) {
    var scene = new Scene();
}

function game(game) {
    var scene = new Scene();
    var score = 0;
    var scoreLabel = new Label();
    scoreLabel.text = score;
    
    var target = new targetElipse(60, 60, 30, 30, 28, 10, 10, score, scoreLabel, "#7B0000");
    var extra = new targetElipse(40, 40, 30, 30, 10, 10, 10, score, scoreLabel, "#FB0006");
    
    var mouseElipse = new mouseCursoleElipse();
    var XLine = new mouseCursoleLine(gameScreenSize[0], 1);
    var YLine = new mouseCursoleLine(1, gameScreenSize[1]);
    
    var click = function(clickPoint){
        var x_pos = Math.floor(Math.random() * gameScreenSize[0] - 30);
        var y_pos = Math.floor(Math.random() * gameScreenSize[1] - 30);
        target.tl.moveTo(x_pos, y_pos, 10, enchant.Easing.QUAD_EASEINOUT);
        extra.tl.moveTo(x_pos, y_pos, 10, enchant.Easing.QUAD_EASEINOUT);

        score = score + clickPoint;
        scoreLabel.text = score;
    }
    
    target.on("touchstart", function(){
        click(1);
    });
    extra.on("touchstart", function(){
        click(2);
    });
    
    document.addEventListener("mousemove", function(e){
        var x_pos = e.pageX / game.scale;
        var y_pos = e.pageY / game.scale;
        mouseElipse.x = x_pos - mouseElipse.width / 2;
        mouseElipse.y = y_pos - mouseElipse.height / 2;
        
        XLine.y = y_pos;
        YLine.x = x_pos;
    });
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    
    scene.addChild(XLine);
    scene.addChild(YLine);
    scene.addChild(mouseElipse);
    scene.addChild(target);
    scene.addChild(extra);
    scene.addChild(scoreLabel);
    return scene;
}

function title(g){
    var scene = new Scene();
    
    var title = new Label("Sh00t");
    title.x = (gameScreenSize[0] - title._boundWidth) / 2;
    title.y = (gameScreenSize[1] / 2) / 2;
    
    var startButton = new Button("Start", "dark");
    startButton.moveTo(0,0);
    startButton.ontouchstart = function(){
        g.replaceScene(game(g));
    }
    scene.addChild(title);
    scene.addChild(startButton);
    return scene;
}

window.onload = function(){
    var game_ = new Core(gameScreenSize[0], gameScreenSize[1]);
    game_.fps = 60;
    game_.onload = function(){
        game_.replaceScene(title(game_));
    };
    game_.start();
}