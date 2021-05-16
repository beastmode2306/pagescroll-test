const FullPage = function (selector, options = {}) {
	this.$root = document.querySelector(selector);
	this.current_slide = 0;
	this.options = options;
	this.slide_count = null;
	this.current_slide = null;
	this.user_height = null;
	this.animating = false;
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
			touch_start > e.changedTouches["0"].clientY
				? this.moveNext()
				: this.movePrev();
		});
	}
};

FullPage.prototype.reRender = function () {
	this.$root.style = `transform: translate3d(0px, -${
		this.current_slide * this.user_height
	}px, 0px); transition: all 1000ms ease 0s; height: 100%; position: relative;touch-action: none;`;
};

FullPage.prototype.moveNext = function () {
	if (this.current_slide < this.slide_count - 1 && !this.animating) {
		this.animating = true;
		setTimeout(() => (this.animating = false), 1000);
		this.current_slide++;
		this.$root.style = `transform: translate3d(0px, -${
			this.current_slide * this.user_height
		}px, 0px); transition: all 1000ms ease 0s; height: 100%; position: relative;touch-action: none;`;
	}
};

FullPage.prototype.movePrev = function () {
	if (this.current_slide > 0 && !this.animating) {
		this.animating = true;
		setTimeout(() => (this.animating = false), 1000);
		this.current_slide--;
		this.$root.style = `transform: translate3d(0px, -${
			this.current_slide * this.user_height
		}px, 0px); transition: all 1000ms ease 0s; height: 100%; position: relative;touch-action: none;`;
	}
};
