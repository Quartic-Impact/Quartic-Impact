ig.module(
	'impact.game'
)
.requires(
	'impact.impact',
	'impact.entity',
	'impact.collision-map',
	'impact.background-map'
)
.defines(function(){ "use strict";

ig.Game = ig.Class.extend({
	
	clearColor: '#000000',
	gravity: 0,
	screen: {x: 0, y: 0},
	_rscreen: {x: 0, y: 0},
	
	entities: [],
	
	namedEntities: {},
	collisionMap: ig.CollisionMap.staticNoCollision,
	backgroundMaps: [],
	backgroundAnims: {},
	
	autoSort: false,
	sortBy: null,
	
	cellSize: 64,
	
	_deferredKill: [],
	_levelToLoad: null,
	_doSortEntities: false,

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

	init: function() {
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
	},

	staticInstantiate: function() {
		this.sortBy = this.sortBy || ig.Game.SORT.Z_INDEX;
		ig.game = this;
		return null;
	},
	
	
	loadLevel: function( data ) {
		this.screen = {x: 0, y: 0};

		// Entities
		this.entities = [];
		this.namedEntities = {};
		for( var i = 0; i < data.entities.length; i++ ) {
			var ent = data.entities[i];
			this.spawnEntity( ent.type, ent.x, ent.y, ent.settings );
		}
		this.sortEntities();
		
		// Map Layer
		this.collisionMap = ig.CollisionMap.staticNoCollision;
		this.backgroundMaps = [];
		for( var i = 0; i < data.layer.length; i++ ) {
			var ld = data.layer[i];
			if( ld.name == 'collision' ) {
				this.collisionMap = new ig.CollisionMap(ld.tilesize, ld.data );
			}
			else {
				var newMap = new ig.BackgroundMap(ld.tilesize, ld.data, ld.tilesetName);
				newMap.anims = this.backgroundAnims[ld.tilesetName] || {};
				newMap.repeat = ld.repeat;
				newMap.distance = ld.distance;
				newMap.foreground = !!ld.foreground;
				newMap.preRender = !!ld.preRender;
				newMap.name = ld.name;
				this.backgroundMaps.push( newMap );
			}
		}
		
		// Call post-init ready function on all entities
		for( var i = 0; i < this.entities.length; i++ ) {
			this.entities[i].ready();
		}
	},
	
	
	loadLevelDeferred: function( data ) {
		this._levelToLoad = data;
	},
	
	
	getMapByName: function( name ) {
		if( name == 'collision' ) {
			return this.collisionMap;
		}
		
		for( var i = 0; i < this.backgroundMaps.length; i++ ) {
			if( this.backgroundMaps[i].name == name ) {
				return this.backgroundMaps[i];
			}
		}
		
		return null;
	},
	
	
	getEntityByName: function( name ) {
		return this.namedEntities[name];
	},
	
	
	getEntitiesByType: function( type ) {
		var entityClass = typeof(type) === 'string'
			? ig.global[type]
			: type;
			
		var a = [];
		for( var i = 0; i < this.entities.length; i++ ) {
			var ent = this.entities[i];
			if( ent instanceof entityClass && !ent._killed ) {
				a.push( ent );
			}
		}
		return a;
	},
	
	
	spawnEntity: function( type, x, y, settings ) {
		var entityClass = typeof(type) === 'string'
			? ig.global[type]
			: type;
			
		if( !entityClass ) {
			throw("Can't spawn entity of type " + type);
		}
		var ent = new (entityClass)( x, y, settings || {} );
		this.entities.push( ent );
		if( ent.name ) {
			this.namedEntities[ent.name] = ent;
		}
		return ent;
	},
	
	
	sortEntities: function() {
		this.entities.sort( this.sortBy );
	},
	
	
	sortEntitiesDeferred: function() {
		this._doSortEntities = true;
	},
	
	
	removeEntity: function( ent ) {
		// Remove this entity from the named entities
		if( ent.name ) {
			delete this.namedEntities[ent.name];
		}
		
		// We can not remove the entity from the entities[] array in the midst
		// of an update cycle, so remember all killed entities and remove
		// them later.
		// Also make sure this entity doesn't collide anymore and won't get
		// updated or checked
		ent._killed = true;
		ent.type = ig.Entity.TYPE.NONE;
		ent.checkAgainst = ig.Entity.TYPE.NONE;
		ent.collides = ig.Entity.COLLIDES.NEVER;
		this._deferredKill.push( ent );
	},
	
	
	run: function() {
		this.update();
		this.draw();
	},
	
	
	update: function(){
		// load new level?
		if( this._levelToLoad ) {
			this.loadLevel( this._levelToLoad );
			this._levelToLoad = null;
		}
		
		// update entities
		this.updateEntities();
		this.checkEntities();
		
		// remove all killed entities
		for( var i = 0; i < this._deferredKill.length; i++ ) {
			this._deferredKill[i].erase();
			this.entities.erase( this._deferredKill[i] );
		}
		this._deferredKill = [];
		
		// sort entities?
		if( this._doSortEntities || this.autoSort ) {
			this.sortEntities();
			this._doSortEntities = false;
		}
		
		// update background animations
		for( var tileset in this.backgroundAnims ) {
			var anims = this.backgroundAnims[tileset];
			for( var a in anims ) {
				anims[a].update();
			}
		}
	},
	
	
	updateEntities: function() {
		for( var i = 0; i < this.entities.length; i++ ) {
			var ent = this.entities[i];
			if( !ent._killed ) {
				ent.update();
			}
		}
	},
	
	
	draw: function(){
		if( this.clearColor ) {
			ig.system.clear( this.clearColor );
		}
		
		// This is a bit of a circle jerk. Entities reference game._rscreen 
		// instead of game.screen when drawing themselfs in order to be 
		// "synchronized" to the rounded(?) screen position
		this._rscreen.x = ig.system.getDrawPos(this.screen.x)/ig.system.scale;
		this._rscreen.y = ig.system.getDrawPos(this.screen.y)/ig.system.scale;
		
		
		var mapIndex;
		for( mapIndex = 0; mapIndex < this.backgroundMaps.length; mapIndex++ ) {
			var map = this.backgroundMaps[mapIndex];
			if( map.foreground ) {
				// All foreground layers are drawn after the entities
				break;
			}
			map.setScreenPos( this.screen.x, this.screen.y );
			map.draw();
		}
		
		
		this.drawEntities();
		
		
		for( mapIndex; mapIndex < this.backgroundMaps.length; mapIndex++ ) {
			var map = this.backgroundMaps[mapIndex];
			map.setScreenPos( this.screen.x, this.screen.y );
			map.draw();
		}
	},
	
	
	drawEntities: function() {
		for( var i = 0; i < this.entities.length; i++ ) {
			this.entities[i].draw();
		}
	},

	
	checkEntities: function() {
		// Insert all entities into a spatial hash and check them against any
		// other entity that already resides in the same cell. Entities that are
		// bigger than a single cell, are inserted into each one they intersect
		// with.
		
		// A list of entities, which the current one was already checked with,
		// is maintained for each entity.
		
		var hash = {};
		for( var e = 0; e < this.entities.length; e++ ) {
			var entity = this.entities[e];
			
			// Skip entities that don't check, don't get checked and don't collide
			if(
				entity.type == ig.Entity.TYPE.NONE &&
				entity.checkAgainst == ig.Entity.TYPE.NONE &&
				entity.collides == ig.Entity.COLLIDES.NEVER
			) {
				continue;
			}
			
			var checked = {},
				xmin = Math.floor( entity.pos.x/this.cellSize ),
				ymin = Math.floor( entity.pos.y/this.cellSize ),
				xmax = Math.floor( (entity.pos.x+entity.size.x)/this.cellSize ) + 1,
				ymax = Math.floor( (entity.pos.y+entity.size.y)/this.cellSize ) + 1;
			
			for( var x = xmin; x < xmax; x++ ) {
				for( var y = ymin; y < ymax; y++ ) {
					
					// Current cell is empty - create it and insert!
					if( !hash[x] ) {
						hash[x] = {};
						hash[x][y] = [entity];
					}
					else if( !hash[x][y] ) {
						hash[x][y] = [entity];
					}
					
					// Check against each entity in this cell, then insert
					else {
						var cell = hash[x][y];
						for( var c = 0; c < cell.length; c++ ) {
							
							// Intersects and wasn't already checkd?
							if( entity.touches(cell[c]) && !checked[cell[c].id] ) {
								checked[cell[c].id] = true;
								ig.Entity.checkPair( entity, cell[c] );
							}
						}
						cell.push(entity);
					}
				} // end for y size
			} // end for x size
		} // end for entities
	}
});

ig.Game.SORT = {
	Z_INDEX: function( a, b ){ return a.zIndex - b.zIndex; },
	POS_X: function( a, b ){ return (a.pos.x+a.size.x) - (b.pos.x+b.size.x); },
	POS_Y: function( a, b ){ return (a.pos.y+a.size.y) - (b.pos.y+b.size.y); }
};

ig.GameAddon = ig.Class.extend({
	levelLoadStartOrder: 0,
	levelLoadedOrder: 0,
	teleportOrder: 0,
	preUpdateOrder: 0,
	postUpdateOrder: 0,
	deferredUpdateOrder: 0,
	preDrawOrder: 0,
	midDrawOrder: 0,
	postDrawOrder: 0,
	resetOrder: 0,
	varsChangedOrder: 0,
	windowFocusOrder: 0,
	name: 'game_addon',
	onLevelLoadStart: null,
	onLevelLoaded: null,
	onTeleport: null,
	onPreUpdate: null,
	onPostUpdate: null,
	onDeferredUpdate: null,
	onPreDraw: null,
	onMidDraw: null,
	onPostDraw: null,
	onReset: null,
	onVarsChanged: null,
	onWindowFocusChanged: null,
	init: function (name) {
		this.name = name ? name : 'game_addon';
	},
});

});