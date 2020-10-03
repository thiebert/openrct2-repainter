// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="C:/Users/hello/Documents/OpenRCT2/bin/openrct2.d.ts" />

// Import a module from another file.
import Oui from "./OliUI";

//Vacuums up peeps in an area

var downCoord;
var currentCoord;
var myPrimaryColor = 0;
var mySecondaryColor = 0;

function selectTheMap() {
  var left = Math.min(downCoord.x, currentCoord.x);
  var right = Math.max(downCoord.x, currentCoord.x);
  var top = Math.min(downCoord.y, currentCoord.y);
  var bottom = Math.max(downCoord.y, currentCoord.y);
  ui.tileSelection.range = {
    leftTop: {
      x: left,
      y: top
    },
    rightBottom: {
      x: right,
      y: bottom
    }
  };
}

function repaintOnSelection() {
  var left = Math.min(downCoord.x, currentCoord.x) / 32;
  var right = Math.max(downCoord.x, currentCoord.x) / 32;
  var top = Math.min(downCoord.y, currentCoord.y) / 32;
  var bottom = Math.max(downCoord.y, currentCoord.y) / 32;
  console.log("hello");
  for (var x = left; x <= right; x++) {
    for (var y = top; y <= bottom; y++) {
      console.log("hi");
      var tile = map.getTile(x, y);
      console.log(tile);
      for (var i = 0; i < tile.numElements; i++) {
        var element = tile.getElement(i);
        console.log("element");
        if (element.type == "small_scenery" || element.type == "large_scenery") {

          element.primaryColour = myPrimaryColor;
          element.secondaryColour = mySecondaryColor;
        }
      }
    }
  }
}

var main = function () {
  if (typeof ui === 'undefined') {
    return;
  }
  var window = null;
  ui.registerMenuItem("Paint Area", function () {
    if (ui.tool && ui.tool.id == "repainter-tool") {
      ui.tool.cancel();
    } else {
      ui.activateTool({
        id: "repainter-tool",
        cursor: "cross_hair",
        onStart: function (e) {
          ui.mainViewport.visibilityFlags |= (1 << 7);
        },
        onDown: function (e) {
          downCoord = e.mapCoords;
          currentCoord = e.mapCoords;
        },
        onMove: function (e) {
          if (e.mapCoords.x != 0 || e.mapCoords.y != 0) {
            if (e.isDown) {
              currentCoord = e.mapCoords;
              selectTheMap();
            } else {
              downCoord = e.mapCoords;
              currentCoord = e.mapCoords;
              selectTheMap();
            }
          }
        },
        onUp: function (e) {
          repaintOnSelection();
          ui.tileSelection.range = null;
        },
        onFinish: function () {
          ui.tileSelection.range = null;
          ui.mainViewport.visibilityFlags &= ~(1 << 7);
          if (window != null)
            window.close();
        },
      });

      if (window == null) {
        var width = 220;
        var buttonWidth = 50;
        window = new Oui.Window("Repainter");
        window.setWidth(300);
        const label = new Oui.Widgets.Label("Select Colors and Drag an area to paint");
        window.addChild(label);
        const groupbox = new Oui.GroupBox("Colors");
        window.addChild(groupbox);

        const primary = new Oui.Widgets.ColorPicker(color => {
          myPrimaryColor = color;
          console.log(myPrimaryColor);
        });
        groupbox.addChild(primary);
        const secondary = new Oui.Widgets.ColorPicker(color => {
          mySecondaryColor = color;
        });
        groupbox.addChild(secondary);
        window.open();
      } else {
        window.bringToFront();
      }
    }
  });
};

registerPlugin({
  name: 'Repainter',
  version: '1.0',
  licence: "MIT",
  authors: ['thiebert'],
  type: 'remote',
  main: main
});