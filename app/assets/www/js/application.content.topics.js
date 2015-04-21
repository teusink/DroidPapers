// JSLint, include this before tests
// var $, window, homeTopicsClickHandler, showTopicTitle, showTopicContent, checkConnection, getTopSetWalls, getTopSetRings, getLastSetWalls, getLastSetRings, getRecentAddedWalls, getRecentAddedRings, getHdWalls, getTopSetWalls, getTopSetRings;

// home page topics menu
function homePageCards() {
	var aGridIndex = $('#aGridIndex'),
		bGridIndex = $('#bGridIndex'),
		cGridIndex = $('#cGridIndex'),
		top30setwallpapers = $.t('top30setwallpapers'),
		top30setringtones = $.t('top30setringtones'),
		last30setwallpapers = $.t('last30setwallpapers'),
		last30setringtones = $.t('last30setringtones'),
		recentaddedwallpapers = $.t('recentaddedwallpapers'),
		recentaddedringtones = $.t('recentaddedringtones'),
		myfavoritewallpapers = $.t('myfavoritewallpapers'),
		myfavoriteringtones = $.t('myfavoriteringtones'),
		allwallpapers = $.t('allwallpapers'),
		allringtones = $.t('allringtones');
	aGridIndex.empty();
	bGridIndex.empty();
	cGridIndex.empty();
	aGridIndex.append(
		'<div class="card" id="allWallsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_wallpapers.jpg" />' +
			'<h2>' + allwallpapers + '</h2></div>' +
			'</div>'
	);
	$('#allWallsButton').off("click").on("click",
		function () {
			$("body").pagecontainer("change", "#distributionsWallsPage");
		});
	aGridIndex.append(
		'<div class="card" id="allRingsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_alarms.jpg" />' +
			'<h2>' + allringtones + '</h2></div>' +
			'</div>'
	);
	$('#allRingsButton').off("click").on("click",
		function () {
			$("body").pagecontainer("change", "#distributionsRingsPage");
		});
	aGridIndex.append(
		'<div class="card" id="favWallsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_wallpapers.jpg" />' +
			'<div class="star"></div><h2>' + myfavoritewallpapers + '</h2></div>' +
			'</div>'
	);
	$('#favWallsButton').off("click").on("click",
		function () {
			$("body").pagecontainer("change", "#wpFavoritesPage");
		});
	aGridIndex.append(
		'<div class="card" id="favRingsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_notifications.jpg" />' +
			'<div class="star"></div><h2>' + myfavoriteringtones + '</h2></div>' +
			'</div>'
	);
	$('#favRingsButton').off("click").on("click",
		function () {
			$("body").pagecontainer("change", "#rtFavoritesPage");
		});
	bGridIndex.append(
		'<div class="card" id="top30SetWallsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_wallpapers.jpg" />' +
			'<div class="achievement"></div><h2>' + top30setwallpapers + '</h2></div>' +
			'</div>'
	);
	homeTopicsClickHandler('top30SetWallsButton', 'top30SetWalls');
	bGridIndex.append(
		'<div class="card" id="top30SetRingsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_ringtones.jpg" />' +
			'<div class="achievement"></div><h2>' + top30setringtones + '</h2></div>' +
			'</div>'
	);
	homeTopicsClickHandler('top30SetRingsButton', 'top30SetRings');
	bGridIndex.append(
		'<div class="card" id="last30SetWallsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_wallpapers.jpg" />' +
			'<div class="gear"></div><h2>' + last30setwallpapers + '</h2></div>' +
			'</div>'
	);
	homeTopicsClickHandler('last30SetWallsButton', 'last30SetWalls');
	cGridIndex.append(
		'<div class="card" id="last30SetRingsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_notifications.jpg" />' +
			'<div class="gear"></div><h2>' + last30setringtones + '</h2></div>' +
			'</div>'
	);
	homeTopicsClickHandler('last30SetRingsButton', 'last30SetRings');
	cGridIndex.append(
		'<div class="card" id="recentAddedWallsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_wallpapers.jpg" />' +
			'<div class="reload"></div><h2>' + recentaddedwallpapers + '</h2></div>' +
			'</div>'
	);
	homeTopicsClickHandler('recentAddedWallsButton', 'recentAddedWalls');
	cGridIndex.append(
		'<div class="card" id="recentAddedRingsButton">' +
			'<div class="card-image"><img alt="home" src="./images/cards/card_ringtones.jpg" />' +
			'<div class="reload"></div><h2>' + recentaddedringtones + '</h2></div>' +
			'</div>'
	);
	homeTopicsClickHandler('recentAddedRingsButton', 'recentAddedRings');
}

// home topics click handler
function homeTopicsClickHandler(id, topic) {
	$("#" + id).off("click").on("click",
		function () {
			window.localStorage.setItem("cardSubject", topic);
			$("body").pagecontainer("change", "#topicPage");
		});
}

// set title topic page
function showTopicTitle() {
	var topic;
	if (window.localStorage.getItem("cardSubject") !== null && window.localStorage.getItem("cardSubject") !== "") {
		if (window.localStorage.getItem("cardSubject") === "top30SetWalls") {
			topic = $.t('top30setwallpapers');
		} else if (window.localStorage.getItem("cardSubject") === "last30SetWalls") {
			topic = $.t('last30setwallpapers');
		} else if (window.localStorage.getItem("cardSubject") === "top30SetRings") {
			topic = $.t('top30setringtones');
		} else if (window.localStorage.getItem("cardSubject") === "last30SetRings") {
			topic = $.t('last30setringtones');
		} else if (window.localStorage.getItem("cardSubject") === "recentAddedWalls") {
			topic = $.t('recentaddedwallpapers');
		} else if (window.localStorage.getItem("cardSubject") === "recentAddedRings") {
			topic = $.t('recentaddedringtones');
		}
	} else {
		topic = $.t('topics');
	}
	$('#topicTitle').empty().append(topic);
}

// show contents of topic
function showTopicContent() {
	var connection = checkConnection(),
		pleaseselectatopic = $.t('pleaseselectatopic');
	if (window.localStorage.getItem("cardSubject") !== null && window.localStorage.getItem("cardSubject") !== "") {
		if (window.localStorage.getItem("cardSubject") === "top30SetWalls" && connection !== "None") {
			getTopSetWalls();
		} else if (window.localStorage.getItem("cardSubject") === "last30SetWalls" && connection !== "None") {
			getLastSetWalls();
		} else if (window.localStorage.getItem("cardSubject") === "top30SetRings" && connection !== "None") {
			getTopSetRings();
		} else if (window.localStorage.getItem("cardSubject") === "last30SetRings" && connection !== "None") {
			getLastSetRings();
		} else if (window.localStorage.getItem("cardSubject") === "recentAddedWalls") {
			getRecentAddedWalls();
		} else if (window.localStorage.getItem("cardSubject") === "recentAddedRings") {
			getRecentAddedRings();
		} else if (connection === "None") {
			$('#topicContent').empty().append('<p>No internet connection detected.</p>');
		}
	} else {
		$('#topicContent').empty().append('<p>' + pleaseselectatopic + '</p>');
	}
}

function showTopicContentOffline() {
	var nowifi = $.t('nowifi');
	$('#topicContent').empty().append('<p>' + nowifi + '</p>');
}