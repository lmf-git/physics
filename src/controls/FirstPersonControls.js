export default class FirstPersonControls {

    constructor(object, target) {
        object = object;
        target = target;
    }

    object;
	target;

	enabled = true;

	movementSpeed = 1.0;
	lookSpeed = 0.005;

	lookVertical = true;
	autoForward = false;

	activeLook = true;

	heightSpeed = false;
	heightCoef = 1.0;
	heightMin = 0.0;
	heightMax = 1.0;

	constrainVertical = false;
	verticalMin = 0;
	verticalMax = Math.PI;

	autoSpeedFactor = 0.0;

	mouseX = 0;
	mouseY = 0;

	lat = 0;
	lon = 0;
	phi = 0;
	theta = 0;

	moveForward = false;
	moveBackward = false;
	moveLeft = false;
	moveRight = false;

	mouseDragOn = false;

	viewHalfX = 0;
	viewHalfY = 0;

	handleResize = function() {
        this.viewHalfX = window.innerWidth / 2;
        this.viewHalfY = window.innerHeight / 2;
	};

	onMouseMove = function(event) {
        this.mouseX = event.pageX - this.viewHalfX;
        this.mouseY = event.pageY - this.viewHalfY;
	};

	update = function(delta) {
		if (this.enabled === false) return;

		if (this.heightSpeed) {
			let y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
			let heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

		} else {
			this.autoSpeedFactor = 0.0;
		}

		let actualLookSpeed = delta * this.lookSpeed;

		if (!this.activeLook) {
			actualLookSpeed = 0;
		}

		let verticalLookRatio = 1;

		if (this.constrainVertical) {
			verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
		}

		this.lon += this.mouseX * actualLookSpeed;
		if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max(-85, Math.min(85, this.lat));
		this.phi = THREE.Math.degToRad(90 - this.lat);

		this.theta = THREE.Math.degToRad(this.lon);

		if (this.constrainVertical) {
			this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
		}

		let targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
		targetPosition.y = position.y + 100 * Math.cos(this.phi);
		targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

		this.object.lookAt(targetPosition);
	};

	dispose = function() {
		document.removeEventListener('mousemove', this._onMouseMove, false);
	};

	// document.addEventListener('mousemove', this._onMouseMove, false);
	// this.handleResize();
}