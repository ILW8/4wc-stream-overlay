const TEAMSIZE = 4;
const DEBUG = false;

const cache = {};
const timer = {
	in_progress: false,
	object: null,
	object_blink: null
};

let mappool, teams;
(async () => {
	$.ajaxSetup({ cache: false });
	mappool = await $.getJSON('../_data/beatmaps.json');
	teams = await $.getJSON('../_data/teams.json');
	const stage = mappool.stage;
	if (stage) {
		$('#stage').text(stage);
		if (stage.toUpperCase() === 'QUARTERFINALS') $('#stage').addClass('qf');
	}
})();

const hidePickByLabel = async () => {
	const pickedByContainer = $('#picked_by_container');
	pickedByContainer.css('animation', 'none');
	void (pickedByContainer[0].offsetWidth); // Trigger reflow
	pickedByContainer.css('animation', 'pickerIn 300ms ease forwards reverse');
	await delay(300);
	$('#picked_by').text('');
};

window.setInterval(async () => {
	const currentPick = localStorage.getItem('current_pick');

	const checkValid = async () => {
		if (!cache.mapid) return -9;

		const pickValue = currentPick.split('/');
		if (pickValue.length !== 2) return -1;

		const parsedBeatmapID = parseInt(pickValue[0]);
		if (isNaN(parsedBeatmapID)) return -2;

		if (currentPick === cache.currentPick && cache.mapid == parsedBeatmapID) return -5;
		if (cache.mapid !== parsedBeatmapID) return -6;

		const parsedTeam = pickValue[1];
		if (parsedTeam !== 'red' && parsedTeam !== 'blue') return -3;

		cache.currentPick = currentPick;

		// if (true) {  // bypass beatmap id checking during development
		if (cache.mapid === parsedBeatmapID) {
			const mapObj = mappool.beatmaps.find(m => m.beatmap_id === cache.mapid);
			if (mapObj?.identifier?.toUpperCase().includes('TB')) return -4;
			if (cache.nameRed && cache.nameBlue) {
				if (cache.pickLabelEnabled) {
					await hidePickByLabel();
				}

				requestAnimationFrame(_ => {
					$('#picked_by').text(`PICKED BY ${(parsedTeam === 'red' ? cache.nameRed : cache.nameBlue).toUpperCase()}`);
					$('#picked_by_container').css('animation', 'none');
					void $('#picked_by_container')[0].offsetWidth; // Trigger reflow
					$('#picked_by_container').css('animation', 'pickerIn 300ms 100ms ease forwards');
				});

				cache.pickLabelEnabled = true;
			}
			else {
				await hidePickByLabel();
				cache.pickLabelEnabled = false;
			}
			return 0;
		}
		return -255;
	};

	const validityState = await checkValid();

	if (validityState === -5)
		return;

	if (validityState !== 0) {
		if (cache.pickLabelEnabled) {
			await hidePickByLabel();
			cache.pickLabelEnabled = false;
		}
	}
}, 500);

const animation = {
	red_score: new CountUp('score_red', 0, 0, 0, .3, { useEasing: true, useGrouping: true, separator: ',', decimal: '.', suffix: '' }),
	blue_score: new CountUp('score_blue', 0, 0, 0, .3, { useEasing: true, useGrouping: true, separator: ',', decimal: '.', suffix: '' }),
	score_diff: new CountUp('score_diff', 0, 0, 0, .3, { useEasing: true, useGrouping: true, separator: ',', decimal: '.', suffix: '' }),
}

const socket = new ReconnectingWebSocket(DEBUG ? 'ws://127.0.0.1:24051/' : `ws://${location.host}/websocket/v2`);
socket.onopen = () => { console.log('Successfully Connected'); };
socket.onclose = event => { console.log('Socket Closed Connection: ', event); socket.send('Client Closed!'); };
socket.onerror = error => { console.log('Socket Error: ', error); };

socket.onmessage = async event => {
	const data = JSON.parse(event.data);
	const now = Date.now();

	if (cache.scoreVisible !== data.tourney.scoreVisible) {
		cache.scoreVisible = data.tourney.scoreVisible;

		if (cache.scoreVisible) {
			$('#chat_container').css('animation', 'chatIn 300ms ease forwards reverse');
			$('#score_area').css('opacity', 1);
			// $('#map_title_container').addClass('expanded');
		} else {
			$('#chat_container').css('animation', 'chatIn 300ms ease forwards');
			$('#score_area').css('opacity', 0);
			// $('#map_title_container').removeClass('expanded');
		}
	}


	if (cache.starsVisible !== data.tourney.starsVisible) {
		cache.starsVisible = data.tourney.starsVisible;
		if (cache.starsVisible) {
			$('#blue_points').css('opacity', 1);
			$('#red_points').css('opacity', 1);

		} else {
			$('#blue_points').css('opacity', 0);
			$('#red_points').css('opacity', 0);
		}
	}


	if (teams && data.tourney.team.left && cache.nameRed !== data.tourney.team.left) {
		cache.nameRed = data.tourney.team.left || 'Red Team';
		$('#red_name').text(cache.nameRed);
		const team = teams.find(t => t.team === cache.nameRed);

		$('#red_flag').css('background-image', `url('../_shared/assets/flags/${team?.flag ?? 'XX'}.png')`);
		$('#red_seed').text(`SEED ${team?.seed ?? 'X'}`);
	}

	if (teams && data.tourney.team.right && cache.nameBlue !== data.tourney.team.right) {
		cache.nameBlue = data.tourney.team.right || 'Blue Team';
		$('#blue_name').text(cache.nameBlue);
		const team = teams.find(t => t.team === cache.nameBlue);

		$('#blue_flag').css('background-image', `url('../_shared/assets/flags/${team?.flag ?? 'XX'}.png')`);
		$('#blue_seed').text(`SEED ${team?.seed ?? 'X'}`);
	}

	if (cache.bestOf !== data.tourney.bestOF) {
		const newmax = Math.ceil(data.tourney.bestOF / 2);
		if (cache.bestOf === undefined) {
			for (let i = 1; i <= newmax; i++) {
				$('#red_points').append($('<div></div>').attr('id', `red${i}`).addClass('team-point red'));
				$('#blue_points').append($('<div></div>').attr('id', `blue${i}`).addClass('team-point blue'));
			}
		}
		else if (cache.bestOf < data.tourney.bestOF) {
			for (let i = cache.firstTo + 1; i <= newmax; i++) {
				$('#red_points').append($('<div></div>').attr('id', `red${i}`).addClass('team-point red'));
				$('#blue_points').append($('<div></div>').attr('id', `blue${i}`).addClass('team-point blue'));
			}
		}
		else {
			for (let i = firstTo; i > newmax; i--) {
				$(`#red${i}`).remove();
				$(`#blue${i}`).remove();
			}
		}
		cache.bestOf = data.tourney.bestOF;
		cache.firstTo = newmax;
	}

	if (cache.starsRed !== data.tourney.points.left) {
		cache.starsRed = data.tourney.points.left;
		for (let i = 1; i <= cache.starsRed; i++) { $(`#red${i}`).addClass('filled'); }
		for (let i = cache.starsRed + 1; i <= cache.firstTo; i++) { $(`#red${i}`).removeClass('filled'); }
	}

	if (cache.starsBlue !== data.tourney.points.right) {
		cache.starsBlue = data.tourney.points.right;
		for (let i = 1; i <= cache.starsBlue; i++) { $(`#blue${i}`).addClass('filled'); }
		for (let i = cache.starsBlue + 1; i <= cache.firstTo; i++) { $(`#blue${i}`).removeClass('filled'); }
	}

	if (mappool && cache.md5 !== data.beatmap.checksum) {
		cache.md5 = data.beatmap.checksum;
		setTimeout(() => { cache.update_stats = true }, 250);
	}

	if (cache.update_stats) {
		cache.update_stats = false;
		cache.mapid = data.beatmap.id;
		cache.map = mappool ? mappool.beatmaps.find(m => m.beatmap_id === cache.mapid || m.md5 === cache.md5) ?? { id: cache.mapid, mods: 'NM', identifier: null } : { id: null, mods: 'NM', identifier: null };
		const mods = cache.map?.mods ?? 'NM';
		const stats = getModStats(data.beatmap.stats.cs.original, data.beatmap.stats.ar.original, data.beatmap.stats.od.original, data.beatmap.stats.bpm.common, mods);
		const len_ = data.beatmap.time.lastObject - data.beatmap.time.firstObject;

		$('#cs').text(stats.cs);
		$('#ar').text(stats.ar);
		$('#od').text(stats.od);
		$('#bpm').text(cache.map?.bpm ?? stats.bpm);
		$('#length').text(`${Math.trunc((len_ / stats.speed) / 1000 / 60)}:${Math.trunc((len_ / stats.speed) / 1000 % 60).toString().padStart(2, '0')}`);
		$('#sr').text(`${Number(cache.map?.sr ?? data.beatmap.stats.stars.total).toFixed(2)}`);

		$('#title').text(`${data.beatmap.artist} - ${data.beatmap.title}`);
		$('#subtitle').text(`[${data.beatmap.version}] by ${cache.map?.mapper || data.beatmap.mapper}`);

		// cache.map.identifier = 'HD2';
		if (cache.map?.identifier) {
			$('#beatmap_slot_container').css('animation', 'mapSlotIn 300ms 50ms ease forwards');
			$('#beatmap_slot').text(cache.map.identifier);
			cache.map_slot_active = true;
		}
		else {
			if (cache.map_slot_active) {
				$('#beatmap_slot_container').css('animation', 'mapSlotIn 300ms ease forwards reverse');
				await delay(300);
			}
			$('#beatmap_slot').text('');
			cache.map_slot_active = false;
		}

		const path = `http://${location.host}/Songs/${data.folders.beatmap}/${data.files.background}`.replace(/#/g, '%23').replace(/%/g, '%25').replace(/\\/g, '/').replace(/'/g, `\\'`);
		$('#beatmap_image').css('background-image', `url('${path}')`);
	}

	if (cache.scoreVisible) {
		const scores = [];
		const ez_multiplier = cache.map?.ez_multiplier || 1;
		for (let i = 0; i < TEAMSIZE * 2; i++) {
			let score = data.tourney.clients[i]?.play?.score || 0;
			if (data.tourney.clients[i]?.play?.mods?.name?.toUpperCase().includes('EZ')) score *= ez_multiplier;
			scores.push({ id: i, score });
		}

		cache.scoreRed = scores.filter(s => s.id < TEAMSIZE).map(s => s.score).reduce((a, b) => a + b);
		cache.scoreBlue = scores.filter(s => s.id >= TEAMSIZE).map(s => s.score).reduce((a, b) => a + b);
		// cache.scoreRed = 1665624;
		// cache.scoreBlue = 796743;
		const scorediff = Math.abs(cache.scoreRed - cache.scoreBlue);

		animation.red_score.update(cache.scoreRed);
		animation.blue_score.update(cache.scoreBlue);
		animation.score_diff.update(scorediff);

		const lead_bar_width = `${Math.max(10, 360 * (Math.min(0.5, Math.pow(scorediff / 1000000, 0.7)) * 2))}px`;

		if (cache.scoreRed > cache.scoreBlue) {
			$('#score_red').addClass('winning');
			$('#score_blue').removeClass('winning');

			$('#score_diff_red').addClass('visible');
			$('#score_diff_blue').removeClass('visible');

			$('#lead_bar').css('width', lead_bar_width);
			$('#lead_bar').addClass('red').removeClass('blue');
		}
		else if (cache.scoreBlue > cache.scoreRed) {
			$('#score_red').removeClass('winning');
			$('#score_blue').addClass('winning');

			$('#score_diff_red').removeClass('visible');
			$('#score_diff_blue').addClass('visible');

			$('#lead_bar').css('width', lead_bar_width);
			$('#lead_bar').removeClass('red').addClass('blue');
		}
		else {
			$('#score_red').removeClass('winning');
			$('#score_blue').removeClass('winning');

			$('#score_diff_red').removeClass('visible');
			$('#score_diff_blue').removeClass('visible');

			$('#lead_bar').css('width', '0px');
			$('#lead_bar').removeClass('red blue');
		}
	}

	if (cache.chatLen !== data.tourney.chat.length && teams) {
		const current_chat_len = data.tourney.chat.length;
		if (cache.chatLen === 0 || (cache.chatLen > 0 && cache.chatLen > current_chat_len)) { $('#chat').html(''); cache.chatLen = 0; }

		for (let i = cache.chatLen || 0; i < current_chat_len; i++) {
			const chat = data.tourney.chat[i];
			const body = chat.message;
			const timestamp = chat.timestamp;
			if (body.toLowerCase().startsWith('!mp')) {
				if (!cache.chat_loaded) continue;
				const command = body.toLowerCase();
				const command_value = Number(command.match(/\d+/)) ?? 0;

				if (command.startsWith('!mp timer')) {
					if (isNaN(command_value)) { stop_timer(); continue; }
					else start_timer(command_value);
				}
				else if ((command.startsWith('!mp aborttimer') && command.startsWith('!mp start')) && timer_in_progress) stop_timer();
				else continue;
			}

			const player = chat.name;
			if (player === 'BanchoBot' && body.startsWith('Match history')) continue;

			const team = team_lookup[chat.team] ?? 'unknown';
			const team_actual = teams.find(t => t.players.map(p => p.username).includes(player))?.team;
			const teamcode_actual = team_actual ? team_actual === cache.nameRed ? 'red' : team_actual === cache.nameBlue ? 'blue' : null : null;

			const chatParent = $('<div></div>').addClass(`chat-message ${teamcode_actual || team}`);

			chatParent.append($('<div></div>').addClass('chat-time').text(timestamp));
			chatParent.append($('<div></div>').addClass(`chat-name ${team}`).text(player));
			chatParent.append($('<div></div>').addClass('chat-body').text(body));
			$('#chat').prepend(chatParent);
		}

		cache.chatLen = data.tourney.chat.length;
		cache.chat_loaded = true;
	}
}

const really_start_timer = length => {
	timer_in_progress = true;
	$('#timer_progress').css('animation', 'none');
	$('#timer_container').addClass('visible');
	$('#timer_progress').css('animation', `progress ${length}s linear`);

	if (length > 3) {
		timer.object_blink = setTimeout(() => {
			if (!timer_in_progress) return;
			$('#timer_progress').css('animation', `progress ${length}s linear, progress_blink 0.5s infinite ease 0.5s`);
		}, (length - 3) * 1000);
	}

	timer.object = setTimeout(() => {
		if (!timer_in_progress) return;
		stop_timer();
	}, length * 1000);
}

const start_timer = length => {
	window.requestAnimationFrame(() => {
		stop_timer();
		window.requestAnimationFrame(() => {
			really_start_timer(length);
		})
	})
}

const stop_timer = () => {
	clearTimeout(timer.object);
	clearTimeout(timer.object_blink);
	timer_in_progress = false;
	$('#timer_progress').css('animation', 'none');
	$('#timer_container').removeClass('visible');
}

const team_lookup = {
	bot: 'bot',
	left: 'red',
	right: 'blue'
}

const getModStats = (cs_raw, ar_raw, od_raw, bpm_raw, mods) => {
	mods = mods.replace('NC', 'DT');

	const speed = mods.includes('DT') ? 1.5 : mods.includes('HT') ? 0.75 : 1;

	let ar = mods.includes('HR') ? ar_raw * 1.4 : mods.includes('EZ') ? ar_raw * 0.5 : ar_raw;
	const ar_ms = Math.max(Math.min(ar <= 5 ? 1800 - 120 * ar : 1200 - 150 * (ar - 5), 1800), 450) / speed;
	ar = ar < 5 ? (1800 - ar_ms) / 120 : 5 + (1200 - ar_ms) / 150;

	const cs = Math.round(Math.min(mods.includes('HR') ? cs_raw * 1.3 : mods.includes('EZ') ? cs_raw * 0.5 : cs_raw, 10) * 10) / 10;

	let od = mods.includes('HR') ? od_raw * 1.4 : mods.includes('EZ') ? od_raw * 0.5 : od_raw;
	if (speed !== 1) od = Math.round(Math.min((79.5 - Math.min(79.5, Math.max(19.5, 79.5 - Math.ceil(6 * od))) / speed) / 6, 11) * 10) / 10;

	return {
		cs: Math.round(cs * 10) / 10,
		ar: Math.round(ar * 10) / 10,
		od: Math.round(od * 10) / 10,
		bpm: Math.round(bpm_raw * speed * 10) / 10,
		speed
	}
}
