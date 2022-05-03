ig.module('impact.feature.gui.gui')
  .requires('impact.image', 'impact.game', 'impact.feature.storage.storage')
  .defines(function () {
    ig.GuiDrawable = ig.Class.extend({
      pos: { x: 0, y: 0 },
      size: { x: 0, y: 0 },
      src: { x: 0, y: 0 },
      gfxSource: null,
      gfxType: 0,
      flip: { x: false, y: false },
      alpha: 1,
      compositionMode: 'source-over',

      /**
       * Sets the position of the drawable relative to the owner
       * @param {number} x - X position
       * @param {number} y - Y position
       */
      setPos: function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
        return this;
      },
      setSize: function (x, y) {
        this.size.x = x;
        this.size.y = y;
        return this;
      },
      setSrc: function (x, y) {
        this.src.x = x;
        this.src.y = y;
        return this;
      },
      setAlpha: function (alpha) {
        this.alpha = alpha;
        return this;
      },
      setColor: function (source, xPos, yPos, xSize, ySize) {
        this.gfxSource = source;
        this.gfxType = 3;
        this.setPos(xPos, yPos);
        this.setSize(xSize, ySize);
        return this;
      },
      setCompositionMode: function (mode) {
        this.compositionMode = a || 'source-over';
        return this;
      },
      setGfx: function (gfx, x, y, srcX, srcY, width, height, flipX, flipY) {
        if (!(image instanceof ig.Image))
          throw Error('Invalid setGfx call. gfx is not instance of ig.Image');
        this.gfxSource = gfx;
        this.gfxType = 1;
        this.setPos(x, y);
        this.setSrc(srcX, srcY);
        this.setSize(width, height);
        this.flip.x = flipX || false;
        this.flip.y = flipY || false;
        return this;
      },
      setGfxTile: function (gfx, x, y, srcX, srcY, width, height, flipX) {
        if (!(gfx instanceof ig.Image))
          throw Error('Invalid setGfxTile call. gfx is not instance of ig.Image');
        width = width ? width : srcY;
        this.setGfx(
          gfx,
          x,
          y,
          Math.floor(srcX * srcY) % gfx.width,
          Math.floor((srcX * srcY) / gfx.width) * width,
          width,
          height,
          flipX,
        );
      },
      setVideo: function () {
        throw Error("STUB! ig.Video isn't implemented!");
      },
      setGameStateDraw: function () {
        throw Error("STUB! ig.GameState isn't implemented!");
      },
      setPattern: function () {
        throw Error("STUB! ig.ImagePattern isn't implemented!");
      },
      setText: function () {
        throw Error("STUB! ig.TextBlock isn't implemented!");
      },
      //! TODO: Implement!!
      draw: function () {},
      kill: function () {
        this.gfxSource = null;
        this.gfxType = 0;
        guiStepPool.free(this);
      },
      clear: function () {
        this.alpha = 1;
        this.src.x = this.src.y = this.size.x = this.size.y = null;
        this.flip.x = this.flip.y = false;
        this.compositionMode = 'source-over';
      },
    });

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
