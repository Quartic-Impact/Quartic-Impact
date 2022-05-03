ig.module('impact.feature.gui.gui')
  .requires('impact.image', 'impact.game', 'impact.feature.storage.storage')
  .defines(function () {
    ig.GuiStepPool = ig.Class.extend({
      get: function (item) {
        if (!item.poolEntries) item.poolEntries = [];
        if (item.poolEntries.length) {
          item = item.poolEntries.pop();
          item.clear();
          return item;
        }
        return new item();
      },
      free: function (item) {
        let constructor = item.constructor;
        if (!constructor.poolEntries) constructor.poolEntries = [];
        constructor.poolEntries.push(item);
      },
    });
    let guiStepPool = new ig.GuiStepPool();
  });
