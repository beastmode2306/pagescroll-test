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
	function detectMob() {
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i,
		];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
	}

	this.slide_count = this.$root.querySelectorAll(".slide").length;
	const scroll_listener = document.addEventListener("wheel", (e) => {
		e.deltaY > 0 ? this.moveNext() : this.movePrev();
	});

	this.$root.querySelector(
		".slide"
	).textContent = `inner: ${window.innerHeight} outer: ${window.outerHeight}`;

	if (detectMob()) {
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

			const resize_listener = window.addEventListener("resize", (e) => {
				this.user_height = window.outerHeight;
				this.reRender();

				this.$root.querySelector(
					".slide"
				).textContent = `inner: ${window.innerHeight} outer: ${window.outerHeight}`;
			});

			setTimeout(() => {
				this.user_height = window.outerHeight;
			}, 100);
		}
	} else {
		setTimeout(() => {
			this.user_height = Math.min(window.innerHeight, window.outerHeight);
		}, 100);

		const resize_listener = window.addEventListener("resize", (e) => {
			this.user_height = Math.min(window.innerHeight, window.outerHeight);
			this.reRender();

			this.$root.querySelector(
				".slide"
			).textContent = `inner: ${window.innerHeight} outer: ${window.outerHeight}`;
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
