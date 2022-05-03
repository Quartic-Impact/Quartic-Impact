ig.module('game.main')
  .requires('impact.game', 'impact.font', 'game.levels.aaa')
  .defines(function () {
    MyGame = ig.Game.extend({
      // Load a font
      font: new ig.Font('media/04b03.font.png'),

      addons: {
        all: [],
        levelLoadStart: [],
        levelLoaded: [],
        teleport: [],
        preUpdate: [],
        postUpdate: [],
        deferredUpdate: [],
        preDraw: [],
        midDraw: [],
        postDraw: [],
        varsChanged: [],
        reset: [],
        windowFocusChanged: [],
      },

      init: function () {
        this.addons.all = ig.initGameAddons();
        for (var b = 0; b < this.addons.all.length; ++b) {
          var a = this.addons.all[b];
          a.onLevelLoadStart && this.addons.levelLoadStart.push(a);
          a.onLevelLoaded && this.addons.levelLoaded.push(a);
          a.onTeleport && this.addons.teleport.push(a);
          a.onPreUpdate && this.addons.preUpdate.push(a);
          a.onPostUpdate && this.addons.postUpdate.push(a);
          a.onDeferredUpdate && this.addons.deferredUpdate.push(a);
          a.onPreDraw && this.addons.preDraw.push(a);
          a.onMidDraw && this.addons.midDraw.push(a);
          a.onPostDraw && this.addons.postDraw.push(a);
          a.onVarsChanged && this.addons.varsChanged.push(a);
          a.onReset && this.addons.reset.push(a);
          a.onWindowFocusChanged && this.addons.windowFocusChanged.push(a);
        }
        this.addons.levelLoadStart.sort(function (a, b) {
          return a.levelLoadStartOrder - b.levelLoadStartOrder;
        });
        this.addons.levelLoaded.sort(function (a, b) {
          return a.levelLoadedOrder - b.levelLoadedOrder;
        });
        this.addons.teleport.sort(function (a, b) {
          return a.teleportOrder - b.teleportOrder;
        });
        this.addons.preUpdate.sort(function (a, b) {
          return a.preUpdateOrder - b.preUpdateOrder;
        });
        this.addons.postUpdate.sort(function (a, b) {
          return a.postUpdateOrder - b.postUpdateOrder;
        });
        this.addons.deferredUpdate.sort(function (a, b) {
          return a.deferredUpdateOrder - b.deferredUpdateOrder;
        });
        this.addons.preDraw.sort(function (a, b) {
          return a.preDrawOrder - b.preDrawOrder;
        });
        this.addons.midDraw.sort(function (a, b) {
          return a.midDrawOrder - b.midDrawOrder;
        });
        this.addons.postDraw.sort(function (a, b) {
          return a.postDrawOrder - b.postDrawOrder;
        });
        this.addons.varsChanged.sort(function (a, b) {
          return a.varsChangedOrder - b.varsChangedOrder;
        });
        this.addons.reset.sort(function (a, b) {
          return a.resetOrder - b.resetOrder;
        });
        this.addons.windowFocusChanged.sort(function (a, b) {
          return a.windowFocusOrder - b.windowFocusOrder;
        });
	
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.UP_ARROW, 'jump');
	
        // this.loadLevel(LevelAaa);
	
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
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
    ig.main('#canvas', MyGame, 60, 320, 240, 2);
});

window.ig = ig;
