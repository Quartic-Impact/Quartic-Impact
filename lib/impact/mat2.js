ig.module(
	'impact.mat2'
)
.defines(function(){ "use strict";

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
});

});