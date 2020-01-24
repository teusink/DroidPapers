// JSLint, include this before tests
// var window, $, device, navigator, toggleFavoriteRings, errorHandlerSqlTransaction, getFavoritesRings, toggleFavoriteRings, getInfoSpecificRingAddUl, topicRingClickHandler, storeRingtone, favRingClickHandler, ringsOverviewClickHandler, loadRingsDistro, getOverviewRings, setOverviewRingsTitle, checkConnection, download, toast, playAudio, pauseAudio, stopAudio, share, deleteCache, releaseAudio, Media, stateAudioButtons, audioError, dbVersionHandler, togglePanel, storeVarsRingtone, handleAndroidPreferences, stopAudioCb, startSearchRingtone, getOverviewSearchedRings, currentRingtone, emptyCallback, checkDownload, gaPlugin, gaPluginResultHandler, gaPluginErrorHandler, apiErrorHandler;

// add ringtone to favorites
function createFavoriteRings(url, name, type) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'INSERT INTO entriesRings (url, name, type) VALUES (?, ?, ?);',
				[url, name, type],
				toggleFavoriteRings('remove')
			);
		},
		errorHandlerSqlTransaction
	);
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'rtFavoritesPage') {
		getFavoritesRings(type);
	}
	window.localStorage.setItem("settingFavoritesChanged", "true");
}

// delete ringtone from favorites
function deleteFavoriteRings(url, name, type) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize);
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'DELETE FROM entriesRings WHERE url=? AND name=? AND type=?;',
				[url, name, type],
				toggleFavoriteRings('add')
			);
		},
		errorHandlerSqlTransaction
	);
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'rtFavoritesPage') {
		getFavoritesRings(type);
	}
	window.localStorage.setItem("settingFavoritesChanged", "true");
}

// place correct favorite star for ringtone
function placeFavoriteStarRings(url, name, type) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		favoriteStarRings = $("#favoriteStarRings" + window.localStorage.getItem('divIdGlobal'));
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entriesRings WHERE url=? AND name=? AND type=? LIMIT 0,1;',
				[url, name, type],
				function (transaction, result) {
					if (result.rows.length > 0) {
						favoriteStarRings.attr("src", "./images/icons/ic_action_star_10.png");
						favoriteStarRings.off("click").on("click",
							function () {
								deleteFavoriteRings(window.localStorage.getItem('ringtoneUrl'), window.localStorage.getItem('ringtoneName'), window.localStorage.getItem('ringtoneType'));
							});
					} else {
						favoriteStarRings.attr("src", "./images/icons/ic_action_star_0.png");
						favoriteStarRings.off("click").on("click",
							function () {
								createFavoriteRings(window.localStorage.getItem('ringtoneUrl'), window.localStorage.getItem('ringtoneName'), window.localStorage.getItem('ringtoneType'));
							});
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// toggle favorite star ringtone
function toggleFavoriteRings(toggle) {
	var favoriteStarRings = $("#favoriteStarRings" + window.localStorage.getItem('divIdGlobal'));
	if (toggle === "remove") {
		favoriteStarRings.attr("src", "./images/icons/ic_action_star_10.png");
		favoriteStarRings.off("click").on("click",
			function () {
				deleteFavoriteRings(window.localStorage.getItem('ringtoneUrl'), window.localStorage.getItem('ringtoneName'), window.localStorage.getItem('ringtoneType'));
			});
	} else if (toggle === "add") {
		favoriteStarRings.attr("src", "./images/icons/ic_action_star_0.png");
		favoriteStarRings.off("click").on("click",
			function () {
				createFavoriteRings(window.localStorage.getItem('ringtoneUrl'), window.localStorage.getItem('ringtoneName'), window.localStorage.getItem('ringtoneType'));
			});
	}
}

// get top set rings from API
function getTopSetRings() {
	var alarms = $.t('alarms'),
		notifications = $.t('notifications'),
		ringtones = $.t('ringtones');
	$('#topicContent').empty().append(
		'<div data-role="collapsibleset"><div data-role="collapsible"><h2>' + alarms + '</h2>' +
			'<ul id="topSetAlarms" data-role="listview"></ul>' +
			'</div><div data-role="collapsible"><h2>' + notifications + '</h2>' +
			'<ul id="topSetNotifications" data-role="listview"></ul>' +
			'</div><div data-role="collapsible"><h2>' + ringtones + '</h2>' +
			'<ul id="topSetRingtones" data-role="listview"></ul>' +
			'</div></div>'
	).trigger("create");
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'topset30alarms1month', function (data) {
		var rings = data.items,
			fileFolder,
			substringArray,
			folder,
			ringType,
			filename,
			i;
		$.each(rings, function (index, ring) {
			fileFolder = ring.ringtone.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			ringType = substringArray[1];
			filename = substringArray[2];
			i = index + 1;
			getInfoSpecificRingAddUl(folder, filename, i, 'topSetAlarms');
		});
	}).fail(function () { apiErrorHandler($('#topSetAlarms'), "topset30alarms1month"); });
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'topset30notifications1month', function (data) {
		var rings = data.items,
			fileFolder,
			substringArray,
			folder,
			ringType,
			filename,
			i;
		$.each(rings, function (index, ring) {
			fileFolder = ring.ringtone.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			ringType = substringArray[1];
			filename = substringArray[2];
			i = index + 1;
			getInfoSpecificRingAddUl(folder, filename, i, 'topSetNotifications');
		});
	}).fail(function () { apiErrorHandler($('#topSetNotifications'), "topset30notifications1month"); });
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'topset30ringtones1month', function (data) {
		var rings = data.items,
			fileFolder,
			substringArray,
			folder,
			ringType,
			filename,
			i;
		$.each(rings, function (index, ring) {
			fileFolder = ring.ringtone.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			ringType = substringArray[1];
			filename = substringArray[2];
			i = index + 1;
			getInfoSpecificRingAddUl(folder, filename, i, 'topSetRingtones');
		});
	}).fail(function () { apiErrorHandler($('#topSetRingtones'), "topset30ringtones1month"); });
}

// get last set rings from API
function getLastSetRings() {
	var alarms = $.t('alarms'),
		notifications = $.t('notifications'),
		ringtones = $.t('ringtones');
	$('#topicContent').empty().append(
		'<div data-role="collapsibleset"><div data-role="collapsible"><h2>' + alarms + '</h2>' +
			'<ul id="lastSetAlarms" data-role="listview"></ul>' +
			'</div><div data-role="collapsible"><h2>' + notifications + '</h2>' +
			'<ul id="lastSetNotifications" data-role="listview"></ul>' +
			'</div><div data-role="collapsible"><h2>' + ringtones + '</h2>' +
			'<ul id="lastSetRingtones" data-role="listview"></ul>' +
			'</div></div>'
	).trigger("create");
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'lastset30alarms', function (data) {
		var rings = data.items,
			fileFolder,
			substringArray,
			folder,
			ringType,
			filename,
			i;
		$.each(rings, function (index, ring) {
			fileFolder = ring.ringtone.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			ringType = substringArray[1];
			filename = substringArray[2];
			i = index + 1;
			getInfoSpecificRingAddUl(folder, filename, i, 'lastSetAlarms');
		});
	}).fail(function () { apiErrorHandler($('#lastSetAlarms'), "lastset30alarms"); });
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'lastset30notifications', function (data) {
		var rings = data.items,
			fileFolder,
			substringArray,
			folder,
			ringType,
			filename,
			i;
		$.each(rings, function (index, ring) {
			fileFolder = ring.ringtone.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			ringType = substringArray[1];
			filename = substringArray[2];
			i = index + 1;
			getInfoSpecificRingAddUl(folder, filename, i, 'lastSetNotifications');
		});
	}).fail(function () { apiErrorHandler($('#lastSetNotifications'), "lastset30notifications"); });
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'lastset30ringtones', function (data) {
		var rings = data.items,
			fileFolder,
			substringArray,
			folder,
			ringType,
			filename,
			i;
		$.each(rings, function (index, ring) {
			fileFolder = ring.ringtone.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			ringType = substringArray[1];
			filename = substringArray[2];
			i = index + 1;
			getInfoSpecificRingAddUl(folder, filename, i, 'lastSetRingtones');
		});
	}).fail(function () { apiErrorHandler($('#lastSetRingtones'), "lastset30ringtones"); });
}

// get recently added rings from local
function getRecentAddedRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#topicContent'),
		device,
		type,
		htmlTag,
		endHtmlTag,
		typeFolder,
		currentVersion,
		currentVersionMin1,
		currentVersionMin2,
		norecentringtones = $.t('norecentringtones'),
		alarms = $.t('alarms'),
		notifications = $.t('notifications'),
		ringtones = $.t('ringtones');
	content.empty().append(window.loadingAnimation);
	handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
		currentVersion = dbVersionHandler(prefValue, 0);
		currentVersionMin1 = dbVersionHandler(prefValue, 1);
		currentVersionMin2 = dbVersionHandler(prefValue, 2);
		db.transaction(
			function (transaction) {
				transaction.executeSql(
					'SELECT * FROM dpAppRingtones WHERE version=? OR version=? OR version=? ORDER BY distribution ASC, device ASC, type ASC, name ASC;',
					[currentVersion, currentVersionMin1, currentVersionMin2],
					function (transaction, result) {
						if (result.rows.length === 0) {
							htmlTag = '<p>' + norecentringtones + '</p>';
							content.empty().append(htmlTag).trigger("create");
						} else {
							endHtmlTag = '';
							htmlTag = '';
							var i,
								row;
							for (i = 0; i < result.rows.length; i = i + 1) {
								row = result.rows.item(i);
								if (type !== row.type && i > 0) {
									htmlTag = '</ul></div>';
								}
								if (device !== row.device) {
									if (i > 0) {
										if (type === row.type) {
											htmlTag = '</ul></div></div>';
										} else {
											htmlTag = '</div>';
										}
									}
									htmlTag = htmlTag + '<h3>' + row.distribution + ' ' + row.device + '</h3>' +
										'<div data-role="collapsibleset">';
								}
								if (type !== row.type || device !== row.device) {
									if (row.type === "alarm") {
										htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + alarms + '</h2>';
										typeFolder = "alarms";
									} else if (row.type === "notification") {
										htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + notifications + '</h2>';
										typeFolder = "notifications";
									} else if (row.type === "ringtone") {
										htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + ringtones + '</h2>';
										typeFolder = "ringtones";
									}
									htmlTag = htmlTag + '<ul data-role="listview">';
								}
								htmlTag = htmlTag + '<li data-icon="false"><a onclick="storeRingtone(\'' + window.serviceURL + 'app_content/ringtones/' + row.folder + '/' + typeFolder + '/' + row.filename + '\',\'' + row.name + '\',\'' + row.type + '\');">' + row.name + '</a></li>';
								type = row.type;
								device = row.device;
								endHtmlTag = endHtmlTag + htmlTag;
								htmlTag = '';
							}
							endHtmlTag = endHtmlTag + '</ul></div></div>';
							content.empty().append(endHtmlTag).trigger("create");
						}
					}
				);
			},
			errorHandlerSqlTransaction
		);
	});
}

// topic ringtone information
function getInfoSpecificRingAddUl(folder, filename, i, type) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		ringtonenotindatabase = $.t('ringtonenotindatabase'),
		listRing;
	if (type === "topSetAlarms") {
		listRing = $('#topSetAlarms');
	} else if (type === "topSetNotifications") {
		listRing = $('#topSetNotifications');
	} else if (type === "topSetRingtones") {
		listRing = $('#topSetRingtones');
	} else if (type === "lastSetAlarms") {
		listRing = $('#lastSetAlarms');
	} else if (type === "lastSetNotifications") {
		listRing = $('#lastSetNotifications');
	} else if (type === "lastSetRingtones") {
		listRing = $('#lastSetRingtones');
	}
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM dpAppRingtones WHERE filename="' + filename + '" AND folder="' + folder + '" LIMIT 0,1;',
				null,
				function (transaction, result) {
					if (result.rows.length === 0) {
						listRing.append('<li data-icon="false">' + ringtonenotindatabase + '</li>').listview('refresh');
					} else {
						var row = result.rows.item(0),
							url,
							typeFolder,
							tag;
						if (row.type === "alarm") {
							typeFolder = "alarms";
						} else if (row.type === "notification") {
							typeFolder = "notifications";
						} else if (row.type === "ringtone") {
							typeFolder = "ringtones";
						}
						url = window.serviceURL + 'app_content/ringtones/' + row.folder + '/' + typeFolder + '/' + row.filename;
						tag = '<li data-icon="false"><a id="' + type + i + '">' + row.name;
						tag = tag + '</a></li>';
						listRing.append(tag);
						topicRingClickHandler(type + i, url, row.name, row.type);
						listRing.listview('refresh');
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// topic ringtones click handler
function topicRingClickHandler(id, url, name, type) {
	$("#" + id).off("click").on("click",
		function () {
			storeRingtone(url, name, type);
		});
}

// get all favorite ringtones
function getFavoritesRings(type) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		typeCap = '',
		rtFavorite,
		nofavoriteringtones = $.t('nofavoriteringtones');
	if (type === "alarm") { typeCap = "Alarms"; }
	if (type === "notification") { typeCap = "Notifications"; }
	if (type === "ringtone") { typeCap = "Ringtones"; }
	rtFavorite = $('#rtFavorite' + typeCap);
	rtFavorite.children().remove('li');
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entriesRings WHERE type="' + type + '" ORDER BY name ASC;',
				null,
				function (transaction, result) {
					if (result.rows.length === 0) {
						rtFavorite.append('<li data-icon="false">' + nofavoriteringtones + '</li>').listview('refresh');
					} else {
						var i,
							row;
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							rtFavorite.append('<li data-icon="false"><a id="favRing' + typeCap + i + '">' + row.name + '</a></li>');
							favRingClickHandler('favRing' + typeCap + i, row.url, row.name, type);
						}
						rtFavorite.listview('refresh');
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// favorite ringtones click handler
function favRingClickHandler(id, url, name, type) {
	$("#" + id).off("click").on("click",
		function () {
			storeRingtone(url, name, type);
		});
}

// get all distributions for ringtones
function getOverviewDistributionsRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		nodistributionsdatabase = $.t('nodistributionsdatabase');
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM dpAppDistributions WHERE ringtones="yes" ORDER BY name ASC, os ASC;',
				null,
				function (transaction, result) {
					var aGridDistributionsRings = $('#aGridDistributionsRings'),
						bGridDistributionsRings = $('#bGridDistributionsRings'),
						cGridDistributionsRings = $('#cGridDistributionsRings'),
						i,
						row,
						logo,
						tag;
					aGridDistributionsRings.empty();
					bGridDistributionsRings.empty();
					cGridDistributionsRings.empty();
					if (result.rows.length === 0) {
						aGridDistributionsRings.append('<div class="card"><p>' +  nodistributionsdatabase + '</p></div>');
					} else {
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							logo = row.logo.replace(".png", ".jpg");
							tag = '<div class="card" id="DistroRingsButton' + i + '">' +
									'<div class="card-image"><img alt="' + row.name + '" src="' + window.serviceURL + 'app_content/logos/' + logo + '" />' +
									'<h2>' + row.name + '</h2></div>' +
									'</div>';
							if (i < (result.rows.length / 3)) {
								aGridDistributionsRings.append(tag);
							} else if (i < ((result.rows.length / 3) * 2)) {
								bGridDistributionsRings.append(tag);
							} else if (i <= ((result.rows.length / 3) * 3)) {
								cGridDistributionsRings.append(tag);
							}
							ringsOverviewClickHandler("DistroRingsButton" + i, row.name);
						}
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// overview distro rings click handler
function ringsOverviewClickHandler(id, name) {
	$("#" + id).off("click").on("click",
		function () {
			loadRingsDistro(name);
			$("body").pagecontainer("change", "#overviewRingsPage");
		});
}

// load ringtones for specific distribution
function loadRingsDistro(distro) {
	window.localStorage.setItem('overviewRingsTitle', distro);
}

// set ringtones title for specific distribution
function setOverviewRingsTitle() {
	if (window.localStorage.getItem('overviewRingsTitle') !== null) {
		$('#overviewRingsTitle').empty().append(window.localStorage.getItem('overviewRingsTitle'));
	} else {
		$('#overviewRingsTitle').empty().append('Ringtones');
	}
}

// get all ringtones for specific distribution
function getOverviewRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#overviewRingtones'),
		device,
		type,
		htmlTag,
		endHtmlTag,
		typeFolder,
		currentVersion,
		currentVersionMin1,
		currentVersionMin2,
		noringtonesfordistribution = $.t('noringtonesfordistribution'),
		nodistroselected = $.t('nodistroselected'),
		alarms = $.t('alarms'),
		notifications = $.t('notifications'),
		ringtones = $.t('ringtones'),
		newcontent = $.t('newcontent');
	content.empty().append(window.loadingAnimation);
	if (window.localStorage.getItem('overviewRingsTitle') !== null) {
		handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
			currentVersion = dbVersionHandler(prefValue, 0);
			currentVersionMin1 = dbVersionHandler(prefValue, 1);
			currentVersionMin2 = dbVersionHandler(prefValue, 2);
			db.transaction(
				function (transaction) {
					transaction.executeSql(
						'SELECT * FROM dpAppRingtones WHERE distribution=? ORDER BY device ASC, type ASC, name ASC;',
						[window.localStorage.getItem('overviewRingsTitle')],
						function (transaction, result) {
							if (result.rows.length === 0) {
								htmlTag = '<p>' + noringtonesfordistribution + '</p>';
								content.empty().append(htmlTag).trigger("create");
							} else {
								endHtmlTag = '';
								htmlTag = '';
								var i,
									row;
								for (i = 0; i < result.rows.length; i = i + 1) {
									row = result.rows.item(i);
									if (type !== row.type && i > 0) {
										htmlTag = '</ul></div>';
									}
									if (device !== row.device) {
										if (i > 0) {
											if (type === row.type) {
												htmlTag = '</ul></div></div>';
											} else {
												htmlTag = '</div>';
											}
										}
										htmlTag = htmlTag + '<h3>' + row.device;
										if (currentVersion === row.version || currentVersionMin1 === row.version || currentVersionMin2 === row.version) {
											htmlTag = htmlTag + ' (' + newcontent + ')';
										}
										htmlTag = htmlTag + '</h3><div data-role="collapsibleset">';
									}
									if (type !== row.type || device !== row.device) {
										if (row.type === "alarm") {
											htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + alarms + '</h2>';
											typeFolder = "alarms";
										} else if (row.type === "notification") {
											htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + notifications + '</h2>';
											typeFolder = "notifications";
										} else if (row.type === "ringtone") {
											htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + ringtones + '</h2>';
											typeFolder = "ringtones";
										}
										htmlTag = htmlTag + '<ul data-role="listview">';
									}
									htmlTag = htmlTag + '<li data-icon="false"><a onclick="storeRingtone(\'' + window.serviceURL + 'app_content/ringtones/' + row.folder + '/' + typeFolder + '/' + row.filename + '\',\'' + row.name + '\',\'' + row.type + '\');">' + row.name + '</a></li>';
									type = row.type;
									device = row.device;
									endHtmlTag = endHtmlTag + htmlTag;
									htmlTag = '';
								}
								endHtmlTag = endHtmlTag + '</ul></div></div>';
								content.empty().append(endHtmlTag).trigger("create");
							}
						}
					);
				},
				errorHandlerSqlTransaction
			);
		});
	} else {
		htmlTag = '<p>' + nodistroselected + '</p>';
		content.empty().append(htmlTag).trigger("create");
	}
}

// get ringtone specs
function getRingSpecs() {
	var connection = checkConnection(),
		ringtonepanelRingtype = "",
		timesset = $.t('timesset');
	if (window.localStorage.getItem('ringtoneType') === "alarm") {
		ringtonepanelRingtype = $.t('alarm');
	} else if (window.localStorage.getItem('ringtoneType') === "notification") {
		ringtonepanelRingtype = $.t('notification');
	} else if (window.localStorage.getItem('ringtoneType') === "ringtone") {
		ringtonepanelRingtype = $.t('ringtone');
	} else {
		ringtonepanelRingtype = window.localStorage.getItem('ringtoneType');
	}
	if (connection !== "None") {
		$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'getringspec&url=' + window.localStorage.getItem("ringtoneUrl"), function (data) {
			var ringSpecs = data.items;
			$.each(ringSpecs, function (index, ringSpec) {
				$('#ringCounter' + window.localStorage.getItem('divIdGlobal')).empty().append(timesset + ': ' + ringSpec.sets);
				$('#ringType' + window.localStorage.getItem('divIdGlobal')).empty().append(window.localStorage.getItem('ringtoneName') + '<br />(' + ringtonepanelRingtype + ', ' + Math.round(ringSpec.filesize / 1024) + ' kB)');
			});
		}).fail(function () { $('#ringType' + window.localStorage.getItem('divIdGlobal')).empty(); apiErrorHandler($('#ringCounter' + window.localStorage.getItem('divIdGlobal')), "getringspec"); });
	} else {
		$('#ringType' + window.localStorage.getItem('divIdGlobal')).empty().append(window.localStorage.getItem('ringtoneName') + '<br />(' + ringtonepanelRingtype + ')');
	}
}

// clear ringtone specs
function clearRingSpecs() {
	var ringtone = $.t('ringtone');
	$('#ringType' + window.localStorage.getItem('divIdGlobal')).empty().append(ringtone + '<br />&nbsp;');
	$('#ringCounter' + window.localStorage.getItem('divIdGlobal')).empty();
}

// store ringtone information in local storage and toggle panel
function storeRingtone(url, name, type) {
	storeVarsRingtone(url, name, type, "");
	togglePanel('#panelMenuRing' + window.localStorage.getItem("divIdGlobal"));
}

// store ringtone information in local storage
function storeVarsRingtone(url, name, type, folder) {
	window.localStorage.setItem("ringtoneUrl", url);
	window.localStorage.setItem("ringtoneUrlCurrent", "");
	window.localStorage.setItem("ringtoneName", name);
	window.localStorage.setItem("ringtoneFolder", folder);
	window.localStorage.setItem("ringtoneType", type);
}

// add ringtone uri button
function addRingtoneUriButton() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		i,
		row,
		ringtoneUri = $('#ringtoneUri'),
		ringtonenotindatabase = $.t('ringtonenotindatabase');
	ringtoneUri.children().remove('li');
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM dpAppRingtones WHERE filename=? AND folder=? LIMIT 0,1;',
				[window.localStorage.getItem('ringtoneName'), window.localStorage.getItem('ringtoneFolder')],
				function (transaction, result) {
					if (result.rows.length === 0) {
						ringtoneUri.append('<li data-icon="false">' + ringtonenotindatabase + '</li>').listview('refresh');
					} else {
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							ringtoneUri.append('<li data-icon="false"><a onclick="storeRingtone(\'' + window.serviceURL + 'app_content/ringtones/' + row.folder + '/' + row.type + 's/' + row.filename + '\',\'' + row.name + '\',\'' + row.type + '\');">' + row.name + '</a></li>').listview('refresh');
						}
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// download selected ringtone
function downloadRingtone(url, overwrite, ringType, ringName, setRing) {
	var connection = checkConnection(),
		nointernetdetected = $.t('nointernetdetected');
	checkDownload(url, ringType, function (downloadExists) {
		if (connection !== "None" || (downloadExists === true && overwrite === false && setRing === true)) {
			download(url, false, false, "none", "none", setRing, ringType, ringName);
			if (setRing === true) {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Set ringtone as " + ringType, "Ringtone", 1);
				$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'contentsetring&type=' + ringType + '&url=' + url, function (data) {
					// console.info("PhoneGap: getJSON: contentsetring: succes");
				}).fail(function () { apiErrorHandler("none", "contentsetring"); });
			}
		} else {
			toast(nointernetdetected, 'short');
		}
	});
}

// create ringtone player
function ringtonePlayer(id) {
	$("#playButton" + id).off("click").on("click",
		function () {
			playAudio();
		});
	$("#pauseButton" + id).off("click").on("click",
		function () {
			pauseAudio();
		});
	$("#stopButton" + id).off("click").on("click",
		function () {
			stopAudio();
		});
	$("#ringSetDef" + id).off("click").on("click",
		function () {
			downloadRingtone(window.localStorage.getItem('ringtoneUrl'), false, window.localStorage.getItem('ringtoneType'), window.localStorage.getItem('ringtoneName'), true);
		});
	$("#ringDownOnly" + id).off("click").on("click",
		function () {
			downloadRingtone(window.localStorage.getItem('ringtoneUrl'), false, window.localStorage.getItem('ringtoneType'), window.localStorage.getItem('ringtoneName'), false);
		});
	$("#ringShare" + id).off("click").on("click",
		function () {
			var url = window.localStorage.getItem("ringtoneUrlCurrent"),
				substringArray,
				folder,
				type,
				filename,
				ext;
			url = url.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = url.split("/");
			folder = substringArray[0];
			type = substringArray[1];
			type = type.substring(0, type.length - 1);
			filename = substringArray[2];
			substringArray = filename.split(".");
			filename = substringArray[0];
			ext = substringArray[1];
			url = window.serviceURL + 'ringtones.php?device=all&folder=' + folder + '&name=' + filename + '&ext=' + ext + '&type=' + type;
			share('DroidPapers', '#DroidPapers ' + url);
		});
	$("#ringDelCache" + id).off("click").on("click",
		function () {
			deleteCache(window.localStorage.getItem('ringtoneUrl'), window.localStorage.getItem('ringtoneType'));
		});
	$("#ringOpenBrowser" + id).off("click").on("click",
		function () {
			var url = window.localStorage.getItem("ringtoneUrlCurrent"),
				substringArray,
				folder,
				type,
				filename,
				ext;
			url = url.replace(window.serviceURL + 'app_content/ringtones/', '');
			substringArray = url.split("/");
			folder = substringArray[0];
			type = substringArray[1];
			type = type.substring(0, type.length - 1);
			filename = substringArray[2];
			substringArray = filename.split(".");
			filename = substringArray[0];
			ext = substringArray[1];
			url = window.serviceURL + 'ringtones.php?device=all&folder=' + folder + '&name=' + filename + '&ext=' + ext + '&type=' + type;
			window.open(url, '_system');
		});
	$("#ringCurrent" + id).off("click").on("click",
		function () {
			currentRingtone(window.localStorage.getItem("ringtoneType"), "play", emptyCallback);
		});
}

// audio player
var my_media = null;

// play audio
function playAudio() {
	var connection = checkConnection(),
		ringtoneUrl = window.localStorage.getItem("ringtoneUrl"),
		ringtoneUrlCurrent = window.localStorage.getItem("ringtoneUrlCurrent"),
		nointernetdetected = $.t('nointernetdetected');
	if (connection !== "None") {
		if (ringtoneUrl !== ringtoneUrlCurrent) {
			releaseAudio();
			my_media = null;
			my_media = new Media(ringtoneUrl, stopAudioCb);
		}
		window.localStorage.setItem("ringtoneUrlCurrent", ringtoneUrl);
		if (my_media) {
			my_media.play({numberOfLoops: 1}, stateAudioButtons('disable', 'enable', 'enable'));
		} else {
			audioError();
		}
	} else {
		toast(nointernetdetected, 'short');
	}
}

// audio error
function audioError() {
	var nofileornowebserver = $.t('nofileornowebserver');
	stateAudioButtons('enable', 'disable', 'disable');
	toast(nofileornowebserver, 'long');
	console.error("PhoneGap Plugin: MediaPlayer: Message: file does not exists or cannot connect to webserver.");
}

// audio buttons state
function stateAudioButtons(play, pause, stop) {
	// play button
	$('#playButton' + window.localStorage.getItem('divIdGlobal')).button(play);
	$('#playButton' + window.localStorage.getItem('divIdGlobal')).button('refresh');
	// pause button
	$('#pauseButton' + window.localStorage.getItem('divIdGlobal')).button(pause);
	$('#pauseButton' + window.localStorage.getItem('divIdGlobal')).button('refresh');
	// stop button
	$('#stopButton' + window.localStorage.getItem('divIdGlobal')).button(stop);
	$('#stopButton' + window.localStorage.getItem('divIdGlobal')).button('refresh');
}

// pause audio
function pauseAudio() {
	if (my_media) {
		stateAudioButtons('enable', 'disable', 'enable');
		my_media.pause();
	}
}

// stop audio
function stopAudioCb() {
	if (my_media) {
		stateAudioButtons('enable', 'disable', 'disable');
	}
}

// stop audio
function stopAudio() {
	if (my_media) {
		stateAudioButtons('enable', 'disable', 'disable');
		my_media.stop();
	}
}

// release audio
function releaseAudio() {
	if (my_media) {
		stateAudioButtons('enable', 'disable', 'disable');
		my_media.release();
	}
}

// show ringtone search prompt
function searchRingtone() {
	var pleaseenterquery = $.t('pleaseenterquery'),
		searchringtones = $.t('searchringtones'),
		search = $.t('search'),
		cancel = $.t('cancel');
	navigator.notification.prompt(
		pleaseenterquery,
		startSearchRingtone,
		searchringtones,
		[search, cancel],
		'Android'
	);
}

// store search query and start search
function startSearchRingtone(results) {
	if (results.buttonIndex === 1) {
		gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Searched for: " + results.input1, "Ringtone", 1);
		window.localStorage.setItem("ringtoneSearchQuery", results.input1);
		if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id !== 'searchRingtones') {
			$("body").pagecontainer("change", "#searchRingtones");
		} else {
			getOverviewSearchedRings();
		}
	}
}

// get all ringtones for specific distribution
function getOverviewSearchedRings() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#overviewFoundRingtones'),
		device,
		type,
		htmlTag,
		endHtmlTag,
		typeFolder,
		currentVersion,
		currentVersionMin1,
		currentVersionMin2,
		noringfoundswithquery = $.t('noringfoundswithquery'),
		nosearchquery = $.t('nosearchquery'),
		searchedfor = $.t('searchedfor'),
		alarms = $.t('alarms'),
		notifications = $.t('notifications'),
		ringtones = $.t('ringtones'),
		newcontent = $.t('newcontent');
	content.empty().append(window.loadingAnimation);
	if (window.localStorage.getItem('ringtoneSearchQuery') !== null) {
		$('#searchedQueryRingSearch').empty().append(searchedfor + ": " + window.localStorage.getItem('ringtoneSearchQuery'));
		handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
			currentVersion = dbVersionHandler(prefValue, 0);
			currentVersionMin1 = dbVersionHandler(prefValue, 1);
			currentVersionMin2 = dbVersionHandler(prefValue, 2);
			db.transaction(
				function (transaction) {
					transaction.executeSql(
						'SELECT * FROM dpAppRingtones WHERE (name LIKE ?) OR (device LIKE ?) OR (distribution LIKE ?) OR (filename LIKE ?) ORDER BY device ASC, type ASC, name ASC;',
						['%' + window.localStorage.getItem('ringtoneSearchQuery') + '%', '%' + window.localStorage.getItem('ringtoneSearchQuery') + '%', '%' + window.localStorage.getItem('ringtoneSearchQuery') + '%', '%' + window.localStorage.getItem('ringtoneSearchQuery') + '%'],
						function (transaction, result) {
							if (result.rows.length === 0) {
								htmlTag = '<p>' + noringfoundswithquery + '</p>';
								content.empty().append(htmlTag).trigger("create");
							} else {
								endHtmlTag = '';
								htmlTag = '';
								var i,
									row;
								for (i = 0; i < result.rows.length; i = i + 1) {
									row = result.rows.item(i);
									if (type !== row.type && i > 0) {
										htmlTag = '</ul></div>';
									}
									if (device !== row.device) {
										if (i > 0) {
											if (type === row.type) {
												htmlTag = '</ul></div></div>';
											} else {
												htmlTag = '</div>';
											}
										}
										htmlTag = htmlTag + '<h3>' + row.distribution + ' ' + row.device;
										if (currentVersion === row.version || currentVersionMin1 === row.version || currentVersionMin2 === row.version) {
											htmlTag = htmlTag + ' (' + newcontent + ')';
										}
										htmlTag = htmlTag + '</h3><div data-role="collapsibleset">';
									}
									if (type !== row.type || device !== row.device) {
										if (row.type === "alarm") {
											htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + alarms + '</h2>';
											typeFolder = "alarms";
										} else if (row.type === "notification") {
											htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + notifications + '</h2>';
											typeFolder = "notifications";
										} else if (row.type === "ringtone") {
											htmlTag = htmlTag + '<div data-role="collapsible"><h2>' + ringtones + '</h2>';
											typeFolder = "ringtones";
										}
										htmlTag = htmlTag + '<ul data-role="listview">';
									}
									htmlTag = htmlTag + '<li data-icon="false"><a onclick="storeRingtone(\'' + window.serviceURL + 'app_content/ringtones/' + row.folder + '/' + typeFolder + '/' + row.filename + '\',\'' + row.name + '\',\'' + row.type + '\');">' + row.name + '</a></li>';
									type = row.type;
									device = row.device;
									endHtmlTag = endHtmlTag + htmlTag;
									htmlTag = '';
								}
								endHtmlTag = endHtmlTag + '</ul></div></div>';
								content.empty().append(endHtmlTag).trigger("create");
							}
						}
					);
				},
				errorHandlerSqlTransaction
			);
		});
	} else {
		htmlTag = '<p>' + nosearchquery + '</p>';
		content.empty().append(htmlTag).trigger("create");
	}
}