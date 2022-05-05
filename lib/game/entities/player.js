ig.module('game.entities.player')
  .requires('impact.entity')
  .defines(function () {
    EntityPlayer = ig.Entity.extend({
      type: ig.Entity.TYPE.A,
      lastDir: '',

      init(x, y, settings) {
        this.parent(x, y, settings);

        // Entity size, make sure it corresponds to spritesheet
        this.size = { x: 28, y: 30 };

        // Ground friction
        this.friction.x = 200;
        this.gravityFactor = 10;

        // Animation stuff
        this.animSheet = new ig.AnimationSheet('media/player-new.png', 28, 31);
        this.addAnim('idle', 0.1, [0]);
        this.addAnim('run', 0.1, [1, 2, 3]);
      },

      update() {
        this.parent();

        if (ig.input.state('right')) {
          if (this.vel.x < 0) {
            this.vel.x = 0;
          }
          this.lastDir = 'right';
          this.currentAnim = this.anims.run;
          this.currentAnim.flip.x = false;
          this.vel.x = 60;
        }
        if (ig.input.state('left')) {
          if (this.vel.x > 0) {
            this.vel.x = 0;
          }
          this.lastDir = 'left';
          this.currentAnim = this.anims.run;
          this.currentAnim.flip.x = true;
          this.vel.x = -60;
        }

        // TODO: Autojump?
        // if (ig.input.state('jump')) {
        //   this.currentAnim = this.anims.idle;
        //   this.vel.y -= 50;
        // }

        if (this.vel.x == 0) {
          this.currentAnim = this.anims.idle;
          this.lastDir == 'left'
            ? (this.currentAnim.flip.x = true)
            : (this.currentAnim.flip.x = false);
        }
      },
    });
  });
