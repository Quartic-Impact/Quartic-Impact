ig.module(
	'impact.mat4'
)
.defines(function(){ "use strict";

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