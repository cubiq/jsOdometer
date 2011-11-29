var Odometer = (function () {
	function Odometer (container, digits) {
		var digit, i, l,
			gear;

		this.container = typeof container == 'string' ? document.querySelector(container) : container;
		this.digits = digits;
		
		for (l=0; l<digits; l++) {
			gear = document.createElement('ul');
			gear.id = 'gear' + l;
			gear.className = 'gear';
			this.container.appendChild(gear);
			this.gears.push(gear);
			this.singleValues.push(0);

			for (i=0; i<10; i++) {
				digit = document.createElement('li');
				i == 0 && (digit.className = 'active');
				digit.innerText = i;
				digit.style.webkitTransform = 'rotateX(' + (-36 * i) + 'deg) translateZ(47px)';
				gear.appendChild(digit);
			}
		}
		
		this.container.addEventListener('webkitTransitionEnd', this, false);
	}
	
	Odometer.prototype = {
		value: 0,
		singleValues: [],
		gears: [],
		
		handleEvent: function (e) {
			e.type == 'webkitTransitionEnd' && this.__updateActive(e);
		},
		
		__zeroFill: function (number, width) {
			width -= number.toString().length;
			return new Array(width+1).join('0') + number;
		},
		
		__hasClass: function (el, value) {
			return new RegExp('(^|\\s)' + value + '(\\s|$)').test(el.className);
		},

		__addClass: function (el, value) {
			if (!this.__hasClass(el, value)) el.className = el.className ? el.className + ' ' + value : value;
		},
		
		__removeClass: function (el, value) {
			el.className = el.className.replace(new RegExp('(^|\\s)' + value + '(\\s|$)'), '');
		},
		
		__updateActive: function (e) {
			this.__removeClass(e.target.querySelector('.active'), 'active');

			var active = e.target.id.replace(/[^0-9]/g,'');
			this.__addClass(e.target.querySelector('li:nth-child(' + (this.singleValues[active]+1) + ')'), 'active');
		},

		add: function (value) {
			var i,
				digit = '';

			this.value+= value;
			if (this.value < 0) this.value = 0;
			else if (this.value > Math.pow(10,this.digits)-1) this.value = Math.pow(10,this.digits)-1;

			value = this.__zeroFill(this.value, this.digits);

			for (i=0; i<this.digits; i++) {
				this.singleValues[i] = +value.substr(0+i, 1);
				digit = value.substr(0, i+1);
				this.gears[i].style.webkitTransitionDuration = '500ms';
				this.gears[i].style.webkitTransform = 'translate3d(0,0,0) rotateX(' + digit*36 + 'deg)';
			}
		},
		
		set: function (value) {
			var i,
				digit = '';

			this.value = value;
			if (this.value < 0) this.value = 0;
			else if (this.value > Math.pow(10,this.digits)-1) this.value = Math.pow(10,this.digits)-1;
			value = this.__zeroFill(this.value, this.digits);

			for (i=0; i<this.digits; i++) {
				this.singleValues[i] = +value.substr(0+i, 1);
				digit = value.substr(0, i+1);
				this.gears[i].style.webkitTransitionDuration = '0';
				this.gears[i].style.webkitTransform = 'translate3d(0,0,0) rotateX(' + digit*36 + 'deg)';

				this.__removeClass(this.gears[i].querySelector('.active'), 'active');
				this.__addClass(this.gears[i].querySelector('li:nth-child(' + (this.singleValues[i]+1) + ')'), 'active');
			}
		}
	}
	
	return Odometer;
})();