ig.module('impact.base.loader').defines(() => {
    ig.cacheList = {};

    ig.Cacheable = ig.Class.extend({
      cacheType: null,
      cacheKey: null,
      getCacheKey: null,
      refCount: 0,
      staticInstantiate() {
        this.constructor.cache = {};
        let cacheType = this.constructor.prototype.cacheType;
        if (!cacheType) throw new Error('ig.Cacheable without cacheType!');
        if (ig.cacheList[cacheType]) throw new Error(`Duplicated cacheType: ${cacheType}`);
        ig.cacheList[cacheType] = this.constructor.cache;
      },
      init() {
        this.cacheKey && (this.constructor.cache[this.cacheKey] = this);
        this.increaseRef();
      },
      increaseRef() {
        this.refCount++;
      },
    });

    ig.Loadable = ig.Cacheable.extend({
      loaded: false,
      failed: false,
      path: '',
      init(path) {
        this.parent();
        if (typeof path === 'string') {
          this.path = path;
          ig.ready ? this.load() : ig.addResource(this);
        } else {
          this.path = '[INLINE DATA]';
          this.loaded = true;
        }
      },
      getCacheKey(cacheKey) {
        return typeof cacheKey === 'string' ? cacheKey : null;
      },
      load(cb) {
        if (this.loaded) cb(this.cacheType, this.path, true);
        else {
          this.loadCallback = cb || null;
          this.loadInternal(this.path);
        }
      },
      loadingFinished(loaded) {
        loaded ? (this.loaded = true) : (this.failed = true);
        if (this.loadCallback) {
          this.loadCallback(this.path, loaded);
          this.loadCallback = null;
        }
      },
    });

    new (ig.Loadable.extend({
      cacheType: 'Image',
      width: null,
      height: null,
      init(a) {
        this.parent(a);
      },
      loadInternal: function () {
        this.data = new Image();
        this.data.onload = this.onload.bind(this);
        this.data.onerror = this.onerror.bind(this);
        this.data.src = this.path + ig.getCacheSuffix();
      },
      onload: function () {
        this.width = this.data.width;
        this.height = this.data.height;
        this.loadCallback(this.path, true)
      },
      onerror: function () {
        this.loadCallback(this.path, false)
      },
    }))('media/player-new.png');

    ig.Loader = ig.Class.extend({
      resources: [],

      gameClass: null,
      status: 0,
      done: false,

      _unloaded: [],
      _drawStatus: 0,
      _intervalId: 0,
      _loadCallbackBound: null,

      init: function (gameClass, resources) {
        this.gameClass = gameClass;
        this.resources = resources;
        this._loadCallbackBound = this._loadCallback.bind(this);

        for (var i = 0; i < this.resources.length; i++) {
          this._unloaded.push(this.resources[i].path);
        }
      },

      load: function () {
        ig.system.clear('#000');

        if (!this.resources.length) {
          this.end();
          return;
        }

        for (var i = 0; i < this.resources.length; i++) {
          this.loadResource(this.resources[i]);
        }
        this._intervalId = setInterval(this.draw.bind(this), 16);
      },

      loadResource: function (res) {
        res.load(this._loadCallbackBound);
      },

      end: function () {
        if (this.done) {
          return;
        }

        this.done = true;
        clearInterval(this._intervalId);
        ig.system.setGame(this.gameClass);
      },

      draw: function () {
        this._drawStatus += (this.status - this._drawStatus) / 5;
        var s = ig.system.scale;
        var w = (ig.system.width * 0.6).floor();
        var h = (ig.system.height * 0.1).floor();
        var x = (ig.system.width * 0.5 - w / 2).floor();
        var y = (ig.system.height * 0.5 - h / 2).floor();

        ig.system.context.fillStyle = '#000';
        ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);

        ig.system.context.fillStyle = '#fff';
        ig.system.context.fillRect(x * s, y * s, w * s, h * s);

        ig.system.context.fillStyle = '#000';
        ig.system.context.fillRect(x * s + s, y * s + s, w * s - s - s, h * s - s - s);

        ig.system.context.fillStyle = '#fff';
        ig.system.context.fillRect(x * s, y * s, w * s * this._drawStatus, h * s);

        ig.system.context.fillStyle = "#fff";
        ig.system.context.fillText(
            ig.resources[0].path,
            ig.system.width / 2 -
            ig.system.context.measureText(ig.resources[0].path).width / 2,
            ig.system.height * 0.5 - 4
        )
      },

      _loadCallback: function (path, status) {
        if (status) {
          this._unloaded.erase(path);
        } else {
          throw 'Failed to load resource: ' + path;
        }

        this.status = 1 - this._unloaded.length / this.resources.length;
        if (this._unloaded.length == 0) {
          // all done?
          setTimeout(this.end.bind(this), 250);
        }
      },
    });
});
