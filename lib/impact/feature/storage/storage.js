ig.module('impact.feature.storage.storage')
  .requires('impact.game')
  .defines(function () {
    ig.StorageData = ig.Class.extend({
      loaded: false,
      data: null,
      saveDataStack: [],
      path: null,
      cacheType: 'STORAGE',
      ioState: null,
      loadPathStack: null,

      init: function (path) {
        this.path = path;
        window.wm || ig.addResource(this);
      },

      load: function (callback) {
        this._loadCallback = callback;
        this._loadStorageFromData(localStorage.getItem(this.path));
      },

      save: function (data) {
        localStorage.setItem(this.path, data);
      },

      getData: function () {
        return this.data;
      },
    });

    //! TODO: Implement properly
    ig.Storage = ig.GameAddon.extend({
      init: function () {
        this.parent('Storage');
      },
    });
    ig.addGameAddon(function () {
      return (ig.storage = new ig.Storage());
    });
  });
