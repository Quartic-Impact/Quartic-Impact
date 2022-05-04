/*
This entity calls ig.game.loadLevel() when its triggeredBy() method is called -
usually through an EntityTrigger entity.


Keys for Weltmeister:

level
	Name of the level to load. E.g. "LevelTest1" or just "test1" will load the 
	'LevelTest1' level.
*/

ig.module('game.entities.levelchange')
  .requires('impact.entity')
  .defines(function () {
    EntityLevelchange = ig.Entity.extend({
      _wm: new ig.Config({
        _attributes: {
          level: {
            _type: 'String',
            _info:
              'Name of the level to load E.g. "LevelTest1" or just "test1" will load the \'LevelTest1\' level.',
          },
        },
      }),
      _wmDrawBox: true,
      _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

      size: { x: 8, y: 8 },
      level: null,

      triggeredBy: function (entity, trigger) {
        console.log(entity, trigger)
        // if (this.level) {
        //   ig.game.teleport(this.level)
        // }
      },

      update: function () {},
    });
  });
