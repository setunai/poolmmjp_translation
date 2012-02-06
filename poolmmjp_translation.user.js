// ==UserScript==
// @name            poolmmjp_translation
// @namespace       http://blog.setunai.net/
// @include         http://*
// @include         https://*
// @version         0.81
// ==/UserScript==

if (document.contentType != 'text/html') return;
if (window.frameElement != null) return;

(function () {

	var _pt = {
		'debug' : false,
		'log' : function(msg) {
			if (!this.debug) {
				return;
			}
			GM_log(msg, 0);
		},

		'trim' : function (str) {
			return str.replace(/^[ |\r|\n|\t]+|[ |\r|\n|\t]+$/g, '');
		},

		'translation' : function (text) {
			_pt.log(text);

			var url = '';
			if (text.match(/^[\w|\s|\-|\.|\,|\_|\(|\)|\'|\"|\&|\%|\$|\#|\!|\+|\*|\/|\:|\;|\<|\>|\?]+$/)) {
				url = 'http://pipes.yahoo.com/poolmmjp/ej_translation_api?_render=json&text=';
			}else{
				url = 'http://pipes.yahoo.com/poolmmjp/je_translation_api?_render=json&text=';
			}
			url += encodeURI(text);

			GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				onload: function(res) {
					resObj = eval('(' + res.responseText + ')');

					var firstItem = resObj.value.items[0];
					if (firstItem == null) {
						alert('translation ng');
					}
					_pt.board.show(firstItem);
				},
				onerror: function(res) {
					alert('http request error');
				}
			});
		},

		'board' : {
			'id' : '_pt_board',
			'beforeId' : '_pt_before',
			'afterId'  : '_pt_after',

			'make' : function () {
				var board = document.createElement('div');
				board.id = this.id;
				board.addEventListener('dblclick', _pt.board.close, false);	// close

				with(board.style) {
					top = 0;
					left = 0;

					padding = '0px';
					margin = '0px';
					width = '100%';

					textAlign = 'left';
					MozOpacity = '0.75';

					color = '#000000';
					//backgroundColor = '#FFFFFF';
					backgroundColor = '#000000';
					border = '1px solid #000000';

					zIndex = 100;
					position = 'fixed';		// absolute, relative
				}

				var before = document.createElement('p'); 
				before.id = this.beforeId;
				with(before.style) {
					padding = '0px';
					margin = '0px';
					color = 'green';
					fontSize = 'small';
				}

				var after = document.createElement('p'); 
				after.id = this.afterId;
				with(after.style) {
					padding = '0px';
					margin = '0px';
					color = 'red';
					fontSize = 'small';
				}

				board.appendChild(before);
				board.appendChild(after);

				document.body.appendChild(board);
			},

			'show' : function (result) {
				var board = document.getElementById(this.id);
				if (board == null) {
					this.make();
					board = document.getElementById(this.id);
				}
				board.style.display = 'block';

				var before = document.getElementById(this.beforeId);
				var after  = document.getElementById(this.afterId);

				before.textContent = result.title;
				after.textContent  = result.description;
			},

			'close' : function (e) {
				var board = document.getElementById(this.id);
				if (board == null) {
					return false;
				}
				if (board.style.display == 'none') {
					return false;
				}

				board.style.display = 'none';
				return true;
			}
		}
	};

	window.addEventListener('mouseup', function(e) {
		_pt.log('mouseup');

		//if (!e.shiftKey) {
		if (!e.ctrlKey) {
			_pt.log('no ctrl key');
			return;
		}
		if (e.button != 0) {
			_pt.log('no left button');
			return;
		}

		var text = window.content.document.getSelection();
		text = _pt.trim(text);
		if (text == '') {
			_pt.log('no selected');
			return;
		}

		_pt.translation(text);
	}, false);

	window.addEventListener('keypress', function(e) {
		if (!e.ctrlKey) {
			_pt.log('no ctrl key');
			return;
		}
		if (e.keyCode != 112) {
			_pt.log('no F1 key');
			return;
		}

		if (_pt.board.close()) {
			return;
		}

		var text = prompt('e2j / j2e', '');
		if (text == null) {
			_pt.log('cancel click');
			return;
		}
		text = _pt.trim(text);
		if (text == '') {
			_pt.log('no input');
			return;
		}

		_pt.translation(text);
	}, false);

})();


