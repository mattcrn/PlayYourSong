Game.Level = function (game) { };

var map;
var layer;

var player;
var controls = {};
var playerAcc = 2000;
var jumpTimer = 0;
var gameSpeed = 100;
var playerEngery = 100;
var bar;
var filling;
var depletion = 10;
var depletionTimer = 0;

Game.Level.prototype = {
    create: function () {

        this.stage.backgroundColor = '#3A5963';

        this.physics.arcade.gravity.y = 1400;

        map = this.add.tilemap('map', 32, 32);

        map.addTilesetImage('default','tileset');

        layer = map.createLayer(0);

        layer.resizeWorld();

        //COLLISION
        map.setCollision([82, 98]);
        map.setTileIndexCallback(98, this.reset, this);
        map.setTileIndexCallback(4, this.collectCoin, this);

        player = this.add.sprite(100, 248, 'player', 5);
        player.anchor.setTo(0.5);
        player.scale.x = 0.5;
        player.scale.y = 0.5;
        player.animations.add('idle', [4], 1, false);
        player.animations.add('run', [5, 6, 7, 8], 5, true);
        this.physics.arcade.enable(player);
        this.camera.follow(player);
        player.body.collideWorldBounds = true;

        bar = this.add.sprite(100, 320, 'bar')
        filling = bar.addChild(this.make.sprite(5, 5, 'filling'));
        bar.fixedToCamera = true;

        controls = {
            up: this.input.keyboard.addKey(Phaser.Keyboard.W),
            start: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        }


    },

    update: function () {

        this.physics.arcade.collide(player, layer);

        player.body.acceleration.y = 0;

        filling.scale.x = playerEngery/100;

        if (controls.up.isDown && playerEngery > 0) {

            player.body.acceleration.y = -playerAcc;
            if(this.time.now > depletionTimer) {
                playerEngery -= depletion;
                depletionTimer = this.time.now +1000;
            }


        }

        if (controls.start.isDown) {

            player.body.velocity.x = gameSpeed;
            player.animations.play('run');

        }

        if (player.body.velocity.x == 0) {
            player.animations.play('idle');
        }

    },
    reset: function () {
        var colors = ["#CCCCCC", "#333333", "#990099"];
        var rand = Math.floor(Math.random() * colors.length);
        $('body').css("background-color", colors[rand]);
        playerEngery = 100;
        this.state.start('Level');
    },
    collectCoin: function (sprite, tile) {
        if (tile.alpha != 0) {
            tile.alpha = 0;
            layer.dirty = true;
            playerEngery += 25;
            if (playerEngery > 100) {
                playerEngery = 100;
            }

        }
    }
}