ig.module(
	'impact.util.maths.vec4'
)
.defines(function(){ "use strict";

ig.Vec4 = ig.Class.extend({
    x: 0, y: 0, z: 0, w: 0,

    init: function(x, y, z, w) {
        this.x = x !== undefined ? x : 0;
        this.y = y !== undefined ? y : this.x;
        this.z = z !== undefined ? z : this.x;
        this.w = w !== undefined ? w : this.x;
        return this;
    },

    clone: function() {
        return new ig.Vec4(this.x, this.y, this.z, this.w);
    },

    add: function(vecOrScalar) {
        this.x += vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y += vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z += vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        this.w += vecOrScalar.x !== undefined ? vecOrScalar.w : vecOrScalar;
        return this;
    },

    subtract: function(vecOrScalar) {
        this.x -= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y -= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z -= vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        this.w -= vecOrScalar.x !== undefined ? vecOrScalar.w : vecOrScalar;
        return this;
    },
    sub: this.subtract,

    multiply: function(vecOrScalar) {
        this.x *= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y *= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z *= vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        this.w *= vecOrScalar.x !== undefined ? vecOrScalar.w : vecOrScalar;
        return this;
    },
    mul: this.multiply,

    divide: function(vecOrScalar) {
        this.x /= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y /= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z /= vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        this.w /= vecOrScalar.x !== undefined ? vecOrScalar.w : vecOrScalar;
        return this;
    },
    div: this.divide,

    min: function(vecOrScalar) {
        this.x = Math.min(this.x, vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar);
        this.y = Math.min(this.y, vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar);
        this.z = Math.min(this.z, vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar);
        this.w = Math.min(this.w, vecOrScalar.x !== undefined ? vecOrScalar.w : vecOrScalar);
        return this;
    },

    max: function(vecOrScalar) {
        this.x = Math.max(this.x, vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar);
        this.y = Math.max(this.y, vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar);
        this.z = Math.max(this.z, vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar);
        this.w = Math.max(this.w, vecOrScalar.x !== undefined ? vecOrScalar.w : vecOrScalar);
        return this;
    },

    distance: function(vec) {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        const dz = this.z - vec.z;
        const dw = this.w - vec.w;
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    },

    distanceSquared: function(vec) {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        const dz = this.z - vec.z;
        const dw = this.w - vec.w;
        return dx * dx + dy * dy + dz * dz + dw * dw;
    },

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },

    lengthSquared: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },

    rcp: function() {
        this.x = 1 / this.x;
        this.y = 1 / this.y;
        this.z = 1 / this.z;
        this.w = 1 / this.w;
        return this;
    },

    normalize: function() {
        let len = this.length();
        let invLen = 1 / len; 
        this.x *= invLen;
        this.y *= invLen;
        this.z *= invLen;
        this.w *= invLen;
        return this;
    },

    dot: function(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
    },

    lerp: function(vec, t) {
        this.x += (vec.x - this.x) * t;
        this.y += (vec.y - this.y) * t;
        this.z += (vec.z - this.z) * t;
        this.w += (vec.w - this.w) * t;
        return this;
    },

    mat4Multiply: function(mat) {
        let x = this.x, y = this.y, z = this.z, w = this.w;
        this.x = x * mat.m00 + y * mat.m01 + z * mat.m02 + w * mat.m03;
        this.y = x * mat.m10 + y * mat.m11 + z * mat.m12 + w * mat.m13;
        this.z = x * mat.m20 + y * mat.m21 + z * mat.m22 + w * mat.m23;
        this.w = x * mat.m30 + y * mat.m31 + z * mat.m32 + w * mat.m33;
        return this;
    },
    multMat4: this.mat4Multiply,
});

});