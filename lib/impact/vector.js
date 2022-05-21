ig.module(
	'impact.vector'
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
})

ig.Mat2 = ig.Class.extend({   
    m00: 1, m01: 0,
    m10: 0, m11: 1,
    
    init: function(m00, m01, m10, m11) {
        this.m00 = m00 !== undefined ? m00 : 1;
        this.m01 = m01 !== undefined ? m01 : 0;
        this.m10 = m10 !== undefined ? m10 : 0;
        this.m11 = m11 !== undefined ? m11 : 1;
    },

    clone: function() {
        return new ig.Mat2(this.m00, this.m01, this.m10, this.m11);
    },

    identity: function() {
        this.m00 = 1;
        this.m01 = 0;
        this.m10 = 0;
        this.m11 = 1;
        return this;
    },

    transpose: function() {
        let tmp = this.m01;
        this.m01 = this.m10;
        this.m10 = tmp;
        return this;
    },

    determinant: function() {
        return this.m00 * this.m11 - this.m01 * this.m10;
    },

    inverse: function() {
        let det = this.determinant();
        if (det !== 0) {
            let invDet = 1 / det;
            let tmp = this.m00;
            this.m00 = this.m11 * invDet;
            this.m01 = -this.m01 * invDet;
            this.m10 = -this.m10 * invDet;
            this.m11 = tmp * invDet;
        }
        else {
            throw "Cannot invert matrix";
        }
        return this;
    },

    mat2Multiply: function(mat) {
        let m00 = this.m00, m01 = this.m01, m10 = this.m10, m11 = this.m11;
        this.m00 = m00 * mat.m00 + m01 * mat.m10;
        this.m01 = m00 * mat.m01 + m01 * mat.m11;
        this.m10 = m10 * mat.m00 + m11 * mat.m10;
        this.m11 = m10 * mat.m01 + m11 * mat.m11;
        return this;
    },
    multMat2: this.mat2Multiply,

    rotate: function(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let m00 = this.m00, m01 = this.m01, m10 = this.m10, m11 = this.m11;
        this.m00 = c * m00 - s * m10;
        this.m01 = c * m01 - s * m11;
        this.m10 = s * m00 + c * m10;
        this.m11 = s * m01 + c * m11;
        return this;
    },

    scale: function(scale) {
        this.m00 *= scale;
        this.m01 *= scale;
        this.m10 *= scale;
        this.m11 *= scale;
        return this;
    },

    setRow: function(row, vec) {
        switch (row) {
            case 0:
                this.m00 = vec.x;
                this.m01 = vec.y;
                break;
            case 1:
                this.m10 = vec.x;
                this.m11 = vec.y;
                break;
            default:
                throw "Invalid row";
        }
        return this;
    },
})

ig.Mat3 = ig.Class.extend({
    m00: 1, m01: 0, m02: 0,
    m10: 0, m11: 1, m12: 0,
    m20: 0, m21: 0, m22: 1,

    init: function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        this.m00 = m00 !== undefined ? m00 : 1;
        this.m01 = m01 !== undefined ? m01 : 0;
        this.m02 = m02 !== undefined ? m02 : 0;
        this.m10 = m10 !== undefined ? m10 : 0;
        this.m11 = m11 !== undefined ? m11 : 1;
        this.m12 = m12 !== undefined ? m12 : 0;
        this.m20 = m20 !== undefined ? m20 : 0;
        this.m21 = m21 !== undefined ? m21 : 0;
        this.m22 = m22 !== undefined ? m22 : 1;
    },

    clone: function() {
        return new ig.Mat3(
            this.m00, this.m01, this.m02,
            this.m10, this.m11, this.m12, 
            this.m20, this.m21, this.m22
        );
    },

    identity: function() {
        this.m00 = 1;
        this.m01 = 0;
        this.m02 = 0;
        this.m10 = 0;
        this.m11 = 1;
        this.m12 = 0;
        this.m20 = 0;
        this.m21 = 0;
        this.m22 = 1;
        return this;
    },
    
    transpose: function() {
        let tmp = this.m01;
        this.m01 = this.m10;
        this.m10 = tmp;
        tmp = this.m02;
        this.m02 = this.m20;
        this.m20 = tmp;
        tmp = this.m12;
        this.m12 = this.m21;
        this.m21 = tmp;
        return this;
    },

    determinant: function() {
        return this.m00 * (this.m11 * this.m22 - this.m21 * this.m12) -
               this.m01 * (this.m10 * this.m22 - this.m20 * this.m12) +
               this.m02 * (this.m10 * this.m21 - this.m20 * this.m11);
    },

    inverse: function() {
        let det = this.determinant();
        if (det !== 0) {
            let invDet = 1 / det;
            let m00 = this.m00, m01 = this.m01, m02 = this.m02,
                m10 = this.m10, m11 = this.m11, m12 = this.m12,
                m20 = this.m20, m21 = this.m21, m22 = this.m22;
            this.m00 = invDet * (m11 * m22 - m21 * m12);
            this.m01 = invDet * (m02 * m21 - m01 * m22);
            this.m02 = invDet * (m01 * m12 - m02 * m11);
            this.m10 = invDet * (m12 * m20 - m10 * m22);
            this.m11 = invDet * (m00 * m22 - m02 * m20);
            this.m12 = invDet * (m02 * m10 - m00 * m12);
            this.m20 = invDet * (m10 * m21 - m11 * m20);
            this.m21 = invDet * (m01 * m20 - m00 * m21);
            this.m22 = invDet * (m00 * m11 - m01 * m10);
        }
        else {
            throw "Cannot invert matrix";
        }
        return this;
    },

    mat3Multiply: function(mat) {
        let m00 = this.m00, m01 = this.m01, m02 = this.m02,
            m10 = this.m10, m11 = this.m11, m12 = this.m12,
            m20 = this.m20, m21 = this.m21, m22 = this.m22;
        this.m00 = m00 * mat.m00 + m01 * mat.m10 + m02 * mat.m20;
        this.m01 = m00 * mat.m01 + m01 * mat.m11 + m02 * mat.m21;
        this.m02 = m00 * mat.m02 + m01 * mat.m12 + m02 * mat.m22;
        this.m10 = m10 * mat.m00 + m11 * mat.m10 + m12 * mat.m20;
        this.m11 = m10 * mat.m01 + m11 * mat.m11 + m12 * mat.m21;
        this.m12 = m10 * mat.m02 + m11 * mat.m12 + m12 * mat.m22;
        this.m20 = m20 * mat.m00 + m21 * mat.m10 + m22 * mat.m20;
        this.m21 = m20 * mat.m01 + m21 * mat.m11 + m22 * mat.m21;
        this.m22 = m20 * mat.m02 + m21 * mat.m12 + m22 * mat.m22;
        return this;
    },
    multMat3: this.mat3Multiply,
    
    rotate: function(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let m00 = this.m00, m01 = this.m01, m02 = this.m02,
            m10 = this.m10, m11 = this.m11, m12 = this.m12;
        this.m00 = c * m00 - s * m10;
        this.m01 = c * m01 - s * m11;
        this.m02 = c * m02 - s * m12;
        this.m10 = s * m00 + c * m10;
        this.m11 = s * m01 + c * m11;
        this.m12 = s * m02 + c * m12;
        return this;
    },

    scale: function(vec) {
        this.m00 *= vec.x;
        this.m01 *= vec.x;
        this.m02 *= vec.x;
        this.m10 *= vec.y;
        this.m11 *= vec.y;
        this.m12 *= vec.y;
        return this;
    },

    setRow: function(row, vec) {
        switch (row) {
            case 0:
                this.m00 = vec.x;
                this.m01 = vec.y;
                this.m02 = vec.z;
                break;
            case 1:
                this.m10 = vec.x;
                this.m11 = vec.y;
                this.m12 = vec.z;
                break;
            case 2:
                this.m20 = vec.x;
                this.m21 = vec.y;
                this.m22 = vec.z;
                break;
        }
        return this;
    }
});

ig.Mat4 = ig.Class.extend({
    m00: 1, m01: 0, m02: 0, m03: 0,
    m10: 0, m11: 1, m12: 0, m13: 0,
    m20: 0, m21: 0, m22: 1, m23: 0,
    m30: 0, m31: 0, m32: 0, m33: 1,

    init: function(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        this.m00 = m00 !== undefined ? m00 : 1;
        this.m01 = m01 !== undefined ? m01 : 0;
        this.m02 = m02 !== undefined ? m02 : 0;
        this.m03 = m03 !== undefined ? m03 : 0;
        this.m10 = m10 !== undefined ? m10 : 0;
        this.m11 = m11 !== undefined ? m11 : 1;
        this.m12 = m12 !== undefined ? m12 : 0;
        this.m13 = m13 !== undefined ? m13 : 0;
        this.m20 = m20 !== undefined ? m20 : 0;
        this.m21 = m21 !== undefined ? m21 : 0;
        this.m22 = m22 !== undefined ? m22 : 1;
        this.m23 = m23 !== undefined ? m23 : 0;
        this.m30 = m30 !== undefined ? m30 : 0;
        this.m31 = m31 !== undefined ? m31 : 0;
        this.m32 = m32 !== undefined ? m32 : 0;
        this.m33 = m33 !== undefined ? m33 : 1;
    },

    clone: function() {
        return new ig.Mat4(
            this.m00, this.m01, this.m02, this.m03, 
            this.m10, this.m11, this.m12, this.m13, 
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    },
    
    identity: function() {
        this.m00 = 1;
        this.m01 = 0;
        this.m02 = 0;
        this.m03 = 0;
        this.m10 = 0;
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m20 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m30 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        return this;
    },
});


});