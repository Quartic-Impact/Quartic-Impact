ig.module(
	'impact.image'
)
.requires('impact.base.loader')
.defines(function(){ "use strict";

	function scaleImage(data) {
		let srcData = data.src;
		let destData = data.dest;

		let width = srcData.width;
		let widthScaled = destData.width;
		let heightScaled = destData.height;

		let scale = data.scale;
		for(let y = 0; y < heightScaled; y++) {
			for(let x = 0; x < widthScaled; x++) {
				let index = (Math.floor(y / scale) * width + Math.floor(x / scale)) * 4;
				let indexScaled = (y * widthScaled + x) * 4;
				destData.data[indexScaled] = srcData.data[index];
				destData.data[indexScaled + 1] = srcData.data[index + 1];
				destData.data[indexScaled + 2] = srcData.data[index + 2];
				destData.data[indexScaled + 3] = srcData.data[index + 3];
			}
		}
		return {result: destData};
	}

ig.Image = ig.Loadable.extend({
	cacheType: "Image",
	data: null,
	width: 0,
	height: 0,

	init: function( path ) {
		this.parent(path)
	},

	loadInternal: function() {
		this.data = new Image();
		this.data.onload = this.onload.bind(this);
		this.data.onerror = this.onerror.bind(this);
		this.data.src = ig.root + this.path + ig.getCacheSuffix();
	},

	reload: function() {
		this.loaded = false;
		this.data = new Image();
		this.data.onload = this.onload.bind(this);
		this.data.src = ig.root + this.path + '?' + Date.now();
	},

	onload: function() {
		this.width = this.data.width;
		this.height = this.data.height;
		if (ig.system.scale !== 1) this.resize(ig.system.scale);
		else this.loadingFinished(true);
	},

	onerror: function() {
		this.loadingFinished(false);
	},

	resize: function( scale ) {
		// Nearest-Neighbor scaling

		// The original image is drawn into an offscreen canvas of the same size
		// and copied into another offscreen canvas with the new size.
		// The scaled offscreen canvas becomes the image (data) of this object.

		var origPixels = ig.getImagePixels( this.data, 0, 0, this.width, this.height );

		var widthScaled = this.width * scale;
		var heightScaled = this.height * scale;

		var scaled = ig.$new('canvas');
		scaled.width = widthScaled;
		scaled.height = heightScaled;
		var scaledCtx = scaled.getContext('2d');
		var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );

		for( var y = 0; y < heightScaled; y++ ) {
			for( var x = 0; x < widthScaled; x++ ) {
				var index = (Math.floor(y / scale) * this.width + Math.floor(x / scale)) * 4;
				var indexScaled = (y * widthScaled + x) * 4;
				scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
				scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
				scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
				scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
			}
		}
		scaledCtx.putImageData( scaledPixels, 0, 0 );
		this.data = scaled;
	},

	draw: function( targetX, targetY, sourceX, sourceY, width, height ) {
		if( !this.loaded ) { return; }

		var scale = ig.system.scale;
		sourceX = sourceX ? sourceX * scale : 0;
		sourceY = sourceY ? sourceY * scale : 0;
		width = (width ? width : this.width) * scale;
		height = (height ? height : this.height) * scale;

		ig.system.context.drawImage(
			this.data, sourceX, sourceY, width, height,
			ig.system.getDrawPos(targetX),
			ig.system.getDrawPos(targetY),
			width, height
		);

		ig.Image.drawCount++;
	},

	drawTile: function( targetX, targetY, tile, tileWidth, tileHeight, flipX, flipY ) {
		tileHeight = tileHeight ? tileHeight : tileWidth;

		if( !this.loaded || tileWidth > this.width || tileHeight > this.height ) { return; }

		var scale = ig.system.scale;
		var tileWidthScaled = Math.floor(tileWidth * scale);
		var tileHeightScaled = Math.floor(tileHeight * scale);

		var scaleX = flipX ? -1 : 1;
		var scaleY = flipY ? -1 : 1;

		if( flipX || flipY ) {
			ig.system.context.save();
			ig.system.context.scale( scaleX, scaleY );
		}
		ig.system.context.drawImage(
			this.data,
			( Math.floor(tile * tileWidth) % this.width ) * scale,
			( Math.floor(tile * tileWidth / this.width) * tileHeight ) * scale,
			tileWidthScaled,
			tileHeightScaled,
			ig.system.getDrawPos(targetX) * scaleX - (flipX ? tileWidthScaled : 0),
			ig.system.getDrawPos(targetY) * scaleY - (flipY ? tileHeightScaled : 0),
			tileWidthScaled,
			tileHeightScaled
		);
		if( flipX || flipY ) {
			ig.system.context.restore();
		}

		ig.Image.drawCount++;
	}
});

ig.Image.drawCount = 0;
ig.Image.cache = {};
ig.Image.reloadCache = function() {
	for( var path in ig.Image.cache ) {
		ig.Image.cache[path].reload();
	}
};

});
