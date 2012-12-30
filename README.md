animx
=====

Small JS Library which exposes some helper methods for creating css3 animations. The goal is to ease the creation of keyframes in cases where a property's value need to be set at runtime. In addition, animx can determine whether a given css property need to have a vendor prefix, taking away some cross-browser dependent code.

`animx.createKeyframes` creates a new css keyframe. Examples:

	var kf = animx.createKeyFrames({
		name: "move",
		values: {
			to: "transform: rotateX(100deg);",
			from: "transform: rotateX(-100deg);"
		}
	});

	var kf2 = animx.createKeyFrames({
		name: "move2",
		values: {
			"0%": "left: 20px;",
			"33%": "left: 50px;",
			"70%": "left: 90px;",
			"90%": "left: 15px;",
			"100%": "left: 20px;"
		}
	});


Additionally, `animx.setAnimation` will add an animation property to a given DOM node. Example:
	
	var node = document.getElementById("ball");

	animx.setAnimation(node, "move 10s linear infinite");
	// would be similar to:
	// #ball { animation: move 10s linear infinite; }
	// Or, if animation property isn't supported (in FF for instance):
	// #ball { -moz-animation: move 10s linear infinite; }

