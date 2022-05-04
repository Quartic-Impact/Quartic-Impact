ig.module('game.main')
  .requires(
    'impact.game',
    'impact.font',
    'game.levels.aaa',
    'game.features',
  )
  .defines(function () {
    MyGame = ig.Game.extend({
      // Load a font
      font: new ig.Font('media/04b03.font.png'),

      init: function () {
        this.parent();

        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.UP_ARROW, 'jump');

        this.loadLevel(LevelAaa);

        this.gravity = 60;
        // Initialize your game here; bind keys etc.
      },

      update: function () {
        // Update all entities and backgroundMaps
        this.parent();

        // Add your own, additional update code here
      },

      draw: function () {
        // Draw all entities and backgroundMaps
        this.parent();

        // Add your own drawing code here
        var x = ig.system.width / 2,
          y = ig.system.height / 2;

        this.font.draw('It Works!', x, y, ig.Font.ALIGN.CENTER);

        for (let i = 0; i < this.addons.postDraw.length; i++) {
          this.addons.postDraw[i].onPostDraw();
        }
      },

      // ! TODO: Properly implement this
      // The issue I'm running into is that we need to output JS files because
      // our entities are Impact modules, which are then passed into the level's
      // `.requires`
      // We can't just request the JS files and pass them to `loadLevel` either
      // because the function needs the `LevelName` property, not the entire
      // module
      teleport(levelName) {
        let path = levelName.toPath(ig.root + '/game/levels/', '.js') + ig.getCacheSuffix();
        $.ajax({
          dataType: 'script',
          url: path,
          context: this,
          success: function (data) {
            console.log(data);
            // this.loadLevel(data);
          },
          error(b, c, e) {
            console.error(
              Error("Loading of Map '" + path + "' failed: " + b + ' / ' + c + ' / ' + e),
            );
          },
        });
        // this.loadLevel(levelName);
      },
    });

    // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    ig.main('#canvas', MyGame, 60, 320, 240, 2);
  });
