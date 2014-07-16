"use strict";

var LevelState = function(_game) {
	LR.State.call(this, _game);
	_game.state.add("Level", this, false);

	this.level = null;
};

LevelState.prototype = Object.create(LR.State.prototype);
LevelState.prototype.constructor = LevelState;

LevelState.prototype.init = function(_args) {
	if (_args) {
		if (_args.levelName) {
			this.levelName = _args.levelName;
			this.storage = "file";
		}
	}
};

LevelState.prototype.preload = function() {
	if (this.levelName == null) {
		this.levelName = GameCore.GetUrlParamValue("levelname");
	}

	if (this.storage == null) {
		this.storage = GameCore.GetUrlParamValue("storage");
	}

	//LEVEL JSON FILE LOADING
	if (this.storage === "localstorage") {
		// load from localstorage
		var lvlStr = localStorage.getItem(this.levelName);
		this.level = JSON.parse(lvlStr);
	} else {
		var url = "assets/levels/" + this.levelName + ".json";
		// load from file
		this.game.load.json("level", url, true);
	}

};

LevelState.prototype.create = function() {
	//====== PHYSICS ============
	//init P2 system
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	//Create the collision manager
  this.collisionManager = new CollisionManager(this.game);
  //Try getting layers data from the loaded file ( at assets/physics/layers.json )
  var layersData = this.game.cache.getJSON("layersData")
  if( layersData )
  	this.collisionManager.init(layersData);
	this.game.physics.p2.gravity.y = 600;


	if (this.game.cache.getJSON("level")) {
		this.level = this.game.cache.getJSON("level");
	}
	
	if (this.level) {
		// convert in JSON if needed
		if (typeof this.level === "string") {
			this.level = JSON.parse(this.level);
		}

		var importer = new LR.LevelImporterGame();
		importer.import(this.level, this.game);

		
	} else {
		console.error("LevelState - No level");
	}

};