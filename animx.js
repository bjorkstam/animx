(function (window, undefined) {
	var document = window.document,
		styleNode = document.documentElement.appendChild(document.createElement('style')),

		// element used for feature detection
		testElem = document.createElement('animx'),
		animx = window.animx = {};

		// Helper function to feature-test a css property
		// and fall back to vendor prefix (if applicable)
		function getProperty(prop) {
			var camelProp = camelCase(prop),
				capProp = camelProp.charAt(0).toUpperCase() + camelProp.slice(1),
				vendorPrefixes = 'Webkit Moz O ms'.split(' ');

			// First we want to test the actual property
			if (testElem.style[camelProp] !== undefined) {
				return prop;
			}

			// If not, we need to see if the property exists with a vendor prefix

			for (var i = 0; i < vendorPrefixes.length; i++) {
				var vendor = vendorPrefixes[i],
					omKey = vendor + capProp;

				if (testElem.style[omKey] !== undefined) {
					return "-" + vendor.toLowerCase() + "-" + prop;
				}
			}

			// Worst case scenario, the feature doesn't seem to be supported.
			// But lets not mess with anything, simply return the input

			return prop;
		}

		// Turns a css property into camelCase if needed,
		// ie, margin-left => marginLeft
		function camelCase(str) {
			var strLower = str.toLowerCase(),
				out = "";

			for (var i = 0; i < strLower.length; i++) {
				if (strLower.charAt(i) === '-') {
					continue;
				} else if (i > 0 && strLower.charAt(i-1) === '-') {
					out += strLower.charAt(i).toUpperCase();
				} else {
					out += strLower.charAt(i);
				}
			}
			return out;
		}


		// Config should have following properties:
		// name: keyframe name
		// values: all the animation values
		// ---
		// Will create a keyframes rule and change any css property
		// (non compatible) to include vendor prefix (if compatible)
		animx.createKeyframes = function (config) {

			var styleRules = [];

			styleRules.push(config.name + ' {');

			for (var key in config.values) {
				if (config.values.hasOwnProperty(key)) {
					styleRules.push(key + ' { ' + config.values[key].replace(/(?:(?:[\W\s][^\-a-zA-Z]|^)([a-zA-Z][A-Za-z-]+)[\s]?:)/g, function (match, prop) {
						return match.replace(prop, getProperty(prop));
					}) + ' }');
				}
			}

			styleRules.push('}');

			if (CSSRule.KEYFRAMES_RULE) { // W3C
				styleNode.sheet.insertRule('@keyframes ' + styleRules.join('\n'), 0);
			} else if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
				styleNode.sheet.insertRule('@-webkit-keyframes ' + styleRules.join('\n'), 0);
			} else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
				styleNode.sheet.insertRule('@-moz-keyframes ' + styleRules.join('\n'), 0);
			} else {
				// Failed
				return false;
			}

			return styleNode.sheet.cssRules[0];

		};


		// Will simply add a css-animation property to a given node
		animx.setAnimation = function (node, animValue) {
			var style = node.style;

			if (node.nodeType > 0 && style && typeof animValue === 'string') {
				if (style.animation !== undefined) {
					style.animation = animValue;
				} else if (style.WebkitAnimation !== undefined) {
					style.WebkitAnimation = animValue;
				} else if (style.MozAnimation !== undefined) {
					style.MozAnimation = animValue;
				} else if (style.OAnimation !== undefined) {
					style.OAnimation = animValue;
				} else if (style.msAnimation !== undefined) {
					style.msAnimation = animValue;
				}
			}
			return;
		};

})(window);