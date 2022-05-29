ig.module("impact.util.maths.quaternion").requires(
	"impact.util.maths.vec3",
	"impact.util.maths.mat4"
).defines(function () {

	ig.Quaternion = ig.Class.extend({

		init(x, y, z, w) {
			this.x = x || 0;
			this.y = y || 0;
			this.z = z || 0;
			this.w = w || 1;
		},

		get(index) {
			switch (index) {
				case 0:
					return this.x;
				case 1:
					return this.y;
				case 2:
					return this.z;
				case 3:
					return this.w;
				default:
					throw new Error("Invalid Quaternion index.");
			}
		},

		set(index, value) {
			switch (index) {
				case 0:
					this.x = value;
					break;
				case 1:
					this.y = value;
					break;
				case 2:
					this.z = value;
					break;
				case 3:
					this.w = value;
					break;
				default:
					throw new Error("Invalid Quaternion index.");
			}
		},

		multiply(left, right) {
			return new ig.Quaternion(
				left.w * right.x + left.x * right.w + left.y * right.z - left.z * right.y,
				left.w * right.y + left.y * right.w + left.z * right.x - left.x * right.z,
				left.w * right.z + left.z * right.w + left.x * right.y - left.y * right.x,
				left.w * right.w - left.x * right.x - left.y * right.y - left.z * right.z
			);
		},

		rotatePoint(rotation, point) {

			const x = rotation.x * 2;
			const y = rotation.y * 2;
			const z = rotation.z * 2;
			const xx = rotation.x * x;
			const yy = rotation.y * y;
			const zz = rotation.z * z;
			const xy = rotation.x * y;
			const xz = rotation.x * z;
			const yz = rotation.y * z;
			const wx = rotation.w * x;
			const wy = rotation.w * y;
			const wz = rotation.w * z;

			const res = new ig.Vec3();

			res.x = (1 - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z;
			res.y = (xy + wz) * point.x + (1 - (xx + zz)) * point.y + (yz - wx) * point.z;
			res.z = (xz - wy) * point.x + (yz + wx) * point.y + (1 - (xx + yy)) * point.z;

			return res;
		},

		isEqualUsingDot(dot) {
			return dot > 1.0 - 0.000001;
		},

		equal(left, right) {
			return Quaternion.isEqualUsingDot(Quaternion.dot(left, right));
		},

		dot(left, right) {
			return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
		},

		angle(left, right) {
			const dot = Quaternion.dot(left, right);
			return Quaternion.isEqualUsingDot(dot) ? 0 : Math.acos(Math.min(Math.abs(dot), 1)) * 2 * (360 / (Math.PI * 2));
		},

		_internalMakePositive(euler) {
			const negativeFlip = -0.0001 * (360 / (Math.PI * 2));
			const positiveFlip = 360 + negativeFlip;


			if (euler.x < negativeFlip)
				euler.x += 360.0;
			else if (euler.x > positiveFlip)
				euler.x -= 360.0;

			if (euler.y < negativeFlip)
				euler.y += 360.0;
			else if (euler.y > positiveFlip)
				euler.y -= 360.0;

			if (euler.z < negativeFlip)
				euler.z += 360.0;
			else if (euler.z > positiveFlip)
				euler.z -= 360.0;

			return euler;
		},


		// https://en.wikipedia.org/wiki/ConversionBetweenQuaternionsAndEulerAngles?oldformat=true#QuaternionToEulerAnglesConversion
		toEuler(q) {
			const t0 = 2 * (q.w * q.x + q.y * q.z);
			const t1 = 1 - 2 * (q.x * q.x + q.y * q.y);
			const rollX = Math.atan2(t0, t1);

			let t2 = 2 * (q.w * q.y - q.z * q.x);
			t2 = t2 > 1 ? 1 : t2;
			t2 = t2 < -1 ? -1 : t2;
			const pitchY = Math.asin(t2);

			const t3 = 2 * (q.w * q.z + q.x * q.y);
			const t4 = 1 - 2 * (q.y * q.y + q.z * q.z);
			const yawZ = Math.atan2(t3, t4);

			return new Vector3(rollX, pitchY, yawZ);
		},

		// https://en.wikipedia.org/wiki/ConversionBetweenQuaternionsAndEulerAngles?oldformat=true#EulerAnglesToQuaternionConversion
		fromEuler(v) {
			const c1 = Math.cos(v.x / 2);
			const c2 = Math.cos(v.y / 2);
			const c3 = Math.cos(v.z / 2);
			const s1 = Math.sin(v.x / 2);
			const s2 = Math.sin(v.y / 2);
			const s3 = Math.sin(v.z / 2);

			const q = new Quaternion();
			q.x = s1 * c2 * c3 + c1 * s2 * s3;
			q.y = c1 * s2 * c3 - s1 * c2 * s3;
			q.z = c1 * c2 * s3 + s1 * s2 * c3;
			q.w = c1 * c2 * c3 - s1 * s2 * s3;

			return q;
		},

		// https://automaticaddison.com/how-to-convert-a-quaternion-to-a-rotation-matrix/
		toRotationMatrix() {
			// Precalculate coordinate products
			const x = this.x * 2;
			const y = this.y * 2;
			const z = this.z * 2;
			const xx = this.x * x;
			const yy = this.y * y;
			const zz = this.z * z;
			const xy = this.x * y;
			const xz = this.x * z;
			const yz = this.y * z;
			const wx = this.w * x;
			const wy = this.w * y;
			const wz = this.w * z;

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

		conjugated() {
			return new Quaternion(-this.x, -this.y, -this.z, this.w);
		},

		norm() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
		},

		squareNorm() {
			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
		}

	})
});