ig.module('impact.feature.test')
  .requires('impact.game')
  .defines(function () {
    ig.TestAddon = ig.GameAddon.extend({
      init: function () {
        this.parent('Test');
        console.log('TestAddon initialized');
      },
      onPostDraw: function () {
        console.log('Called from onPostDraw');
      },
    });
    ig.addGameAddon(function () {
      return (ig.test = new ig.TestAddon());
    });
  });
