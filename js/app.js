var ENDPOINT = 'https://api.spacexdata.com/v3/launches/';
var ENDPOINTAll = 'https://api.spacexdata.com/v3/launches?sort=launch_date_utc';
let position = 0,
	positionstars = 0,
	amount,
	index;

const FULL_CIRCLE = 2 * Math.PI;
let ctx, timer, particles;

const drawStars = ctx => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (let i = 0; i < 10000; i++) {
		ctx.beginPath();
		let x = Math.random() * ctx.canvas.width,
			y = Math.random() * ctx.canvas.height,
			size = Math.random() * 2;

		ctx.arc(x, y, size, 0, FULL_CIRCLE);
		ctx.fillStyle = 'rgb(255, 241, 194)';
		ctx.fill();
	}
};

const loadCanvas = (width = 15) => {
	const canvas = document.querySelectorAll('.js-stars');
	canvas.forEach(element => {
		element.width = document.documentElement.clientWidth * width;
		element.height = document.documentElement.clientHeight;
		ctx = element.getContext('2d');
		drawStars(ctx);
	});
};

const getData = async function() {
	try {
		const data = await fetch(ENDPOINTAll)
			.then(r => r.json())
			.then(data => data);
		showData(data);
	} catch (error) {
		console.warn(error);
	}
};

const showData = function(data) {
	var i = 0;

	data.forEach(element => {
		var datetime = new Date(element.launch_date_utc);

		if (datetime < new Date().getTime()) {
			var location = element.launch_site.site_name_long;
			var rocket = element.rocket.rocket_name;
			var orbit = element.rocket.second_stage.payloads[0].orbit_params.reference_system;
			var position = element.rocket.second_stage.payloads[0].orbit_params.regime;
			var reused = element.rocket.second_stage.payloads[0].reused;
			var mission = element.mission_name;
			var link = element.links.video_link;
			var missionnr = element.flight_number;
			var details = element.details;
			var payload = element.rocket.second_stage.payloads.payload_id;
			var client = element.rocket.second_stage.payloads.customers;

			let reusedtext, rocketimg;

			if (reused) {
				reusedtext = 'reused';
			} else {
				reusedtext = 'brand new';
			}

			switch (rocket) {
				case 'Falcon 9':
					rocketimg = '<img class="c-rocketimg" src="img/falcon9.svg"></img>';
					break;

				case 'Falcon Heavy':
					rocketimg = '<img class="c-rocketimg" src="img/falconheavy.svg"></img>';
					break;

				case 'Falcon 1':
					rocketimg = '<img class="c-rocketimg" src="img/falcon1.svg"></img>';
					break;

				default:
					rocketimg = '<img class="c-rocketimg" src="img/falcon9.svg"></img>';
					break;
			}

			switch (missionnr) {
				case 1:
					missionnr = '1st';
					break;
				case 2:
					missionnr = '2nd';
					break;
				case 3:
					missionnr = '3rd';
					break;
				default:
					missionnr += 'th';
			}

			if (link != null) {
				link = `<p class="c-link">Watch <a href="${link}">here</a></p>`;
			} else {
				link = '';
			}

			/* The N'th launch was "mission"
			"mission details" (in small gray)
			The payload was "pauload" in a "brand new" "rocket"
			for the client "client" on the "date"
			this mission launched from "location"
			Reason of failure: "reason"
			images
			<p class="c-countdown"><span class="js-countdown${i}"></span></p>
				<p class="c-rocketkind">In a ${reusedtext} ${rocket}</p>
				${rocketimg}
				<div class="c-textarea">
					<p class="c-orbit">Going into a ${orbit} ${position} orbit</p>
					<p class="c-date">On ${datetime.toLocaleDateString()} at ${datetime.toLocaleTimeString()} in your local timezone</p>
					<p class="c-launchloc">At ${location}</p>
					${link}
				</div>
				</div>

			 */

			var HTML = `
			<div class="c-content">
				<img class="c-logo" src="img/logo-white.svg"></img>
				<div class="c-form">
				<p class="c-title">The ${missionnr} mission was ${mission}</p>
				<p class="c-details">"${details}"</p>
				<div class="c-textarea">
				<p class="c-title">The payload was ${payload} in a ${reusedtext} ${rocket} for ${client}</p>
				<p class="c-title">This mission launched from ${location}</p>
				</div>

				
			</div>`;

			document.querySelector('.c-container').innerHTML += HTML;
		} else {
			var location = element.launch_site.site_name_long;
			var rocket = element.rocket.rocket_name;
			var orbit = element.rocket.second_stage.payloads[0].orbit_params.reference_system;
			var position = element.rocket.second_stage.payloads[0].orbit_params.regime;
			var reused = element.rocket.second_stage.payloads[0].reused;
			var mission = element.mission_name;
			var link = element.links.video_link;

			let reusedtext, rocketimg;

			if (reused) {
				reusedtext = 'reused';
			} else {
				reusedtext = 'brand new';
			}

			switch (rocket) {
				case 'Falcon 9':
					rocketimg = '<img class="c-rocketimg-out" src="img/falcon9up.svg"></img>';
					break;

				case 'Falcon Heavy':
					rocketimg = '<img class="c-rocketimg-out" src="img/falconheavyup.svg"></img>';
					break;

				case 'Falcon 1':
					rocketimg = '<img class="c-rocketimg-out" src="img/falcon1up.svg"></img>';
					break;

				default:
					rocketimg = '<img class="c-rocketimg-out" src="img/falcon9up.svg"></img>';
					break;
			}

			if (link != null) {
				link = `<p class="c-link">Watch <a href="${link}">here</a></p>`;
			} else {
				link = '';
			}

			var HTML = `
			<div class="c-content">
				<img class="c-logo" src="img/logo-white.svg"></img>
				${rocketimg}
				<div class="c-form">
				<p class="c-title">The next mission is ${mission} and launches in</p>
				<p class="c-countdown"><span class="js-countdown${i}"></span></p>
				<span class="c-timepassed" style="background-color:#1a1763; grid-row: 4; grid-column: 2; width: 40%;"></span><span style="background-color:#A7A9AC66;grid-row: 4; grid-column: 2;"></span>
				<p class="c-rocketkind">In a ${reusedtext} ${rocket}</p>
				<div class="c-textarea">
					<p class="c-orbit">Going into a ${orbit} ${position} orbit</p>
					<p class="c-date">On ${datetime.toLocaleDateString()} at ${datetime.toLocaleTimeString()} in your local timezone</p>
					<p class="c-launchloc">At ${location}</p>
					${link}
				</div>
				</div>
			</div>`;

			document.querySelector('.c-container').innerHTML += HTML;

			showTimer(datetime, i);

			if (index == null) {
				index = i;
			}
		}
		i++;
		amount++;
	});

	document.querySelectorAll('.c-hidden').forEach(element => {
		element.classList.remove('c-hidden');
	});
	document.querySelector('.c-loading').style.display = 'none';

	position = index * 100 * -1;
	document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;

	loadCanvas();
};

const showTimer = function(time, i) {
	var x = setInterval(function() {
		var now = new Date().getTime();
		var distance = time - now;

		var hours = Math.floor(distance / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		document.querySelector(`.js-countdown${i}`).innerHTML = hours + ' hours, ' + minutes + ' minutes and ' + seconds + ' seconds ';
	}, 1000);
};

const init = function() {
	document.querySelector('.c-button-right').addEventListener('click', function() {
		position -= 100;
		positionstars -= 32;
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		document.querySelector('.js-stars').style.transform = `translateX(${positionstars}vw)`;
	});
	document.querySelector('.c-button-left').addEventListener('click', function() {
		position += 100;
		positionstars += 32;
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		document.querySelector('.js-stars').style.transform = `translateX(${positionstars}vw)`;
	});
	getData();
};

document.addEventListener('DOMContentLoaded', function() {
	init();
});
