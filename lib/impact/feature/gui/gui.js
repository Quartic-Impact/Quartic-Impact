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

    let transforms = [];
    ig.Renderer2dUI = ig.Class.extend({
      drawSteps: [],
      addGfx: function (a, b, c, d, e, f, g, h, i) {
        return this.addDraw().setGfx(a, b, c, d, e, f, g, h, i);
      },
      addGfxTile: function (a, b, c, d, e, f, g, h) {
        return this.addDraw().setGfxTile(a, b, c, d, e, f, g, h);
      },
      addVideo: function (a, b, c, d, e) {
        throw Error("STUB! ig.Video isn't implemented!");
      },
      addGameStateDraw: function (a, b, c) {
        throw Error("STUB! ig.GameState isn't implemented!");
      },
      addColor: function (a, b, c, d, e) {
        return this.addDraw().setColor(a, b, c, d, e);
      },
      addPattern: function (a, b, c, d, e, f, g) {
        throw Error("STUB! ig.ImagePattern isn't implemented!");
      },
      addText: function (a, b, c) {
        throw Error("STUB! ig.TextBlock isn't implemented!");
      },
      clearDrawSteps: function () {
        for (; this.drawSteps.length; ) {
          var a = this.drawSteps.pop();
          a && a.kill();
        }
      },
      addDraw: function () {
        let pool = guiStepPool.get(ig.GuiDrawable);
        this.drawSteps.push(pool);
        return pool;
      },
      addTransform: function () {
        let pool = guiStepPool.get(ig.GuiTransform);
        this.drawSteps.push(pool);
        return pool;
      },
      undoTransform: function () {
        this.drawSteps.push(null);
      },
      draw: function () {
        let system = ig.system,
          ctx = system.context,
          scale = system.scale,
          d = 0,
          e = 0,
          drawSteps = this.drawSteps,
          steps = drawSteps.length;

        for (let i = 0; i < steps; i++) {
          let step = drawSteps[i];
          if (step) {
            if (step.draw) step.draw(d, e);
            else {
              if (step.transform) {
                transforms.push(step);
                if (step.isComplex()) {
                  step.transform(d, e);
                  d = e = 0;
                } else {
                  d = d + system.getDrawPos(step.translate.x) / scale;
                  e = e + system.getDrawPos(step.translate.y) / scale;
                }
                if (step.alpha != 1) {
                  step.preAlpha = ctx.globalAlpha;
                  ctx.globalAlpha = ctx.globalAlpha * step.alpha;
                }
              }
            }
          } else {
            step = transforms.pop();
            if (!step)
              throw Error('Gui Draw: tried to undo non existing transform. Too many undos?');
            if (step.isComplex()) {
              ctx.restore();
              d = step.prePos.x;
              e = step.prePos.y;
            } else {
              d = d - system.getDrawPos(step.translate.x) / scale;
              e = e - system.getDrawPos(step.translate.y) / scale;
            }
            if (step.alpha != 1) ctx.globalAlpha = step.preAlpha;
          }
        }
        if (transforms.length > 0) {
          throw Error('Exited gui draw with transform remaining. Forgot to undo transform');
        }
      },
    });

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
      draw: function (x, y) {
        let system = ig.system,
          ctx = system.context,
          ctxScale = ctx.scale,
          globalAlpha,
          i;
        x = x + this.pos.x;
        y = y + this.pos.y;

        if (this.alpha != 1) {
          globalAlpha = ctx.globalAlpha;
          ctx.globalAlpha = ctx.globalAlpha * this.alpha;
        }
        if (this.compositionMode != 'source-over') {
          i = ctx.globalCompositeOperation = this.compositionMode;
        }
        if (this.gfxType == 3) {
          ctx.fillStyle = this.gfxSource;
          ctx.fillRect(
            system.getDrawPos(x),
            system.getDrawPos(y),
            this.size.x * ctxScale,
            this.size.y * ctxScale,
          );
        } else {
          this.gfxType == 1
            ? this.gfxSource.draw(
                x,
                y,
                this.src.x,
                this.src.y,
                this.size.x,
                this.size.y,
                this.flip.x,
                this.flip.y,
              )
            : this.gfxSource == 5
            ? this.gfxSource.draw(x, y, this.size.x, this.size.y)
            : this.gfxType == 6
            ? this.gfxSource.forceDraw(x, y)
            : this.gfxType == 2
            ? this.gfxSource.draw(x, y, this.src.x, this.src.y, this.size.x, this.size.y)
            : this.gfxType == 4 && this.gfxSource.draw(x, y);

          if (ctx.globalCompositeOperation != 'source-over') {
            ctx.globalCompositeOperation = i;
          }
          if (this.alpha != 1) ctx.globalAlpha = globalAlpha;
        }
      },
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

    ig.GuiTransform = ig.Class.extend({
      translate: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
      rotate: 0,
      pivot: { x: 0, y: 0 },
      alpha: 1,
      clip: { x: 0, y: 0 },
      prePos: { x: 0, y: 0 },
      preAlpha: 0,
      setAlpha: function (alpha) {
        this.alpha = alpha;
        return this;
      },
      setClip: function (x, y) {
        this.clip.x = x;
        this.clip.y = y;
        return this;
      },
      setTranslate: function (x, y) {
        this.translate.x = x;
        this.translate.y = y;
        return this;
      },
      setScale: function (x, y) {
        this.scale.x = x;
        this.scale.y = y;
        return this;
      },
      setRotate: function (deg) {
        this.rotate = deg;
        return this;
      },
      setPivot: function (x, y) {
        this.pivot.x = x;
        this.pivot.y = y;
        return this;
      },
      isComplex: function () {
        return this.scale.x != 1 || this.scale.y != 1 || this.rotate || this.clip.x != 0;
      },
      transform: function (x, y) {
        let system = ig.system,
          ctx = system.context,
          scale = system.scale;

        ctx.save();
        this.prePos.x = x;
        this.prePos.y = y;

        ctx.translate(
          ig.system.getDrawPos(x + this.translate.x),
          ig.system.getDrawPos(y + this.translate.y),
        );

        if (this.clip.x != 0) {
          ctx.beginPath();
          ctx.rect(0, 0, this.clip.x * scale, this.clip.y * scale);
          ctx.clip();
        }

        if (this.scale.x != 1 || this.scale.y != 1 || this.rotate != 0) {
          ctx.translate(ig.system.getDrawPos(this.pivot.x), ig.system.getDrawPos(this.pivot.y));
          ctx.rotate(this.rotate);
          ctx.scale(this.scale.x || 1e-4, this.scale.y || 1e-4);
          ctx.translate(-ig.system.getDrawPos(this.pivot.x), -ig.system.getDrawPos(this.pivot.y));
        }
      },
      kill: function () {
        guiStepPool.free(this);
      },
      clear: function () {
        this.translate.x = this.translate.y = 0;
        this.scale.x = this.scale.y = 1;
        this.rotate = 0;
        this.pivot.x = this.pivot.y = 0;
        this.alpha = 1;
        this.clip.x = this.clip.y = 0;
      },
    });

    // Callback utils {{{
    function runVarsChanged(hooks) {
      for (let i = 0; i < hooks.length; i++) {
        hooks[i].gui.varsChanged && hooks[i].gui.varsChanged();
        runVarsChanged(hooks[i].children);
      }
    }
    // }}}
    let g = [];
    let j = 0;
    ig.Gui = ig.GameAddon.extend({
      guiHooks: [],
      namedGuiElements: {},
      screenBlocked: false,
      renderer: new ig.Renderer2dUI(),
      mouseListenerHooks: [],
      controlModule: null,

      init: function () {
        this.parent('GUI');

        // Currently commented out because the storage system isn't implemented yet
        // Implementation details have to be discussed
        //// ig.storage.register(this)
      },
      setControlModule: function (module) {
        this.controlModule = module;
      },
      onStorageSave: function () {
        throw Error('Not implemented');
      },
      onStoragePreLoad: function () {
        throw Error('Not implemented');
      },

      deferredUpdateOrder: 300,
      onDeferredUpdate: function () {
        this.screenBlocked = false;
        this.renderer.clearDrawSteps();
        this._updateGuiMouse();
        j = 0;
        this._updateRecursive(
          0,
          0,
          ig.system.width,
          ig.system.height,
          g,
          true,
          this.guiHooks,
          0,
          0,
          1,
          true,
        );
        ig.game.mapRenderingBlocked = this.screenBlocked;
      },

      postDrawOrder: 500,
      onPostDraw: function () {
        this.renderer.draw();
      },

      onVarsChanged: function () {
        runVarsChanged(this.guiHooks);
      },
      clearNamedGuiElements: function () {
        for (let i in this.namedGuiElements) this.namedGuiElements[i].remove();
        this.namedGuiElements = {};
      },
      onReset: function () {
        this.clearNamedGuiElements();
        for (let i = this.guiHooks.length; i--; ) {
          if (this.guiHooks[i].temporary) {
            this.guiHooks[i].onDetach();
            this.guiHooks.splice(i, 1);
          }
        }
      },
      logGUIArray: function () {
        console.groupCollapsed('GUI Array Elements:');
        for (let i in ig.GUI) ig.GUI[i] && console.log(i);
        console.groupEnd();
      },

      createEventGui: function (a, name, c, d) {},
      spawnEventGui: function (a) {},
      freeEventGui: function (a) {},

      addGuiElement: function (element) {
        let hook = element.hook;
        element.removeAfterTransition = false;
        if (this.guiHooks.indexOf(element) == -1) {
          this.guiHooks.push(element);
          this.guiHooks.sort(function (a, b) {
            return a.zIndex - b.zIndex;
          });
          element.onAttach(this);
        }
      },
      sortGui: function () {
        this.guiHooks.sort(function (a, b) {
          return a.zIndex - b.zIndex;
        });
      },
      removeGuiElement: function (element) {
        this.guiHooks.erase(a.hook);
      },

      _updateGuiMouse: function () {
        let mouseX, mouseY;
        if (this.controlModule) {
          mouseX = this.controlModule.getMouseX();
          mouseY = this.controlModule.getMouseY();
        } else {
          mouseX = ig.input.mouse.x;
          mouseY = ig.input.mouse.y;
        }

        //! TODO: Implement sc.Control and resume here
        for (
          let c = null, d = this.controlModule && this.controlModule.getGuiClick(), e = 0;
          i < this.mouseListenerHooks.length;
          e++
        ) {}
      },
    });
    ig.addGameAddon(function () {
      return (ig.gui = new ig.Gui());
    });
  });
