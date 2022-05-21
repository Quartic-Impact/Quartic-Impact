ig.module(
	'impact.vec3'
)
.defines(function(){ "use strict";

ig.Vec3 = ig.Class.extend({
    x: 0, y: 0, z: 0,

    init: function(x, y, z) {
        this.x = x !== undefined ? x : 0;
        this.y = y !== undefined ? y : this.x;
        this.z = z !== undefined ? z : this.x;
        return this;
    },

    clone: function() {
        return new ig.Vec3(this.x, this.y, this.z);
    },

    add: function(vecOrScalar) {
        this.x += vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y += vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z += vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        return this;
    },

    subtract: function(vecOrScalar) {
        this.x -= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y -= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z -= vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        return this;
    },
    sub: this.subtract,

    multiply: function(vecOrScalar) {
        this.x *= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y *= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z *= vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        return this;
    },
    mul: this.multiply,

    divide: function(vecOrScalar) {
        this.x /= vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar;
        this.y /= vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar;
        this.z /= vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar;
        return this;
    },
    div: this.divide,

    min: function(vecOrScalar) {
        this.x = Math.min(this.x, vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar);
        this.y = Math.min(this.y, vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar);
        this.z = Math.min(this.z, vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar);
        return this;
    },

    max: function(vecOrScalar) {
        this.x = Math.max(this.x, vecOrScalar.x !== undefined ? vecOrScalar.x : vecOrScalar);
        this.y = Math.max(this.y, vecOrScalar.x !== undefined ? vecOrScalar.y : vecOrScalar);
        this.z = Math.max(this.z, vecOrScalar.x !== undefined ? vecOrScalar.z : vecOrScalar);
        return this;
    },

    distance: function(vec) {
        let dx = this.x - vec.x,
            dy = this.y - vec.y,
            dz = this.z - vec.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },

    distanceSquared: function(vec) {
        let dx = this.x - vec.x,
            dy = this.y - vec.y,
            dz = this.z - vec.z;
        return dx * dx + dy * dy + dz * dz;
    },

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    lengthSquared: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },

    rcp: function() {
        this.x = 1.0 / this.x;
        this.y = 1.0 / this.y;
        this.z = 1.0 / this.z;
        return this;
    },

    normalize: function() {
        let len = this.len();
        let invLen = 1.0 / len;
        this.x *= invLen;
        this.y *= invLen;
        this.z *= invLen;
        return this;
    },

    dot: function(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    },

    cross: function(vec) {
        let x = this.x, y = this.y, z = this.z;
        this.x = y * vec.z - z * vec.y;
        this.y = z * vec.x - x * vec.z;
        this.z = x * vec.y - y * vec.x;
        return this;
    },

    lerp: function(vec, t) {
        this.x += (vec.x - this.x) * t;
        this.y += (vec.y - this.y) * t;
        this.z += (vec.z - this.z) * t;
        return this;
    },

    mat3Multiply: function(mat) {
        let x = this.x, y = this.y, z = this.z;
        this.x = x * mat.m00 + y * mat.m01 + z * mat.m02;
        this.y = x * mat.m10 + y * mat.m11 + z * mat.m12;
        this.z = x * mat.m20 + y * mat.m21 + z * mat.m22;
        return this;
    },
    multMat3: this.mat3Multiply,

    rotate: function(angle, axis, origin) {

        if(!origin) {
            origin = new ig.Vec3(0);
        }

        this.sub(origin);
    
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
    
        let rotMat;

        if(axis == "x") {
            rotMat = new ig.Mat3(
                1, 0, 0,
                0, cos, -sin,
                0, sin, cos
            );
        }
        else if(axis == "y") {
            rotMat = new ig.Mat3(
                cos, 0, sin,
                0, 1, 0,
                -sin, 0, cos
            );
        }
        else if(axis == "z") {
            rotMat = new ig.Mat3(
                cos, -sin, 0,
                sin, cos, 0,
                0, 0, 1
            );
        }

        if(rotMat == undefined) {
            throw "ig.Vec3.rotate: axis is undefined";
        }
    
        this.multMat3(rotMat);
        this.add(origin);

        return this;
    }
});

});