ig.module(
        'impact.util.maths.mat4'
    )
    .requires(
        "impact.util.maths.vec3",
        "impact.util.maths.quaternion",
    )
    .defines(function () {
        "use strict";

        ig.Mat4 = ig.Class.extend({
            m00: 1,
            m01: 0,
            m02: 0,
            m03: 0,
            m10: 0,
            m11: 1,
            m12: 0,
            m13: 0,
            m20: 0,
            m21: 0,
            m22: 1,
            m23: 0,
            m30: 0,
            m31: 0,
            m32: 0,
            m33: 1,

            init: function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
                m00 ? this.m00 = m00 : void 0;
                m01 ? this.m01 = m01 : void 0;
                m02 ? this.m02 = m02 : void 0;
                m03 ? this.m03 = m03 : void 0;
                m10 ? this.m10 = m10 : void 0;
                m11 ? this.m11 = m11 : void 0;
                m12 ? this.m12 = m12 : void 0;
                m13 ? this.m13 = m13 : void 0;
                m20 ? this.m20 = m20 : void 0;
                m21 ? this.m21 = m21 : void 0;
                m22 ? this.m22 = m22 : void 0;
                m23 ? this.m23 = m23 : void 0;
                m30 ? this.m30 = m30 : void 0;
                m31 ? this.m31 = m31 : void 0;
                m32 ? this.m32 = m32 : void 0;
                m33 ? this.m33 = m33 : void 0;
            },

            clone: function () {
                return new ig.Mat4(
                    this.m00, this.m01, this.m02, this.m03,
                    this.m10, this.m11, this.m12, this.m13,
                    this.m20, this.m21, this.m22, this.m23,
                    this.m30, this.m31, this.m32, this.m33
                );
            },

            identity: function () {
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

            vec3Multiply(point) {
                const res = new ig.Vec3();

                res.x = this.m00 * point.x + this.m01 * point.y + this.m02 * point.z + this.m03;
                res.y = this.m10 * point.x + this.m11 * point.y + this.m12 * point.z + this.m13;
                res.z = this.m20 * point.x + this.m21 * point.y + this.m22 * point.z + this.m23;

                let w = this.m30 * point.x + this.m31 * point.y + this.m32 * point.z + this.m33;

                w = 1 / w;
                res.x *= w;
                res.y *= w;
                res.z *= w;

                return res;
            },
            multVec3: this.vec3Multiply,

            createScalar(scalarVec3) {
                const m = new ig.Mat4();

                m.m00 = scalarVec3.x;
                m.m10 = 0;
                m.m20 = 0;
                m.m30 = 0;
                m.m01 = 0;
                m.m11 = scalarVec3.y;
                m.m21 = 0;
                m.m31 = 0;
                m.m02 = 0;
                m.m12 = 0;
                m.m22 = scalarVec3.z;
                m.m32 = 0;
                m.m03 = 0;
                m.m13 = 0;
                m.m23 = 0;
                m.m33 = 1;

                return m;
            },

            createTranslation(translationVec3) {
                const m = new ig.Mat4();

                m.m00 = 1;
                m.m10 = 0;
                m.m20 = 0;
                m.m30 = translationVec3.x;
                m.m01 = 0;
                m.m11 = 1;
                m.m21 = 0;
                m.m31 = translationVec3.y;
                m.m02 = 0;
                m.m12 = 0;
                m.m22 = 1;
                m.m32 = translationVec3.z;
                m.m03 = 0;
                m.m13 = 0;
                m.m23 = 0;
                m.m33 = 1;

                return m;
            },

            fromQuat(quat) {
                const x = q.x * 2;
                const y = q.y * 2;
                const z = q.z * 2;
                const xx = q.x * x;
                const yy = q.y * y;
                const zz = q.z * z;
                const xy = q.x * y;
                const xz = q.x * z;
                const yz = q.y * z;
                const wx = q.w * x;
                const wy = q.w * y;
                const wz = q.w * z;

                // Calculate 3x3 matrix from orthonormal basis
                const m = new Matrix4x4();

                m.m00 = 1 - (yy + zz);
                m.m10 = xy + wz;
                m.m20 = xz - wy;
                m.m01 = xy - wz;
                m.m11 = 1 - (xx + zz);
                m.m21 = yz + wx;
                m.m02 = xz + wy;
                m.m12 = yz - wx;
                m.m22 = 1 - (xx + yy);

                m.m33 = 1;

                return m;
            },

            // Might be better belonging to ig.Transform instead?
            createTransform(position, scale, rotation) {
                let m = new ig.Mat4();
                const p = ig.Mat4.createTranslation(position);
                const r = ig.Mat4.fromQuat(rotation);
                const s = ig.Mat4.createScalar(scale);

                m = ig.Mat4.multiply(m, p);
                m = ig.Mat4.multiply(m, r);
                m = ig.Mat4.multiply(m, s);

                return m;
            },

            multiply(left, right) {
                const res = new ig.Mat4();

                res.m00 = right.m00 * left.m00 + right.m01 * left.m10 + right.m02 * left.m20 + right.m03 * left.m30;
                res.m01 = right.m00 * left.m01 + right.m01 * left.m11 + right.m02 * left.m21 + right.m03 * left.m31;
                res.m02 = right.m00 * left.m02 + right.m01 * left.m12 + right.m02 * left.m22 + right.m03 * left.m32;
                res.m03 = right.m00 * left.m03 + right.m01 * left.m13 + right.m02 * left.m23 + right.m03 * left.m33;
                res.m10 = right.m10 * left.m00 + right.m11 * left.m10 + right.m12 * left.m20 + right.m13 * left.m30;
                res.m11 = right.m10 * left.m01 + right.m11 * left.m11 + right.m12 * left.m21 + right.m13 * left.m31;
                res.m12 = right.m10 * left.m02 + right.m11 * left.m12 + right.m12 * left.m22 + right.m13 * left.m32;
                res.m13 = right.m10 * left.m03 + right.m11 * left.m13 + right.m12 * left.m23 + right.m13 * left.m33;
                res.m20 = right.m20 * left.m00 + right.m21 * left.m10 + right.m22 * left.m20 + right.m23 * left.m30;
                res.m21 = right.m20 * left.m01 + right.m21 * left.m11 + right.m22 * left.m21 + right.m23 * left.m31;
                res.m22 = right.m20 * left.m02 + right.m21 * left.m12 + right.m22 * left.m22 + right.m23 * left.m32;
                res.m23 = right.m20 * left.m03 + right.m21 * left.m13 + right.m22 * left.m23 + right.m23 * left.m33;
                res.m30 = right.m30 * left.m00 + right.m31 * left.m10 + right.m32 * left.m20 + right.m33 * left.m30;
                res.m31 = right.m30 * left.m01 + right.m31 * left.m11 + right.m32 * left.m21 + right.m33 * left.m31;
                res.m32 = right.m30 * left.m02 + right.m31 * left.m12 + right.m32 * left.m22 + right.m33 * left.m32;
                res.m33 = right.m30 * left.m03 + right.m31 * left.m13 + right.m32 * left.m23 + right.m33 * left.m33;

                return res;
            },

            perspective(fovRadians, aspectRatio, near, far) {
                const res = new ig.Mat4();

                if (0 > near || near > far) throw new Error("invalid clipping plane values");

                const c = Math.tan(Math.PI / 2 - fovRadians / 2);

                res.m00 = c / aspectRatio;
                res.m11 = c;
                res.m22 = (near + far) * (1 / (near - far));
                res.m23 = -1;
                res.m32 = near * far * (1 / (near - far)) * 2;

                return res;
            },

            orthographic(left, right, bottom, top, near, far) {
                const res = new Matrix4x4();

                res.m00 = 2 / (right - left);
                res.m11 = 2 / (top - bottom);
                res.m22 = 2 / (far - near);
                res.m30 = -((right + left) / (right - left));
                res.m31 = -((top + bottom) / (top - bottom));
                res.m32 = -((far + near) / (far - near));
                res.m33 = 1;

                return res;
            },

            toQuaternion() {
                let t;
                let q;

                if (this.m22 < 0.0) {
                    if (this.m00 > this.m11) {
                        t = 1.0 + this.m00 - this.m11 - this.m22;
                        q = new ig.Quaternion(t, this.m10 + this.m01, this.m02 + this.m20, this.m21 - this.m12);
                    } else {
                        t = 1.0 - this.m00 + this.m11 - this.m22;
                        q = new ig.Quaternion(this.m10 + this.m01, t, this.m21 + this.m12, this.m02 - this.m20);
                    }
                } else {
                    if (this.m00 < -this.m11) {
                        t = 1.0 - this.m00 - this.m11 + this.m22;
                        q = new ig.Quaternion(this.m02 + this.m20, this.m21 + this.m12, t, this.m10 - this.m01);
                    } else {
                        t = 1.0 + this.m00 + this.m11 + this.m22;
                        q = new ig.Quaternion(this.m21 - this.m12, this.m02 - this.m20, this.m10 - this.m01, t);
                    }
                }

                const v = 0.5 / Math.sqrt(t);
                q.x *= v;
                q.y *= v;
                q.z *= v;
                q.w *= v;

                return q;
            },

            lookAt(from, to, worldUp) {
                const zAxis = from.clone().subtract(to).normalize(); // Z
                const xAxis = worldUp.clone().cross(zAxis).normalize(); // X
                const yAxis = zAxis.clone().cross(xAxis).normalize(); // Y

                
                this.m00 = xAxis.x; this.m10 = xAxis.y; this.m20 = xAxis.z; this.m30 = 0;
                this.m01 = yAxis.x; this.m11 = yAxis.y; this.m21 = yAxis.z; this.m31 = 0;
                this.m02 = zAxis.x; this.m12 = zAxis.y; this.m22 = zAxis.z; this.m32 = 0;
                this.m03 = from.x; this.m13 = from.y; this.m23 = from.z; this.m33 = 1
                

                return m;
            },

            
            transpose() {
                const /* _m00 = this.m00, */ _m10 = this.m10, _m20 = this.m20, _m30 = this.m30;
                const _m01 = this.m01, /* _m11 = this.m11, */ _m21 = this.m21, _m31 = this.m31;
                const _m02 = this.m02, _m12 = this.m12, /* _m22 = this.m22, */ _m32 = this.m32;
                const _m03 = this.m03, _m13 = this.m13, _m23 = this.m23 /*, _m33 = this.m33; */

                /* this.m00 = _m00; */ this.m10 = _m01; this.m20 = _m02; this.m30 = _m03;
                this.m01 = _m10; /* this.m11 = _m11; */ this.m21 = _m12; this.m31 = _m13;
                this.m02 = _m20; this.m12 = _m21; /* this.m22 = _m22; */ this.m32 = _m23;
                this.m03 = _m30; this.m13 = _m31; this.m23 = _m32; /* this.m33 = _m33 */;
            }
        });
    });