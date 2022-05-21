ig.module(
	'impact.mat3'
)
.defines(function(){ "use strict";

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

});