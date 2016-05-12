'use strict';
enchant();
var gameScreenSize = [515,515];
var nopeSprite = Class.create(Sprite, {
    initialize: function(){
        var surface = new Surface(gameScreenSize[0], gameScreenSize[1]);
        Sprite.call(this, gameScreenSize[0], gameScreenSize[1]);
        
        var context = surface.context;
        context.beginPath();
        context.moveTo(0, 0);
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, gameScreenSize[0], gameScreenSize[1]);
        context.closePath();
        this.image = surface;
    }
});

var gameEndTimerSprite = Class.create(Sprite, {
    initialize: function(){
        var surface = new Surface(10, 10);
        Sprite.call(this, 10, 10);
        
        var context = surface.context;
        context.beginPath();
        context.moveTo(0, 0);
        context.fillStyle = '#9390C3';
        context.fillRect(0, 0, 10, 10);
        this.image = surface;
    }
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

var mouseCursoleElipse = Class.create(Sprite, {
    initialize: function(){
        var surface = new Surface(60, 60);
        Sprite.call(this, 60, 60);
        
        var context = surface.context;
        context.beginPath();
        context.arc(30, 30, 28, 0, Math.PI*2, false);
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.stroke();
        
        this.image = surface;
    }
});
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

var score_scene = function(game, score) {
    var scene = new Scene();
    var scoreLabel = new Label();
    scoreLabel.text = 'Score:' + score;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    
    var gotoTitleButton = new Button('GotoTitle', 'dark');
    gotoTitleButton.x = 5;
    gotoTitleButton.y = gameScreenSize[1] - 30;
    
    gotoTitleButton.on('touchstart', function(){
       game.replaceScene(title(game)); 
    });
    
    scene.addChild(scoreLabel);
    scene.addChild(gotoTitleButton);
    return scene;
};

function game(game) {
    var scene = new Scene();
    var score = 0;
    
    scene.backgroundColor = '#C1BEFF';
    var timeLeftSecond = 30;
    var timeLeftLabel = new Label();
    timeLeftLabel.text = timeLeftSecond;
    timeLeftLabel.x = gameScreenSize[0] / 2;
    timeLeftLabel.y = gameScreenSize[0] /2 - 30;
    
    var isStart = false;
    var scoreLabel = new Label();
    scoreLabel.text = score;
    var nope = new nopeSprite();
    var endTimeSprite = new gameEndTimerSprite();
    endTimeSprite.x = gameScreenSize[0] / 2;
    endTimeSprite.y = gameScreenSize[1] / 2;
    
    var target = new targetElipse(60, 60, 30, 30, 28, 10, 10, score, scoreLabel, '#7B0000');
    var extra = new targetElipse(40, 40, 30, 30, 10, 10, 10, score, scoreLabel, '#FB0006');
    
    var mouseElipse = new mouseCursoleElipse();
    var XLine = new mouseCursoleLine(gameScreenSize[0], 1);
    var YLine = new mouseCursoleLine(1, gameScreenSize[1]);
    
    var click = function(clickPoint){
        if(!isStart){
            game.frame = 0;
            isStart = true;
            endTimeSprite.tl.scaleBy(gameScreenSize[0], gameScreenSize[1], 300 * game.fps);
        }
        var x_pos = Math.floor(Math.random() * gameScreenSize[0] - 30);
        var y_pos = Math.floor(Math.random() * gameScreenSize[1] - 30);
        target.tl.moveTo(x_pos, y_pos, 10, enchant.Easing.QUAD_EASEINOUT);
        extra.tl.moveTo(x_pos, y_pos, 10, enchant.Easing.QUAD_EASEINOUT);

        score = score + clickPoint;
        scoreLabel.text = score;
    };
    
    target.on('touchstart', function(){
        click(1);
    });
    extra.on('touchstart', function(){
        click(2);
    });
    nope.on('touchstart', function(){
        click(-2);
    });
    
    document.addEventListener('mousemove', function(e){
        
        /* windowオブジェクトで取れる座標とenchant.js内の座標に拡大率分の誤差があるのでgame.scaleで割った座標を実際の座標とする。 */
        var x_pos = e.pageX / game.scale;
        var y_pos = e.pageY / game.scale;
        
        mouseElipse.x = x_pos - mouseElipse.width / 2;
        mouseElipse.y = y_pos - mouseElipse.height / 2;
        
        XLine.y = y_pos;
        YLine.x = x_pos;
    });
    
    scene.on('enterframe', function(){
       if(isStart){
            if(game.frame % game.fps == 0){
                timeLeftSecond -= 1;
                timeLeftLabel.text = timeLeftSecond;
            }
            if(timeLeftSecond < 0){
                game.replaceScene(score_scene(game, scoreLabel.text));
            }
        }
    });
    
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    var childs = [endTimeSprite, timeLeftLabel,
                  XLine, YLine, 
                  mouseElipse, nope,target, 
                  extra, scoreLabel];
    for(var i = 0; i < childs.length; i++){
        scene.addChild(childs[i]);
    }
    return scene;
}

function title(g){
    var scene = new Scene();
    
    var title = new Label('Sh00t');
    title.x = (gameScreenSize[0] - title._boundWidth) / 2;
    title.y = (gameScreenSize[1] / 2) / 2;
    
    var startButton = new Button('Start', 'dark');
    startButton.moveTo(0,0);
    startButton.ontouchstart = function(){
        g.replaceScene(game(g));
    };
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
};