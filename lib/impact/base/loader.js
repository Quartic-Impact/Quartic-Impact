ig.module('impact.base.loader').defines(() => {
    ig.cacheList = {};

    ig.Cacheable = ig.Class.extend({
      cacheType: null,
      cacheKey: null,
      getCacheKey: null,
      refCount: 0,
      staticInstantiate() {
        if (!this.constructor.cache) {
          this.constructor.cache = {};
          let cacheType = this.constructor.prototype.cacheType;
          if (!cacheType) throw new Error('ig.Cacheable without cacheType!');
          if (ig.cacheList[cacheType]) throw new Error(`Duplicated cacheType: ${cacheType}`);
          ig.cacheList[cacheType] = this.constructor.cache;
        }
        if ((cacheKey = this.cacheKey = this.getCacheKey.apply(this, arguments)))
          if ((cacheable = this.constructor.cache[cacheKey])) {
            cacheable.onInstanceReused && cacheable.onInstanceReused();
            cacheable.increaseRef();
            return cacheable;
          }
        return null;
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
      tolerateMissingResources: false,
      loadListeners: [],
      loadCollectors: [],
      init(path) {
        this.parent();
        if (typeof path === 'string') {
          this.path = path;
          ig.addResourceToCollectors(this);
          ig.ready ? this.load() : ig.addResource(this);
        } else {
          this.path = '[INLINE DATA]';
          this.loaded = true;
        }
      },
      onInstanceReused() {
        this.loaded || ig.addResourceToCollectors(this);
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

        // Load listener management
        if (this.loadListeners.length > 0)
          for (let listener of this.loadListeners)
            listener.onLoadableComplete(this.loaded, this);
        this.loadListeners.length = 0;
        ig.setResourceLoadedToCollectors(this);

        if (this.loadCallback) {
          this.loadCallback(this.cacheType, this.path, loaded);
          this.loadCallback = null;
        }
      },
      addLoadListener(listener) {
        if (this.loaded) listener.onLoadableComplete(true, this);
        else this.loadListeners.push(listener);
      }
    });

    ig.Loader = ig.Class.extend({
      resources: [],
      prevResourcesCnt: 0,
      status: 0,
      done: false,
      lastPath: "",
      gameObjectCreated: false,
      _unloaded: [],
      _drawStatus: 0,
      _intervalId: 0,
      _loadCallbackBound: null,
      _loadIndex: 0,
      _nextStepFunction: null,
      init: function (a) {
        this.gameClass = a || null;
        this.resources = ig.resources;
        this._loadCallbackBound = this._loadCallback.bind(this);
      },
      load: function () {
        ig.system.clear( '#000' );
        ig.ready = false;
        ig.loading = true;
        this.done = false;
        this._drawStatus = this.status = 0;
        if (this.resources.length) {
          for (var a = 0; a < this.resources.length; a++)
            this._unloaded.push(
              this.resources[a].cacheType + this.resources[a].path
            );
          this._loadIndex = this.resources.length;
          for (a = 0; a < this.resources.length; a++)
            this.loadResource(this.resources[a]);
          this._intervalId = setInterval(this.draw.bind(this), 16);
        } else this.end();
      },
      loadResource: function (a) {
        a.load(this._loadCallbackBound);
      },
      end: function () {
        if (!this.done) {
          this.done = true;
          this.onEnd();
        }
      },
      onEnd: function () {
        this.finalize();
      },
      finalize: function () {
        this.prevResourcesCnt = ig.resources.length;
        ig.resources.length = 0;
        clearInterval(this._intervalId);
        if (this.gameClass) {
          if (!this.gameObjectCreated) {
            this.gameObjectCreated = true;
            ig.system.setGame(this.gameClass);
          }
          if (ig.resources.length > 0) {
            this.load();
            return;
          }
          this.prevResources = null;
          ig.ready = true;
          ig.system.setDelegate(ig.game);
        } else {
          ig.ready = true;
          ig.game.loadingComplete();
        }
        this._loadCallbackBound = null;
        ig.loading = false;
      },
      draw: function () {
        this._drawStatus =
          this._drawStatus + (this.status - this._drawStatus) / 5;
        var a = ig.system.scale,
          b = ig.system.width * 0.6,
          c = ig.system.height * 0.1,
          d = ig.system.width * 0.5 - b / 2,
          e = ig.system.height * 0.5 - c / 2;
        ig.system.context.fillStyle = "#000";
        ig.system.context.fillRect(
          0,
          0,
          ig.system.contextWidth,
          ig.system.contextHeight
        );
        ig.system.context.fillStyle = "#fff";
        ig.system.context.fillRect(d * a, e * a, b * a, c * a);
        ig.system.context.fillStyle = "#000";
        ig.system.context.fillRect(
          d * a + a,
          e * a + a,
          b * a - a - a,
          c * a - a - a
        );
        ig.system.context.fillStyle = "#fff";
        ig.system.context.fillRect(
          d * a,
          e * a,
          b * a * this._drawStatus,
          c * a
        );

        ig.system.context.fillStyle = "#fff";
        ig.system.context.fillText(
            this.lastPath,
            ig.system.width / 2 -
            ig.system.context.measureText(this.lastPath).width / 2,
            ig.system.height * 0.5 - 4
        )
      },
      _loadCallback: function (a, b, c) {
        this._unloaded.erase(a + b);
        a = this._loadIndex;
        this._loadIndex = this.resources.length;
        for (var d = a; d < this.resources.length; d++)
          this._unloaded.push(
            this.resources[d].cacheType + this.resources[d].path
          );
        for (d = a; d < this.resources.length; d++)
          this.loadResource(this.resources[d]);
        !c &&
          !this.tolerateMissingResources &&
          console.error(Error("Failed to load resource: " + b));
        this.lastPath = b;
        this.status = 1 - this._unloaded.length / this.resources.length;
        this._unloaded.length == 0 && this.end();
      },


      // resources: [],
      // prevResourcesCount: 0,
      //
      // status: 0,
      // done: false,
      // gameClass: null,
      // lastPath: "",
      // gameObjectCreated: false,
      //
      // _unloaded: [],
      // _drawStatus: 0,
      // _intervalId: 0,
      // _loadCallbackBound: null,
      // _loadIndex: 0,
      // _nextStepFunction: null,
      //
      // init: function (gameClass, resources) {
      //   this.gameClass = gameClass;
      //   this.resources = resources;
      //   this._loadCallbackBound = this._loadCallback.bind(this);
      // },
      //
      // load: function () {
      //   ig.system.clear('#000');
      //   ig.ready = false;
      //   ig.loading = true;
      //   this.done = false;
      //   this._drawStatus = this.status = 0;
      //
      //   if (this.resources.length) {
      //     for (let res of this.resources) {
      //       this._unloaded.push(res.cacheType + res.path)
      //     }
      //     this._loadIndex = this.resources.length;
      //     for (let res of this.resources) {
      //       this.loadResource(res);
      //     }
      //     this._intervalId = setInterval(this.draw.bind(this), 16);
      //   } else this.end();
      // },
      //
      // loadResource(res) {
      //   res.load(this._loadCallbackBound);
      // },
      //
      // end() {
      //   if (!this.done) {
      //     this.done = true;
      //     this.finalize()
      //   }
      // },
      //
      // finalize() {
      //   this.prevResourcesCount = ig.resources.length;
      //   ig.resources.length = 0;
      //   clearInterval(this._intervalId);
      //   if (this.gameClass) {
      //     if (!this.gameObjectCreated) {
      //       this.gameObjectCreated = true;
      //       ig.system.setGame(this.gameClass);
      //     }
      //     if (ig.resources.length > 0) {
      //       this.load();
      //       return;
      //     }
      //     this.prevResources = null;
      //     ig.ready = true;
      //     ig.system.setDelegate(ig.game);
      //   } else {
      //     ig.ready = true;
      //   }
      //   this._loadCallbackBound = null;
      //   ig.loading = false;
      // },
      //
      // draw: function () {
      //   this._drawStatus += (this.status - this._drawStatus) / 5;
      //   var s = ig.system.scale;
      //   var w = (ig.system.width * 0.6).floor();
      //   var h = (ig.system.height * 0.1).floor();
      //   var x = (ig.system.width * 0.5 - w / 2).floor();
      //   var y = (ig.system.height * 0.5 - h / 2).floor();
      //
      //   ig.system.context.fillStyle = '#000';
      //   ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
      //
      //   ig.system.context.fillStyle = '#fff';
      //   ig.system.context.fillRect(x * s, y * s, w * s, h * s);
      //
      //   ig.system.context.fillStyle = '#000';
      //   ig.system.context.fillRect(x * s + s, y * s + s, w * s - s - s, h * s - s - s);
      //
      //   ig.system.context.fillStyle = '#fff';
      //   ig.system.context.fillRect(x * s, y * s, w * s * this._drawStatus, h * s);
      //
      //   ig.system.context.fillStyle = "#fff";
      //   ig.system.context.fillText(
      //       ig.resources[0].path,
      //       ig.system.width / 2 -
      //       ig.system.context.measureText(ig.resources[0].path).width / 2,
      //       ig.system.height * 0.5 - 4
      //   )
      // },
      //
      // _loadCallback: function (cacheType, path, success) {
      //   this._unloaded.erase(cacheType + path);
      //   let loadIndex = this._loadIndex;
      //   this._loadIndex = this.resources.length;
      //   for (let i = loadIndex; i < this.resources.length; i++) {
      //     this._unloaded.push(this.resources[i].cacheType + this.resources[i].path);
      //   }
      //   for (let i = loadIndex; i < this.resources.length; i++) {
      //     this.loadResource(this.resources[i]);
      //   }
      //
      //   !success && console.log(Error(`Failed to load resource: ${path}`));
      //
      //   this.lastPath = path;
      //   this.status = 1 - this._unloaded.length / this.resources.length;
      //   this._unloaded.length == 0 && this.end()
      // },
    });

    ig.LoadCollector = ig.Class.extend({
      listener: null,
      resources: [],
      init(listener) {
        this.listener = listener;
        ig.loadCollectors.push(this);
      },
      finalizeLoadableFetching() {
        ig.loadCollectors.erase(this);
        this.resources.length === 0 && this.done();
      },
      addResource(res) {
        if (this.resources.indexOf(res) === -1) {
          this.resources.push(res);
          res.loadCollectors.push(this);
        }
      },
      setResourceLoaded(res) {
        this.resources.erase(res);
        this.resources.length === 0 && this.done();
      },
      done() {
        this.listener.onLoadableComplete(true, this);
      }
    });

    ig.loadCollectors = [];
    ig.addResourceToCollectors = (res) => {
      for (let col of ig.loadCollectors)
        col.addResource(res);
    }
    ig.setResourceLoadedToCollectors = (res) => {
      for (let col of res.loadCollectors)
        col.setResourceLoaded(res);
      res.loadCollectors.length = 0;
    }
    ig.activateCollectors = (res) => {
      for (let col of res.loadCollectors)
        ig.loadCollectors.push(col);
    }
    ig.removeCollectors = (res) => {
      for (let col of res.loadCollectors)
        ig.loadCollectors.erase(col);
    }
});
