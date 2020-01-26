// JSLint, include this before tests
// var window, $, device, navigator, errorHandlerSqlTransaction, toggleFavorite, imageClickHandler, wallOverviewClickHandler, loadWallsDistro, getOverviewWalls, setOverviewWallsTitle, storeWallpaper, toast, storeWallpaperSwipe, changeWallpaperImage, storeVarsWallpaper, checkConnection, download, wallpaperActionButtons, deleteCache, share, normalWallSwipeRight, homeWallSwipeRight, normalWallSwipeLeft, homeWallSwipeLeft, dbVersionHandler, handleAndroidPreferences, startSearchWallpaper, getOverviewSearchedWalls, toggleImmersive, getAndroidVersion, checkDownload, gaPlugin, gaPluginResultHandler, gaPluginErrorHandler, apiErrorHandler;

// handle _001 in filenames
function formatNumberLength(num, length) {
	num = num.toString();
	num = num.replace(/^0+(?!\.|$)/, '');
	num = parseInt(num, 10);
	var r = num.toString();
	while (r.length < length) {
		r = "0" + r;
	}
	return r;
}

// fill checkboxes wallpaper filter
function fillCheckboxesWallFilter() {
	if (window.localStorage.getItem("wallFilterSD") === 'sd') {
		$("#filterWallSD").prop("checked", true).checkboxradio("refresh");
	} else {
		$("#filterWallSD").prop("checked", false).checkboxradio("refresh");
	}
	if (window.localStorage.getItem("wallFilterHD") === 'hd') {
		$("#filterWallHD").prop("checked", true).checkboxradio("refresh");
	} else {
		$("#filterWallHD").prop("checked", false).checkboxradio("refresh");
	}
	if (window.localStorage.getItem("wallFilterHD2") === 'hd2') {
		$("#filterWallHD2").prop("checked", true).checkboxradio("refresh");
	} else {
		$("#filterWallHD2").prop("checked", false).checkboxradio("refresh");
	}
	if (window.localStorage.getItem("wallFilterHD3") === 'hd3') {
		$("#filterWallHD3").prop("checked", true).checkboxradio("refresh");
	} else {
		$("#filterWallHD3").prop("checked", false).checkboxradio("refresh");
	}
}

// checkbox wallpaper filter click events
function clickCheckBoxesWallFilter() {
	$('#filterWallSD').change(function () {
		if ($(this).prop("checked")) {
			window.localStorage.setItem("wallFilterSD", "sd");
		} else {
			window.localStorage.setItem("wallFilterSD", "false");
		}
		getOverviewWalls();
	});
	$('#filterWallHD').change(function () {
		if ($(this).prop("checked")) {
			window.localStorage.setItem("wallFilterHD", "hd");
		} else {
			window.localStorage.setItem("wallFilterHD", "false");
		}
		getOverviewWalls();
	});
	$('#filterWallHD2').change(function () {
		if ($(this).prop("checked")) {
			window.localStorage.setItem("wallFilterHD2", "hd2");
		} else {
			window.localStorage.setItem("wallFilterHD2", "false");
		}
		getOverviewWalls();
	});
	$('#filterWallHD3').change(function () {
		if ($(this).prop("checked")) {
			window.localStorage.setItem("wallFilterHD3", "hd3");
		} else {
			window.localStorage.setItem("wallFilterHD3", "false");
		}
		getOverviewWalls();
	});
}

// add wallpaper to favorites
function createFavorite(folder, file) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		maxId,
		currentId;
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'INSERT INTO entries (file, folder) VALUES (?, ?);',
				[file, folder],
				toggleFavorite('remove')
			);
		},
		errorHandlerSqlTransaction
	);
	if (window.localStorage.getItem("wallSourceType" + window.appPart) === "favorite") {
		maxId = parseInt(window.localStorage.getItem("wallMaxId" + window.appPart), 10);
		currentId = parseInt(window.localStorage.getItem("wallCurrentId" + window.appPart), 10);
		maxId = maxId + 1;
		if (currentId > maxId || currentId < 1) { currentId = 1; }
		window.localStorage.setItem("wallMaxId" + window.appPart, maxId);
		window.localStorage.setItem("wallCurrentId" + window.appPart, currentId);
	}
	window.localStorage.setItem("settingFavoritesChanged", "true");
}

// delete wallpaper from favorites
function deleteFavorite(folder, file) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		maxId,
		currentId;
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'DELETE FROM entries WHERE file=? AND folder=?;',
				[file, folder],
				toggleFavorite('add')
			);
		},
		errorHandlerSqlTransaction
	);
	if (window.localStorage.getItem("wallSourceType" + window.appPart) === "favorite") {
		maxId = parseInt(window.localStorage.getItem("wallMaxId" + window.appPart), 10);
		currentId = parseInt(window.localStorage.getItem("wallCurrentId" + window.appPart), 10);
		maxId = maxId - 1;
		if (currentId > maxId || currentId < 1) { currentId = 1; }
		window.localStorage.setItem("wallMaxId" + window.appPart, maxId);
		window.localStorage.setItem("wallCurrentId" + window.appPart, currentId);
	}
	window.localStorage.setItem("settingFavoritesChanged", "true");
}

// place correct favorite star for wallpaper
function placeFavoriteStar(folder, file) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		favoriteStar = $("#favoriteStar");
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entries WHERE file=? AND folder=? LIMIT 0,1;',
				[file, folder],
				function (transaction, result) {
					if (result.rows.length > 0) {
						favoriteStar.attr("src", "./images/icons/ic_action_star_10_footer.png");
						favoriteStar.off("click").on("click",
							function () {
								deleteFavorite(window.localStorage.getItem("wallPaperFolder" + window.appPart), window.localStorage.getItem("wallPaperName" + window.appPart));
							});
					} else {
						favoriteStar.attr("src", "./images/icons/ic_action_star_0_footer.png");
						favoriteStar.off("click").on("click",
							function () {
								createFavorite(window.localStorage.getItem("wallPaperFolder" + window.appPart), window.localStorage.getItem("wallPaperName" + window.appPart));
							});
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// toggle favorite star wallpaper
function toggleFavorite(toggle) {
	var favoriteStar = $("#favoriteStar");
	if (toggle === "remove") {
		favoriteStar.attr("src", "./images/icons/ic_action_star_10_footer.png");
		favoriteStar.off("click").on("click",
			function () {
				deleteFavorite(window.localStorage.getItem("wallPaperFolder" + window.appPart), window.localStorage.getItem("wallPaperName" + window.appPart));
			});
	} else if (toggle === "add") {
		favoriteStar.attr("src", "./images/icons/ic_action_star_0_footer.png");
		favoriteStar.off("click").on("click",
			function () {
				createFavorite(window.localStorage.getItem("wallPaperFolder" + window.appPart), window.localStorage.getItem("wallPaperName" + window.appPart));
			});
	}
	return true;
}

// get top set walls from API
function getTopSetWalls() {
	var content = $('#topicContent');
	content.empty();
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'topset30walls1month', function (data) {
		var walls = data.items,
			count = walls.length,
			fileFolder,
			substringArray,
			folder,
			filename,
			wallPaperImage,
			i;
		$.each(walls, function (index, wall) {
			fileFolder = wall.wallpaper.replace(window.serviceURL + 'app_content/wallpapers/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			folder = folder.replace("wp-", "");
			filename = substringArray[1];
			filename = filename.replace(".jpg", "");
			i = index + 1;
			wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + folder + '/t_' + filename + '.jpg';
			content.append('<img id="storeTopSetWallImage' + i + '" class="wallThumbL" alt="' + filename + '" src="' + wallPaperImage + '" />');
			window.localStorage.setItem('topSetWall' + i, wall.wallpaper);
			imageClickHandler('storeTopSetWallImage' + i, folder + '/', filename + '_mini.jpg', i, count, 'topset');
		});
	}).fail(function () { apiErrorHandler(content, "topset30walls1month"); });
}

// get last set walls from API
function getLastSetWalls() {
	var content = $('#topicContent');
	content.empty();
	$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'lastset30walls', function (data) {
		var walls = data.items,
			count = walls.length,
			fileFolder,
			substringArray,
			folder,
			filename,
			wallPaperImage,
			i;
		$.each(walls, function (index, wall) {
			fileFolder = wall.wallpaper.replace(window.serviceURL + 'app_content/wallpapers/', '');
			substringArray = fileFolder.split("/");
			folder = substringArray[0];
			folder = folder.replace("wp-", "");
			filename = substringArray[1];
			filename = filename.replace(".jpg", "");
			i = index + 1;
			wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + folder + '/t_' + filename + '.jpg';
			content.append('<img id="storeLastWallImage' + i + '" class="wallThumbL" alt="' + filename + '" src="' + wallPaperImage + '" />');
			window.localStorage.setItem('lastSetWall' + i, wall.wallpaper);
			imageClickHandler('storeLastWallImage' + i, folder + '/', filename + '_mini.jpg', i, count, 'last');
		});
	}).fail(function () { apiErrorHandler(content, "lastset30walls"); });
}

// get recently added walls from local
function getRecentAddedWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#topicContent'),
		device,
		htmlTag,
		endHtmlTag,
		wallPaperImage,
		currentVersion,
		currentVersionMin1,
		currentVersionMin2,
		norecentwallpapers = $.t('norecentwallpapers');
	content.empty().append(window.loadingAnimation);
	handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
		currentVersion = dbVersionHandler(prefValue, 0);
		currentVersionMin1 = dbVersionHandler(prefValue, 1);
		currentVersionMin2 = dbVersionHandler(prefValue, 2);
		db.transaction(
			function (transaction) {
				transaction.executeSql(
					'SELECT * FROM dpAppWallpapers WHERE version=? OR version=? OR version=? ORDER BY distribution ASC, name ASC;',
					[currentVersion, currentVersionMin1, currentVersionMin2],
					function (transaction, result) {
						if (result.rows.length === 0) {
							htmlTag = '<p>' + norecentwallpapers + '</p>';
							content.empty().append(htmlTag).trigger("create");
						} else {
							endHtmlTag = '<div data-role="collapsibleset">';
							var i,
								row,
								j;
							for (i = 0; i < result.rows.length; i = i + 1) {
								row = result.rows.item(i);
								if (device !== row.name) {
									htmlTag = '<div data-role="collapsible"><h2>' + row.distribution + ' - ' + row.name + '</h2><h4 class="small">' + row.resolution + '</h4>';
									device = row.name;
								}
								for (j = 1; j <= row.amount; j = j + 1) {
									wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + row.folder + '/t_' + row.filename + '_' + formatNumberLength(j, 3) + '.jpg';
									htmlTag = htmlTag + '<img onclick="storeWallpaper(\'' + row.folder + '/\',\'' + row.filename + '_' + formatNumberLength(j, 3) + '_mini.jpg\',\'' + j + '\',\'' + row.amount + '\',\'normal\')" class="wallThumb" alt="' + row.filename + '" src="' + wallPaperImage + '" />';
								}
								htmlTag = htmlTag + '</div>';
								endHtmlTag = endHtmlTag + htmlTag;
							}
							endHtmlTag = endHtmlTag + '</div>';
							content.empty().append(endHtmlTag).trigger("create");
						}
					}
				);
			},
			errorHandlerSqlTransaction
		);
	});
}

// get HD walls from local
function getHdWalls(hd) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#topicContent'),
		device,
		htmlTag,
		endHtmlTag,
		wallPaperImage,
		nodensitywallpapers = $.t('nodensitywallpapers');
	content.empty().append(window.loadingAnimation);
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM dpAppWallpapers WHERE density=? ORDER BY distribution ASC, name ASC;',
				[hd],
				function (transaction, result) {
					if (result.rows.length === 0) {
						htmlTag = '<p>' + nodensitywallpapers + '</p>';
						content.empty().append(htmlTag).trigger("create");
					} else {
						endHtmlTag = '<div data-role="collapsibleset">';
						var i,
							row,
							j;
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							if (device !== row.name) {
								htmlTag = '<div data-role="collapsible"><h2>' + row.distribution + ' - ' + row.name + '</h2><h4 class="small">' + row.resolution + '</h4>';
								device = row.name;
							}
							for (j = 1; j <= row.amount; j = j + 1) {
								wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + row.folder + '/t_' + row.filename + '_' + formatNumberLength(j, 3) + '.jpg';
								htmlTag = htmlTag + '<img onclick="storeWallpaper(\'' + row.folder + '/\',\'' + row.filename + '_' + formatNumberLength(j, 3) + '_mini.jpg\',\'' + j + '\',\'' + row.amount + '\',\'normal\')" class="wallThumb" alt="' + row.filename + '" src="' + wallPaperImage + '" />';
							}
							htmlTag = htmlTag + '</div>';
							endHtmlTag = endHtmlTag + htmlTag;
						}
						endHtmlTag = endHtmlTag + '</div>';
						content.empty().append(endHtmlTag).trigger("create");
					}
				},
				errorHandlerSqlTransaction
			);
		}
	);
}

// get all distributions wallpapers
function getOverviewDistributionsWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		nodistributionsdatabase = $.t('nodistributionsdatabase');
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM dpAppDistributions WHERE wallpapers="yes" ORDER BY name ASC, os ASC;',
				null,
				function (transaction, result) {
					var aGridDistributionsWalls = $('#aGridDistributionsWalls'),
						bGridDistributionsWalls = $('#bGridDistributionsWalls'),
						cGridDistributionsWalls = $('#cGridDistributionsWalls'),
						i,
						row,
						tag,
						logo;
					aGridDistributionsWalls.empty();
					bGridDistributionsWalls.empty();
					cGridDistributionsWalls.empty();
					if (result.rows.length === 0) {
						aGridDistributionsWalls.append('<div class="card"><p>' +  nodistributionsdatabase + '</p></div>');
					} else {
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							logo = row.logo.replace(".png", ".jpg");
							tag = '<div class="card" id="DistroWallsButton' + i + '">' +
									'<div class="card-image"><img alt="' + row.name + '" src="' + window.serviceURL + 'app_content/logos/' + logo + '" />' +
									'<h2>' + row.name + '</h2></div>' +
									'</div>';
							if (i < (result.rows.length / 3)) {
								aGridDistributionsWalls.append(tag);
							} else if (i < ((result.rows.length / 3) * 2)) {
								bGridDistributionsWalls.append(tag);
							} else if (i <= ((result.rows.length / 3) * 3)) {
								cGridDistributionsWalls.append(tag);
							}
							wallOverviewClickHandler('DistroWallsButton' + i, row.name);
						}
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// overview distro walls click handler
function wallOverviewClickHandler(id, name) {
	$("#" + id).off("click").on("click",
		function () {
			loadWallsDistro(name);
			$("body").pagecontainer("change", "#overviewWallsPage");
		});
}

// load wallpapers for specific distribution
function loadWallsDistro(distro) {
	window.localStorage.setItem('overviewWallsTitle', distro);
}

// set wallpaper title for specific distribution
function setOverviewWallsTitle() {
	if (window.localStorage.getItem('overviewWallsTitle') !== null) {
		$('#overviewWallsTitle').empty().append(window.localStorage.getItem('overviewWallsTitle'));
	} else {
		$('#overviewWallsTitle').empty().append('Wallpapers');
	}
}

// get all wallpapers for specific distribution
function getOverviewWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#overviewWallpapers'),
		device,
		htmlTag,
		endHtmlTag,
		wallPaperImage,
		currentVersion,
		currentVersionMin1,
		currentVersionMin2,
		nowallpapermatchfilter = $.t('nowallpapermatchfilter'),
		nodistroselected = $.t('nodistroselected'),
		newcontent = $.t('newcontent');
	content.empty().append(window.loadingAnimation);
	if (window.localStorage.getItem('overviewWallsTitle') !== null) {
		handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
			currentVersion = dbVersionHandler(prefValue, 0);
			currentVersionMin1 = dbVersionHandler(prefValue, 1);
			currentVersionMin2 = dbVersionHandler(prefValue, 2);
			db.transaction(
				function (transaction) {
					transaction.executeSql(
						'SELECT * FROM dpAppWallpapers WHERE distribution=? AND density=? OR distribution=? AND density=? OR distribution=? AND density=? OR distribution=? AND density=? ORDER BY name ASC;',
						[window.localStorage.getItem('overviewWallsTitle'), window.localStorage.getItem("wallFilterSD"), window.localStorage.getItem('overviewWallsTitle'), window.localStorage.getItem("wallFilterHD"), window.localStorage.getItem('overviewWallsTitle'), window.localStorage.getItem("wallFilterHD2"), window.localStorage.getItem('overviewWallsTitle'), window.localStorage.getItem("wallFilterHD3")],
						function (transaction, result) {
							if (result.rows.length === 0) {
								htmlTag = '<p>' + nowallpapermatchfilter + '</p>';
								content.empty().append(htmlTag).trigger("create");
							} else {
								endHtmlTag = '<div data-role="collapsibleset">';
								var i,
									row,
									j;
								for (i = 0; i < result.rows.length; i = i + 1) {
									row = result.rows.item(i);
									if (device !== row.name) {
										htmlTag = '<div data-role="collapsible"><h2>' + row.name;
										if (currentVersion === row.version || currentVersionMin1 === row.version || currentVersionMin2 === row.version) {
											htmlTag = htmlTag + ' (' + newcontent + ')';
										}
										htmlTag = htmlTag + '</h2><h4 class="small">' + row.resolution + '</h4>';
										device = row.name;
									}
									for (j = 1; j <= row.amount; j = j + 1) {
										wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + row.folder + '/t_' + row.filename + '_' + formatNumberLength(j, 3) + '.jpg';
										htmlTag = htmlTag + '<img onclick="storeWallpaper(\'' + row.folder + '/\',\'' + row.filename + '_' + formatNumberLength(j, 3) + '_mini.jpg\',\'' + j + '\',\'' + row.amount + '\',\'normal\')" class="wallThumb" alt="' + row.filename + '" src="' + wallPaperImage + '" />';
									}
									htmlTag = htmlTag + '</div>';
									endHtmlTag = endHtmlTag + htmlTag;
								}
								endHtmlTag = endHtmlTag + '</div>';
								content.empty().append(endHtmlTag).trigger("create");
							}
						}
					);
				},
				errorHandlerSqlTransaction
			);
		});
	} else {
		htmlTag = nodistroselected;
		content.empty().append(htmlTag).trigger("create");
	}
}

// load image page
function loadImagePage() {
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'pluginPage') {
		$("body").pagecontainer("change", '#wallpaperFullscreenImagePluginPage');
	} else {
		$("body").pagecontainer("change", '#wallpaperFullscreenImagePage');
	}
}

// get all favorite wallpapers
function getFavorites(page) {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#wpFavorite' + page),
		nofavoritewallpapers = $.t('nofavoritewallpapers');
	content.empty();
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entries ORDER BY folder ASC;',
				null,
				function (transaction, result) {
					var i,
						j,
						row,
						wallPaperImage;
					if (result.rows.length === 0) {
						content.append('<p>' + nofavoritewallpapers + '</p>');
					} else {
						for (i = 0; i < result.rows.length; i = i + 1) {
							row = result.rows.item(i);
							j = i + 1;
							wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + row.folder + 't_' + row.file;
							content.append('<img id="storeWallImageFav' + i + '" class="wallThumbL" alt="' + row.file + '" src="' + wallPaperImage + '" />');
							imageClickHandler('storeWallImageFav' + i, row.folder, row.file, j, result.rows.length, 'favorite');
						}
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// create image click handler
function imageClickHandler(id, folder, filename, index, length, type) {
	$("#" + id).off("click").on("click",
		function () {
			storeWallpaper(folder, filename, index, length, type);
		});
}

// next wallpaper after swipe favorite
function favoriteSwipeLeft() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		currentId = window.localStorage.getItem("wallCurrentId" + window.appPart),
		maxId = window.localStorage.getItem("wallMaxId" + window.appPart),
		nextId,
		dbId,
		nofavoritewallpapers = $.t('nofavoritewallpapers');
	currentId = parseInt(currentId, 10);
	maxId = parseInt(maxId, 10);
	nextId = currentId + 1;
	if (nextId > maxId) { nextId = 1; }
	dbId = nextId - 1;
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entries ORDER BY folder ASC LIMIT ' + dbId + ',1;',
				null,
				function (transaction, result) {
					if (result.rows.length === 0) {
						toast(nofavoritewallpapers, 'short');
					} else {
						var row = result.rows.item(0),
							fileName = row.file.replace(".jpg", "_mini.jpg");
						storeWallpaperSwipe(row.folder, fileName, nextId, maxId, 'favorite');
						changeWallpaperImage();
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// previous wallpaper after swipe favorite
function favoriteSwipeRight() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		currentId = window.localStorage.getItem("wallCurrentId" + window.appPart),
		maxId = window.localStorage.getItem("wallMaxId" + window.appPart),
		previousId,
		dbId,
		nofavoritewallpapers = $.t('nofavoritewallpapers');
	currentId = parseInt(currentId, 10);
	maxId = parseInt(maxId, 10);
	previousId = currentId - 1;
	if (previousId === 0) { previousId = maxId; }
	dbId = previousId - 1;
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM entries ORDER BY folder ASC LIMIT ' + dbId + ',1;',
				null,
				function (transaction, result) {
					if (result.rows.length === 0) {
						toast(nofavoritewallpapers, 'short');
					} else {
						var row = result.rows.item(0),
							fileName = row.file.replace(".jpg", "_mini.jpg");
						storeWallpaperSwipe(row.folder, fileName, previousId, maxId, 'favorite');
						changeWallpaperImage();
					}
				},
				errorHandlerSqlTransaction
			);
		}
	);
}

// store wallpaper information in local storage after swipe
function storeWallpaperSwipe(folder, nameMini, currentId, maxId, type) {
	storeVarsWallpaper(folder, nameMini, currentId, maxId, type);
}

// store wallpaper information in local storage
function storeWallpaper(folder, nameMini, currentId, maxId, type) {
	storeVarsWallpaper(folder, nameMini, currentId, maxId, type);
	loadImagePage();
}

// store wallpaper vars
function storeVarsWallpaper(folder, nameMini, currentId, maxId, type) {
	var name = nameMini.replace("_mini", ""),
		shareFolder = folder.replace("/", ""),
		shareName = name.replace(".jpg", "");
	window.localStorage.setItem("wallSourceType" + window.appPart, type); // page source with wallpapers
	window.localStorage.setItem("wallCurrentId" + window.appPart, currentId); // current wallpaper id
	window.localStorage.setItem("wallMaxId" + window.appPart, maxId); // maximum wallpaper id
	window.localStorage.setItem("wallPaperShareFolder" + window.appPart, "wp-" + shareFolder); // folder for share feature
	window.localStorage.setItem("wallPaperShareName" + window.appPart, shareName); // file name for share feature
	window.localStorage.setItem("wallPaperFolder" + window.appPart, folder); // wallpaper folder
	window.localStorage.setItem("wallPaperName" + window.appPart, name); // wallpaper file name
	window.localStorage.setItem("wallPaperURL" + window.appPart, window.serviceURL + "app_content/wallpapers/" + "wp-" + folder + name); // full size and full url
}

// download selected wallpaper
function downloadWallpaper(url, overwrite, setWallpaper, setWallAspect, setWallColor) {
	var connection = checkConnection(),
		settingwallpaper = $.t('settingwallpaper'),
		nointernetdetected = $.t('nointernetdetected');
	checkDownload(url, "none", function (downloadExists) {
		if (connection !== "None" || (downloadExists === true && overwrite === false && setWallpaper === true)) {
			download(url, overwrite, setWallpaper, setWallAspect, setWallColor, false, "none", "none");
			if (setWallpaper === true) {
				gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Set wallpaper", "Wallpaper", 1);
				toast(settingwallpaper, 'short');
				$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'contentsetwall&url=' + url, function (data) {
					// console.info("PhoneGap: getJSON: contentsetwall: succes");
				}).fail(function () { apiErrorHandler("none", "contentsetwall"); });
			}
		} else {
			toast(nointernetdetected, 'short');
		}
	});
}

// get wallpaper specs
function getWallSpecs() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		fileFolder = window.localStorage.getItem("wallPaperURL" + window.appPart),
		substringArray,
		filename,
		distribution = $.t('distribution'),
		device = $.t('device'),
		resolution = $.t('resolution'),
		timesset = $.t('timesset');
	fileFolder = fileFolder.replace(window.serviceURL + 'app_content/wallpapers/', '');
	substringArray = fileFolder.split("/");
	filename = substringArray[1];
	filename = filename.replace(".jpg", "");
	substringArray = filename.split("_");
	filename = substringArray[0];
	if ($('#wallSpecs').is(':empty')) {
		$('#wallSpecs').empty().append(distribution + ': ' + device + ' (' + resolution + ')');
	}
	if ($('#wallCounter').is(':empty')) {
		$('#wallCounter').empty().append(timesset + ': ...');
	}
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT * FROM dpAppWallpapers WHERE filename=? LIMIT 0,1;',
				[filename],
				function (transaction, result) {
					if (result.rows.length > 0) {
						var row = result.rows.item(0),
							connection = checkConnection();
						if (connection !== "None") {
							$.getJSON(window.serviceURL + window.apiFile + window.apiKey + 'getwallspec&url=' + window.localStorage.getItem("wallPaperURL" + window.appPart), function (data) {
								var wallSpecs = data.items;
								$.each(wallSpecs, function (index, wallSpec) {
									$('#wallSpecs').empty().append(row.distribution + ' ' + row.name + ' (' + wallSpec.resolution + ', ' + Math.round(wallSpec.filesize / 1024) + ' kB' + ')');
									$('#wallCounter').empty().append(timesset + ': ' + wallSpec.sets);
								});
							}).fail(function () { $('#wallSpecs').empty(); apiErrorHandler($('#wallCounter'), "getwallspec"); });
						} else {
							$('#wallSpecs').empty().append(row.distribution + ' ' + row.name + ' (' + row.resolution + ')');
							$('#wallCounter').empty().append(timesset + ': ...');
						}
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// get wallpaper note
function getWallNote() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		wallpaper = window.localStorage.getItem("wallPaperName" + window.appPart);
	wallpaper = wallpaper.replace(/^t_?/, "");
	db.transaction(
		function (transaction) {
			transaction.executeSql(
				'SELECT note FROM dpAppWallpapersNotes WHERE wallpaper LIKE ? LIMIT 0,1;',
				[wallpaper],
				function (transaction, result) {
					if (result.rows.length > 0) {
						var row = result.rows.item(0);
						$('#wallNote').empty().append(row.note);
					} else {
						$('#wallNote').empty();
					}
				}
			);
		},
		errorHandlerSqlTransaction
	);
}

// create wallpaper fullscreen image view
function wallpaperImageFullScr(page) {
	var content = $('#wallpaper' + page + 'FullScr'),
		imageSrc = window.localStorage.getItem("wallPaperName" + window.appPart),
		folderSrc = window.localStorage.getItem("wallPaperFolder" + window.appPart),
		wallPaperImage,
		pic_real_width,
		pic_real_height,
		imageRatio,
		screenRatio,
		connection = checkConnection(),
		nointernetdetected = $.t('nointernetdetected');
	if (connection !== "none") {
		if (connection === "Ethernet" || connection === "WiFi") {
			wallPaperImage = window.serviceURL + 'app_content/wallpapers/wp-' + folderSrc + imageSrc; // full size wallpaper
		} else if (connection === "2G") {
			wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + folderSrc + 't_' + imageSrc; // 300px thumb
		} else {
			imageSrc = imageSrc.replace(".jpg", "_mini.jpg"); // 600px thumb
			wallPaperImage = window.serviceURL + 'app_content/wallpapers_thumbs/thumbs-' + folderSrc + 't_' + imageSrc; // 600px thumb
		}
		content.replaceWith('<img id="wallpaper' + page + 'FullScr" alt="fullscreenWallpaper" src="' + wallPaperImage + '" class="wallpaperFullScreenImage" />').trigger("create");
		$("<img />")
			.attr("src", wallPaperImage)
			.load(function () {
				pic_real_width = this.width;
				pic_real_height = this.height;
				imageRatio = pic_real_width / pic_real_height;
				screenRatio = window.innerWidth / window.innerHeight;
				if (pic_real_width > pic_real_height) {
					if (imageRatio < screenRatio) {
						$('#wallpaper' + page + 'FullScr').removeClass("fillwidth");
						$('#wallpaper' + page + 'FullScr').addClass("fillheight");
					} else {
						$('#wallpaper' + page + 'FullScr').removeClass("fillheight");
						$('#wallpaper' + page + 'FullScr').addClass("fillwidth");
					}
				} else if (pic_real_width < pic_real_height) {
					if (imageRatio < screenRatio) {
						$('#wallpaper' + page + 'FullScr').removeClass("fillwidth");
						$('#wallpaper' + page + 'FullScr').addClass("fillheight");
					} else {
						$('#wallpaper' + page + 'FullScr').removeClass("fillheight");
						$('#wallpaper' + page + 'FullScr').addClass("fillwidth");
					}
				} else if (pic_real_width === pic_real_height) {
					if (imageRatio > screenRatio) {
						$('#wallpaper' + page + 'FullScr').removeClass("fillheight");
						$('#wallpaper' + page + 'FullScr').addClass("fillwidth");
					} else {
						$('#wallpaper' + page + 'FullScr').removeClass("fillwidth");
						$('#wallpaper' + page + 'FullScr').addClass("fillheight");
					}
				}
			});
		$('#wallDiv').off("click").on("click",
			function () {
				toggleImmersive();
			});
		$('#wallInfoDiv').off("click").on("click",
			function () {
				toggleImmersive();
			});
	} else {
		toast(nointernetdetected, 'short');
		window.history.back();
	}
}

// toggle immersive interface
function toggleImmersive() {
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'wallpaperFullscreenImagePage') {
		if ($("#footerWpFullScrImage").is(':hidden')) {
			$('#footerWpFullScrImage').show();
		} else {
			$('#footerWpFullScrImage').hide();
		}
		if ($("#headerWpFullScrImage").is(':hidden')) {
			$('#headerWpFullScrImage').show();
		} else {
			$('#headerWpFullScrImage').hide();
		}
		if ($("#wallInfoDiv").is(':hidden')) {
			$('#wallInfoDiv').show();
		} else {
			$('#wallInfoDiv').hide();
		}
	} else if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'wallpaperFullscreenImagePluginPage') {
		if ($("#footerWpFullScrImagePlugin").is(':hidden')) {
			$('#footerWpFullScrImagePlugin').show();
		} else {
			$('#footerWpFullScrImagePlugin').hide();
		}
		if ($("#headerWpFullScrImagePlugin").is(':hidden')) {
			$('#headerWpFullScrImagePlugin').show();
		} else {
			$('#headerWpFullScrImagePlugin').hide();
		}
		if ($("#wallInfoDiv").is(':hidden')) {
			$('#wallInfoDiv').show();
		} else {
			$('#wallInfoDiv').hide();
		}
	}
}

// load image page after swipe
function changeWallpaperImage() {
	if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'wallpaperFullscreenImagePluginPage') {
		getWallSpecs();
		getWallNote();
		wallpaperImageFullScr('ImagePlugin');
	} else if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id === 'wallpaperFullscreenImagePage') {
		getWallSpecs();
		getWallNote();
		placeFavoriteStar(window.localStorage.getItem("wallPaperFolder" + window.appPart), window.localStorage.getItem("wallPaperName" + window.appPart));
		wallpaperImageFullScr('Image');
	}
}

// toggle visibility previous and next buttons
function togglePrevNextWallButtons() {
	if (parseInt(window.localStorage.getItem("wallMaxId" + window.appPart), 10) > 1) {
		$("#prevWall" + window.localStorage.getItem("divIdGlobal")).show();
		$("#nextWall" + window.localStorage.getItem("divIdGlobal")).show();
	} else {
		$("#prevWall" + window.localStorage.getItem("divIdGlobal")).hide();
		$("#nextWall" + window.localStorage.getItem("divIdGlobal")).hide();
	}
}

// wallpaper action buttons
function wallpaperActionButtons() {
	var button = $('#actionListWpFullScrImage'),
		url = window.serviceURL + "share.php?folder=" + window.localStorage.getItem("wallPaperShareFolder" + window.appPart) + "&name=" + window.localStorage.getItem("wallPaperShareName" + window.appPart),
		fillscreenwithwallpaper = $.t('fillscreenwithwallpaper'),
		fitwallpaperonscreen = $.t('fitwallpaperonscreen'),
		other = $.t('other'),
		original = $.t('original'),
		grayscale = $.t('grayscale'),
		sepia = $.t('sepia'),
		share = $.t('share'),
		openinbrowser = $.t('openinbrowser'),
		downloadonly = $.t('downloadonly'),
		deletedownload = $.t('deletedownload');
	button.children().remove('li');
	button.append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	button.append('<li data-role="list-divider"><p class="panelTextDivider">' + fillscreenwithwallpaper + '</p></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonHeight" class="panelText"><img alt="setheight" src="./images/icons/ic_action_picture.png" class="ui-li-icon largerIcon" />' + original + '</a></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonGrayscaleHeight" class="panelText"><img alt="setwidthgrayscale" src="./images/icons/ic_action_picture.png" class="ui-li-icon largerIcon" />' + grayscale + '</a></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonSepiaHeight" class="panelText"><img alt="setwidthgrayscale" src="./images/icons/ic_action_picture.png" class="ui-li-icon largerIcon" />' + sepia + '</a></li>');
	button.append('<li data-role="list-divider"><p class="panelTextDivider">' + fitwallpaperonscreen + '</p></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonWidth" class="panelText"><img alt="setwidth" src="./images/icons/ic_action_crop.png" class="ui-li-icon largerIcon" />' + original + '</a></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonGrayscaleWidth" class="panelText"><img alt="setwidthgrayscale" src="./images/icons/ic_action_crop.png" class="ui-li-icon largerIcon" />' + grayscale + '</a></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonSepiaWidth" class="panelText"><img alt="setwidthgrayscale" src="./images/icons/ic_action_crop.png" class="ui-li-icon largerIcon" />' + sepia + '</a></li>');
	button.append('<li data-role="list-divider"><p class="panelTextDivider">' + other + '</p></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonShare" class="panelText"><img alt="share" src="./images/icons/ic_action_share.png" class="ui-li-icon largerIcon" />' + share + '</a></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonBrowser" class="panelText"><img alt="browser" src="./images/icons/ic_action_globe.png" class="ui-li-icon largerIcon" />' + openinbrowser + '</a></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonDown" class="panelText"><img alt="download" src="./images/icons/ic_action_download.png" class="ui-li-icon largerIcon" />' + downloadonly + '</a></li>');
	button.append('<li data-icon="false"><a id="imageWallButtonDelete" class="panelText"><img alt="delete" src="./images/icons/ic_action_trash.png" class="ui-li-icon largerIcon" />' + deletedownload + '</a></li>');
	button.listview('refresh');
	$("#imageWallButtonHeight").off("click").on("click",
		function () {
			downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, true, "autofill", "original");
		});
	$("#imageWallButtonWidth").off("click").on("click",
		function () {
			downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, true, "autofit", "original");
		});
	$("#imageWallButtonGrayscaleHeight").off("click").on("click",
		function () {
			downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, true, "autofill", "grayscale");
		});
	$("#imageWallButtonGrayscaleWidth").off("click").on("click",
		function () {
			downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, true, "autofit", "grayscale");
		});
	$("#imageWallButtonSepiaHeight").off("click").on("click",
		function () {
			downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, true, "autofill", "sepia");
		});
	$("#imageWallButtonSepiaWidth").off("click").on("click",
		function () {
			downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, true, "autofit", "sepia");
		});
	$("#imageWallButtonDown").off("click").on("click",
		function () {
			downloadWallpaper(window.localStorage.getItem("wallPaperURL" + window.appPart), false, false, "", "");
		});
	$("#imageWallButtonDelete").off("click").on("click",
		function () {
			deleteCache(window.localStorage.getItem("wallPaperName" + window.appPart), 'none');
		});
	$("#imageWallButtonBrowser").off("click").on("click",
		function () {
			window.open(url, '_system');
		});
	$("#imageWallButtonShare").off("click").on("click",
		function () {
			share('DroidPapers', '#DroidPapers ' + window.serviceURL + 'share.php?folder=' + window.localStorage.getItem("wallPaperShareFolder" + window.appPart) + '&name=' + window.localStorage.getItem("wallPaperShareName" + window.appPart));
		});
}

// check where previous wallpaper request comes from
function navigateWallRight() {
	if (window.localStorage.getItem("wallSourceType" + window.appPart) === "normal") {
		normalWallSwipeRight();
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "favorite") {
		favoriteSwipeRight();
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "random") {
		homeWallSwipeRight('random');
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "last") {
		homeWallSwipeRight('last');
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "top") {
		homeWallSwipeRight('top');
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "topset") {
		homeWallSwipeRight('topset');
	}
}

// check where next/previous request comes from
function navigateWallLeft() {
	if (window.localStorage.getItem("wallSourceType" + window.appPart) === "normal") {
		normalWallSwipeLeft();
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "favorite") {
		favoriteSwipeLeft();
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "random") {
		homeWallSwipeLeft('random');
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "last") {
		homeWallSwipeLeft('last');
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "top") {
		homeWallSwipeLeft('top');
	} else if (window.localStorage.getItem("wallSourceType" + window.appPart) === "topset") {
		homeWallSwipeLeft('topset');
	}
}

// next wallpaper normal
function normalWallSwipeLeft() {
	var currentId = window.localStorage.getItem("wallCurrentId" + window.appPart),
		maxId = window.localStorage.getItem("wallMaxId" + window.appPart),
		folder = window.localStorage.getItem("wallPaperFolder" + window.appPart),
		nameThumb = window.localStorage.getItem("wallPaperName" + window.appPart),
		nameNext,
		nextId;
	nameThumb = nameThumb.replace(".jpg", "_mini.jpg");
	currentId = currentId.replace(/^0+(?!\.|$)/, '');
	maxId = maxId.replace(/^0+(?!\.|$)/, '');
	currentId = parseInt(currentId, 10);
	maxId = parseInt(maxId, 10);
	nextId = currentId + 1;
	if (nextId > maxId) { nextId = 1; }
	if (nextId <= maxId) {
		currentId = formatNumberLength(currentId, 3);
		nextId = formatNumberLength(nextId, 3);
		nameNext = nameThumb.replace(currentId + '_mini.jpg', nextId + '_mini.jpg');
		nextId = nextId.toString();
		maxId = maxId.toString();
		storeWallpaperSwipe(folder, nameNext, nextId, maxId, 'normal');
		changeWallpaperImage();
	}
}

// previous wallpaper normal
function normalWallSwipeRight() {
	var currentId = window.localStorage.getItem("wallCurrentId" + window.appPart),
		maxId = window.localStorage.getItem("wallMaxId" + window.appPart),
		folder = window.localStorage.getItem("wallPaperFolder" + window.appPart),
		nameThumb = window.localStorage.getItem("wallPaperName" + window.appPart),
		previousId,
		namePrevious;
	nameThumb = nameThumb.replace(".jpg", "_mini.jpg");
	currentId = currentId.replace(/^0+(?!\.|$)/, '');
	maxId = maxId.replace(/^0+(?!\.|$)/, '');
	currentId = parseInt(currentId, 10);
	maxId = parseInt(maxId, 10);
	previousId = currentId - 1;
	if (previousId === 0) { previousId = maxId; }
	if (previousId > 0) {
		currentId = formatNumberLength(currentId, 3);
		previousId = formatNumberLength(previousId, 3);
		namePrevious = nameThumb.replace(currentId + '_mini.jpg', previousId + '_mini.jpg');
		previousId = previousId.toString();
		maxId = maxId.toString();
		storeWallpaperSwipe(folder, namePrevious, previousId, maxId, 'normal');
		changeWallpaperImage();
	}
}

// next wallpaper home
function homeWallSwipeLeft(type) {
	var currentId = window.localStorage.getItem("wallCurrentId" + window.appPart),
		maxId = window.localStorage.getItem("wallMaxId" + window.appPart),
		nextId,
		url,
		fileFolder,
		substringArray,
		folder,
		filename;
	currentId = parseInt(currentId, 10);
	maxId = parseInt(maxId, 10);
	nextId = currentId + 1;
	if (nextId > maxId) { nextId = 1; }
	if (nextId <= maxId) {
		if (type === 'random') {
			url = window.localStorage.getItem("randomWall" + nextId);
		} else if (type === 'last') {
			url = window.localStorage.getItem("lastSetWall" + nextId);
		} else if (type === 'topset') {
			url = window.localStorage.getItem("topSetWall" + nextId);
		}
		fileFolder = url.replace(window.serviceURL + 'app_content/wallpapers/', '');
		substringArray = fileFolder.split("/");
		folder = substringArray[0];
		folder = folder.replace("wp-", "");
		filename = substringArray[1];
		filename = filename.replace(".jpg", "");
		nextId = nextId.toString();
		maxId = maxId.toString();
		storeWallpaperSwipe(folder + '/', filename + '_mini.jpg', nextId, maxId, type);
		changeWallpaperImage();
	}
}

// previous wallpaper home
function homeWallSwipeRight(type) {
	var currentId = window.localStorage.getItem("wallCurrentId" + window.appPart),
		maxId = window.localStorage.getItem("wallMaxId" + window.appPart),
		previousId,
		url,
		fileFolder,
		substringArray,
		folder,
		filename;
	currentId = parseInt(currentId, 10);
	maxId = parseInt(maxId, 10);
	previousId = currentId - 1;
	if (previousId === 0) { previousId = maxId; }
	if (previousId > 0) {
		if (type === 'random') {
			url = window.localStorage.getItem("randomWall" + previousId);
		} else if (type === 'last') {
			url = window.localStorage.getItem("lastSetWall" + previousId);
		} else if (type === 'topset') {
			url = window.localStorage.getItem("topSetWall" + previousId);
		}
		fileFolder = url.replace(window.serviceURL + 'app_content/wallpapers/', '');
		substringArray = fileFolder.split("/");
		folder = substringArray[0];
		folder = folder.replace("wp-", "");
		filename = substringArray[1];
		filename = filename.replace(".jpg", "");
		previousId = previousId.toString();
		maxId = maxId.toString();
		storeWallpaperSwipe(folder + '/', filename + '_mini.jpg', previousId, maxId, type);
		changeWallpaperImage();
	}
}

// show wallpaper search prompt
function searchWallpaper() {
	var pleaseenterquery = $.t('pleaseenterquery'),
		searchwallpapers = $.t('searchwallpapers'),
		search = $.t('search'),
		cancel = $.t('cancel');
	navigator.notification.prompt(
		pleaseenterquery,
		startSearchWallpaper,
		searchwallpapers,
		[search, cancel],
		'Android'
	);
}

// store search query and start search
function startSearchWallpaper(results) {
	if (results.buttonIndex === 1) {
		gaPlugin.trackEvent(gaPluginResultHandler, gaPluginErrorHandler, "Button", "Searched for: " + results.input1, "Wallpaper", 1);
		window.localStorage.setItem("wallpaperSearchQuery", results.input1);
		if ($.mobile.pageContainer.pagecontainer("getActivePage")[0].id !== 'searchWallpapers') {
			$("body").pagecontainer("change", "#searchWallpapers");
		} else {
			getOverviewSearchedWalls();
		}
	}
}

// get all ringtones for specific distribution
function getOverviewSearchedWalls() {
	var db = window.openDatabase(window.dbName, window.dbVersion, window.dbName, window.dbSize),
		content = $('#overviewFoundWallpapers'),
		device,
		htmlTag,
		endHtmlTag,
		wallPaperImage,
		currentVersion,
		currentVersionMin1,
		currentVersionMin2,
		nowallfoundswithquery = $.t('nowallfoundswithquery'),
		newcontent = $.t('newcontent'),
		nosearchquery = $.t('nosearchquery'),
		searchedfor = $.t('searchedfor');
	content.empty();
	if (window.localStorage.getItem('wallpaperSearchQuery') !== null) {
		$('#searchedQueryWallSearch').empty().append(searchedfor + ": " + window.localStorage.getItem('wallpaperSearchQuery'));
		handleAndroidPreferences("get", window.androidPrefsLib, "localContentVersion", "", function (prefValue) {
			currentVersion = dbVersionHandler(prefValue, 0);
			currentVersionMin1 = dbVersionHandler(prefValue, 1);
			currentVersionMin2 = dbVersionHandler(prefValue, 2);
			db.transaction(
				function (transaction) {
					transaction.executeSql(
						'SELECT * FROM dpAppWallpapers WHERE (name LIKE ?) OR (resolution LIKE ?) OR (distribution LIKE ?) OR (density LIKE ?) ORDER BY distribution ASC, name ASC;',
						['%' + window.localStorage.getItem('wallpaperSearchQuery') + '%', '%' + window.localStorage.getItem('wallpaperSearchQuery') + '%', '%' + window.localStorage.getItem('wallpaperSearchQuery') + '%', '%' + window.localStorage.getItem('wallpaperSearchQuery') + '%'],
						function (transaction, result) {
							if (result.rows.length === 0) {
								htmlTag = '<p>' + nowallfoundswithquery + '</p>';
								content.empty().append(htmlTag).trigger("create");
							} else {
								endHtmlTag = '<div data-role="collapsibleset">';
								var i,
									row,
									j;
								for (i = 0; i < result.rows.length; i = i + 1) {
									row = result.rows.item(i);
									if (device !== row.name) {
										htmlTag = '<div data-role="collapsible"><h2>' + row.distribution + ' ' + row.name;
										if (currentVersion === row.version || currentVersionMin1 === row.version || currentVersionMin2 === row.version) {
											htmlTag = htmlTag + ' (' + newcontent + ')';
										}
										htmlTag = htmlTag + '</h2><h4 class="small">' + row.resolution + '</h4>';
										device = row.name;
									}
									for (j = 1; j <= row.amount; j = j + 1) {
										wallPaperImage = window.serviceURL + 'app_content/wallpapers_small_thumbs/thumbs-' + row.folder + '/t_' + row.filename + '_' + formatNumberLength(j, 3) + '.jpg';
										htmlTag = htmlTag + '<img onclick="storeWallpaper(\'' + row.folder + '/\',\'' + row.filename + '_' + formatNumberLength(j, 3) + '_mini.jpg\',\'' + j + '\',\'' + row.amount + '\',\'normal\')" class="wallThumb" alt="' + row.filename + '" src="' + wallPaperImage + '" />';
									}
									htmlTag = htmlTag + '</div>';
									endHtmlTag = endHtmlTag + htmlTag;
								}
								endHtmlTag = endHtmlTag + '</div>';
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