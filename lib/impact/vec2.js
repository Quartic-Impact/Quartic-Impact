ig.module(
	'impact.vec2'
)
.defines(function(){ "use strict";

ig.Vec2 = ig.Class.extend({
    x: 0, y: 0,

    init: function(x, y) {
        this.x = x !== undefined ? x : 0;
        this.y = y !== undefined ? y : this.x;
        return this;
    },

    clone: function() {
        return new ig.Vec2(this.x, this.y);
    },

    add: function(vecOrScalar) {
        this.x += vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y += vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        return this;
    },

    subtract: function(vecOrScalar) {
        this.x -= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y -= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        return this;
    },
    sub: this.subtract,

    multiply: function(vecOrScalar) {
        this.x *= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y *= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        return this;
    },
    mul: this.multiply,

    divide: function(vecOrScalar) {
        this.x /= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y /= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        return this;
    },
    div: this.divide,

    min: function(vecOrScalar) {
        this.x = Math.min(this.x, vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar);
        this.y = Math.min(this.y, vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar);
        return this;
    },

    max: function(vecOrScalar) {
        this.x = Math.max(this.x, vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar);
        this.y = Math.max(this.y, vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar);
        return this;
    },

    distance: function(vec) {
        let dx = this.x - vec.x,
            dy = this.y - vec.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceSquared: function(vec) {
        let dx = this.x - vec.x,
            dy = this.y - vec.y;
        return dx * dx + dy * dy;
    },

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    lengthSquared: function() {
        return this.x * this.x + this.y * this.y;
    },

    rcp: function() {
        this.x = 1.0 / this.x;
        this.y = 1.0 / this.y;
        return this;
    },

    normalize: function() {
        let len = this.len();
        let invLen = 1.0 / len;
        this.x *= invLen;
        this.y *= invLen;
        return this;
    },

    dot: function(vec) {
        return this.x * vec.x + this.y * vec.y;
    },

    lerp: function(vec, t) {
        this.x += (vec.x - this.x) * t;
        this.y += (vec.y - this.y) * t;
        return this;
    },

    mat2Multiply: function(mat) {
        let x = this.x, y = this.y;
        this.x = x * mat.m00 + y * mat.m10;
        this.y = x * mat.m01 + y * mat.m11;
        return this;
    },
    multMat2: this.mat2Multiply,
});

});