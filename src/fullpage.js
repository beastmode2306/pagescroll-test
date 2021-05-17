const FullPage = function (selector, options = {}) {
	this.$root = document.querySelector(selector);
	this.current_slide = 0;
	this.options = options;
	this.slide_count = null;
	this.current_slide = 0;
	this.user_height = null;
	this.animating = false;
	this.accumulated_touchmove = 0;
};

FullPage.prototype.init = function () {
	// Doing mobile view height magic trick!
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
	// Determining user window height
	this.user_height = window.innerHeight;
	// Counts the number of slides
	this.slide_count = this.$root.querySelectorAll(".slide").length;

	// Listening to wheel event to trigger animation
	const scroll_listener = document.addEventListener("wheel", (e) => {
		e.deltaY > 0 ? this.moveNext() : this.movePrev();
	});

	// Listening to resize event to change variables and call reRender method
	const resize_listener = window.addEventListener("resize", (e) => {
		this.user_height = window.innerHeight;
		this.reRender();
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	});

	// Determining whether device has touch events
	if ("ontouchstart" in window) {
		let touch_start = null;
		window.addEventListener("touchstart", (e) => {
			touch_start = e.changedTouches["0"].clientY;
		});
		window.addEventListener("touchend", (e) => {
			if (this.accumulated_touchmove > this.user_height / 3) {
				if (this.current_slide != this.slide_count - 1) {
					this.moveNext();
				} else {
					this.reRender();
				}
			} else if (-this.accumulated_touchmove > this.user_height / 3) {
				if (this.current_slide != 0) {
					this.movePrev();
				} else {
					this.reRender();
				}
			} else {
				this.reRender();
			}
			this.accumulated_touchmove = 0;
		});

		window.addEventListener("touchmove", (e) => {
			this.accumulated_touchmove = Math.floor(
				touch_start - e.changedTouches["0"].clientY
			);
			this.movePrec(this.accumulated_touchmove);
		});
	}
};

FullPage.prototype.reRender = function () {
	this.$root.style = `transform: translate3d(0px, ${
		this.current_slide * this.user_height * -1
	}px, 0px); transition: all 1000ms ease 0s; height: 100%; position: relative;touch-action: none;`;
};

FullPage.prototype.moveNext = function () {
	if (this.current_slide < this.slide_count - 1 && !this.animating) {
		this.animating = true;
		setTimeout(() => (this.animating = false), 1000);
		this.current_slide++;
		this.$root.style = `transform: translate3d(0px, ${
			this.current_slide * this.user_height * -1
		}px, 0px); transition: all 1000ms ease 0s; height: 100%; position: relative;touch-action: none;`;
	}
};

FullPage.prototype.movePrev = function () {
	if (this.current_slide > 0 && !this.animating) {
		this.animating = true;
		setTimeout(() => (this.animating = false), 1000);
		this.current_slide--;
		this.$root.style = `transform: translate3d(0px, ${
			this.current_slide * this.user_height * -1
		}px, 0px); transition: all 1000ms ease 0s; height: 100%; position: relative;touch-action: none;`;
	}
};

FullPage.prototype.moveTo = function (to_slide) {
	if (to_slide >= 0 && to_slide < this.slide_count && !this.animating) {
		this.current_slide = to_slide;
		this.animating = true;
		setTimeout(() => (this.animating = false), 1000);
		this.$root.style = `transform: translate3d(0px, ${
			this.current_slide * this.user_height * -1
		}px, 0px); transition: all 1000ms ease 0s; height: 100%; position: relative;touch-action: none;`;
	}
};

FullPage.prototype.movePrec = function (y) {
	console.log(
		this.user_height,
		this.slide_count,
		y + this.user_height * this.current_slide
	);
	this.$root.style = `transform: translate3d(0px, ${
		(y + this.user_height * this.current_slide) * -1
	}px, 0px); height: 100%; position: relative;touch-action: none;`;
};
