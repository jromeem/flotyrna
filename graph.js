var organizedData = [];
var files;
var currentlyLoadedGraph;   // used by next/previous buttons via reloadGraph()
var previousFile;           // used by file sidebar to reset bg color
var xymax;
var showStructuralColor;
var showComparModel;
var showComparFoldsOnly;
// var colorComparOnly;

//for the larger graph
var l_options = {
  series: {
    shadowSize: 0,
    lines: { show: true },
    points: { show: false },
    grid: { 
      hoverable: true,  //enables mouse-over events
      clickable: true,
    },
    color: "#006fff",
  },
  xaxis: { min: -5, max: 1600, ticks:12 },
  yaxis: { min: -5, max: 1600, ticks:12 },
  legend: {
    show: true,
    position: "se",
  },
  selection: {
            // empty because pan/zoom is enabled by default
    // mode: "xy",
    // square: true
  },
  zoom: {
    interactive: true
  },
  pan: {
    interactive: true,
    frameRate: 30
  },
}

//for the smaller overview graph
var s_options = {
  series: {
    shadowSize: 0,
    lines: { show: true },
    points: { show: false },
    grid: { hoverable: false },
    color: "#006fff",
  },
  xaxis: { min: -5, max: 1600, ticks:8 },
  yaxis: { min: -5, max: 1600, ticks:8 },
  legend: {
    show: false
  },
  selection: {
    mode: "xy",  //for selection plugin
    square: true
  }
}

$(function() {
  // set default values
  showStructuralColor = false;
  showComparModel = false;
  showComparFoldsOnly = true;
  // colorComparOnly = true;

  // prints footer
  $("#footer").prepend("Flot " + $.plot.version);

  // toggles square zoom/free zoom with click/drag zooming
  $("#enableSquareZoom").on("click", enableSquareZoom);

  // toggles between click/drag zoom and navigation
  $("#toggleNav").on("click", toggleNav);

  // toggle color scheme between structural and comparative
  $("#toggleColor").on("click", function() {
    showStructuralColor = (showStructuralColor + 1) % 2;
    // if (!showStructuralColor) {
    //   colorComparOnly = false;
    //   $("#toggleColorComparOnly").prop("checked", false);
    // }
    flotFileData(files[currentlyLoadedGraph], 0);
  });

  // display color scheme for comparative models only
  // $("#toggleColorComparOnly").on("click", function() {
  //   showStructuralColor = (showStructuralColor + 1) % 2;
  //   flotFileData(files[currentlyLoadedGraph], 0);
  // });

  // display the comparative model
  $("#toggleComparModel").on("click", function() {
    showComparModel = (showComparModel + 1) % 2;
    flotFileData(files[currentlyLoadedGraph], 0);
  });

  // display comparative folds only
  $("#toggleComparFoldOnly").on("click", function() {
    showComparFoldsOnly = (showComparFoldsOnly + 1) % 2;
    flotFileData(files[currentlyLoadedGraph], 0);
  });
});

$(document).ready(function() {
  if(isAPIAvailable()) {
    $('#fileInput').bind('change', handleFileSelect);
  }
  flotTextData();

  $('#run').bind('click', flotTextData);
});

  // displays a warning if the browser doesn't support the HTML5 File API
function isAPIAvailable() {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    return true;
  } else {
    alert("The browser you're using does not currently support\nthe HTML5 File API. As a result the file loading demo\nwon't work properly.");
    return false;
  }
}

// init for flot
function flotTextData() {
  var fileData = [];
  bioflot = $.plot('#placeholder', fileData, l_options);
  flotmap = $.plot('#overview', fileData, s_options);

// bind main graph for selection plugin
  $("#placeholder").bind("plotselected", function (event, ranges) {

    // clamp the zooming to prevent eternal zoom
    if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
      ranges.xaxis.to = ranges.xaxis.from + 0.00001;
    }
    if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
      ranges.yaxis.to = ranges.yaxis.from + 0.00001;
    }

    // do the zooming
    bioflot = $.plot("#placeholder", organizedData,
      $.extend(true, {}, l_options, {
        xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
        yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
      })
    );

    // don't fire event on the overview to prevent eternal loop
    flotmap.setSelection(ranges, true);
  });

  // this function binds selection on overview to main graph area
  $("#overview").bind("plotselected", function (event, ranges) {
    bioflot.setSelection(ranges);
  });
}

// allows user to reset zoom state via button
function resetZoom() {
  bioflot = $.plot("#placeholder", organizedData,
   $.extend(true, {}, l_options, {
     xaxis: { min: -5, max: xymax },
     yaxis: { min: -5, max: xymax }
   })
  );
}

// toggles between pan/zoom and selection zooming on main graph
function toggleNav() {
  if ($("#toggleNav").prop('checked')) {
    // disable pan/zoom
    l_options.zoom = {};
    l_options.pan = {};

    // enable selection zooming on main
    l_options.selection.mode = "xy";
    l_options.selection.square = true;
  }
  else {
    // disable selection zooming on main
    l_options.selection = {};
    // s_options.selection = {};  //this is for smaller graph- dont need to change it for now

    // enable pan/zoom
    l_options.zoom.interactive = true;
    l_options.pan.interactive = true;
    l_options.pan.frameRate = 30;
  }

  // update plot options
  bioflot = $.plot("#placeholder", organizedData, l_options);
  bioflot.setupGrid();
  bioflot.draw();
}

/* Currently Unused */
// allows user to disable/enable square zoom feature
function enableSquareZoom() {
  if ($("#enableSquareZoom").prop('checked')) {
    l_options.selection.square = true;
    s_options.selection.square = true;
  }
  else {
    l_options.selection.square = false;
    s_options.selection.square = false;
  }
  // update plot options
  bioflot = $.plot("#placeholder", organizedData, l_options);
  flotmap = $.plot("#overview", organizedData, s_options);

  // redraw graphs with new option settings
  bioflot.setupGrid();
  bioflot.draw();
  flotmap.setupGrid();
  flotmap.draw();
}

// handles csv files
function handleFileSelect(evt) {
  files = evt.target.files; // FileList object
  // reset the flot dataset and load new file
  bioflot.setData([]);
  flotFileData(files[0], 1);
  currentlyLoadedGraph = 0;
  displayFiles();
  $("#file-button_0").css("background-color", "#ff6600");
  previousFile = 0;
}

// displays/updates currently loaded files
function displayFiles() {
  // clear current file list
  $(".file-names").remove();

  // populate visual file list
  for (var i = 0; i <= files.length - 1; i++) { 
    $("#filebar").append('<div id="file-button_' + i + '"class="file-names">' + files[i].name + '</div>');
  };

  // load file on clicking the div/tab
  $(".file-names").click(function () {
    var name = $(this).attr("id");
    var fileNumber = name.substr(name.lastIndexOf('_') + 1);
    sidebarFileLoad(fileNumber);
  });
}

// load graphs based on input from file sidebar
function sidebarFileLoad(file) {
  $("#file-button_" + previousFile).removeAttr('style');
  flotFileData(files[file], 1);
  currentlyLoadedGraph = file;
  $("#file-button_" + file).css("background-color", "#ff6600");
  previousFile = file;
}

// next/previous/file select
function reloadGraph(n) {
  switch(n)
  {
    case 0:
    if(files == null)
      alert("Warning, no files loaded!");
    else {
      if (files.length > 1) {
      currentlyLoadedGraph = prompt("File to load (from 1 to " + (files.length) + "):") - 1;   //prompt user for input. subtract one to provide illusion of index starting at 1
      sidebarFileLoad(currentlyLoadedGraph);
    }
    else
      alert("Only one file is loaded.");
  }
  break;

  case 1:
  if(files == null)
    alert("Warning, no files loaded!");
  else {
    if (files.length > 1) {
      if ((currentlyLoadedGraph - 1) >= 0) {
        currentlyLoadedGraph--;
        sidebarFileLoad(currentlyLoadedGraph);
      }
      else
        alert("No previous graph to load.");
    }
    else
      alert("Only one file is loaded.");
  }
  break;

  case 2:
  if(files == null)
    alert("Warning, no files loaded!");
  else {
    if (files.length > 1) {
      if ((currentlyLoadedGraph) < files.length - 1) {
        currentlyLoadedGraph++;
        sidebarFileLoad(currentlyLoadedGraph);
      }
      else
        alert("No next graph to load.");
    }
    else
      alert("Only one file is loaded.");
  }
  break;

  default:
  alert("Invalid use of reloadGraph().");
  }
}

function flotGraphCompar() {
  // clears graph between loading files
  organizedData = [];
  for (var j = 0; j < rawDataOriginal.length; j++) {
    organizedData.push(
      [[rawDataOriginal[j][3], rawDataOriginal[j][2]],
      [rawDataOriginal[j][4], rawDataOriginal[j][1]]
    ]);
  }

  for (var k = 0; k < rawDataOriginal.length; k++) {
    var foldColor = "#333";
    for (var h = 0; h <= (rawDataOriginal[k][4] - rawDataOriginal[k][3]); h++) {
      // if(showStructuralColor) {
      //   switch(rawDataOriginal[k][13]) {
      //     // primary initiation; yellow
      //     case 1: foldColor = PRIMARY_INITIATION;
      //     break;
      //     // primary elongation; orange
      //     case 2: foldColor = PRIMARY_ELONGATION;
      //     break;
      //     // secondary initiation; green-blue/turqoise
      //     case 3: foldColor = SECONDARY_INITIATION;
      //     break;
      //     // secondary elongation; blue
      //     case 4: foldColor = SECONDARY_ELONGATION;
      //     break;
      //     default: foldColor = "#000000"; //this shouldn't happen
      //   }
      // }
      // else
      //   foldColor = "#006fff";  //display missed
      organizedData.push({
        color: foldColor,
        data:
        [[(rawDataOriginal[k][1] + h), (rawDataOriginal[k][1] + h)],
        [(rawDataOriginal[k][1] + h), (rawDataOriginal[k][4] - h)],
        [(rawDataOriginal[k][4] - h), (rawDataOriginal[k][4] - h)]
      ]});
    }
  }



}

function flotFileData(file, avbCheck) {
  var reader = new FileReader();
  reader.readAsText(file);
  $("#displayFileNumber").html("Current file: " + file.name);
  reader.onload = function(event){
    var csv = event.target.result;

    //newData is of form [Array[2], Array[2] ... Array[2]]
    var newData = $.csv.toArrays(csv, {
      onParseValue:$.csv.hooks.castToScalar
    });

    // detect largest x/y values for current file
    xymax = newData[newData.length-1][4];
    xymax += xymax/100 + 10;
    console.log(xymax);

    //check if file is avb file; if so, only show  compar lines
    if (avbCheck) {
      if (file.name.indexOf("avb") != -1) {
        showComparFoldsOnly = true;
        $('#toggleComparFoldOnly').prop('checked', true);
      }
      else {
        showComparFoldsOnly = false;
        $('#toggleComparFoldOnly').prop('checked', false);
      }
    }
    // reload compar graph
    organizedData = [];
    if (showComparModel)
      flotGraphCompar();
    for (var j = 1; j < newData.length; j++) {
      //put [[x1,y1], [x2,y2]] into organizedData[]
      //csv: y1, y2, x2, y2

      // organizedData[j] = [[newData[j][3], newData[j][0]], [newData[j][2], newData[j][1]]];
      if(newData[j][8]) {
        organizedData.push({
          color: "#ff6600",
          data:
          [[newData[j][3], newData[j][2]],
          [newData[j][4], newData[j][1]]
          ]});
      }
      else
        organizedData.push( {
          color: "#006fff",
          data:
          [[newData[j][3], newData[j][2]],
          [newData[j][4], newData[j][1]]
        ]});
    }
    //draw triangles
    for (var k = 1; k < newData.length; k++) {
      var foldColor;
      if(showStructuralColor) {
        switch(newData[k][13]) {
          // primary initiation; yellow
          case 1: foldColor = PRIMARY_INITIATION;
          break;
          // primary elongation; orange
          case 2: foldColor = PRIMARY_ELONGATION;
          break;
          // secondary initiation; green-blue/turqoise
          case 3: foldColor = SECONDARY_INITIATION;
          break;
          // secondary elongation; blue
          case 4: foldColor = SECONDARY_ELONGATION;
          break;
          default: foldColor = "#000000"; //this shouldn't happen
        }
      }
      // if comparative == 1, draw its triangle
      if (newData[k][8]) {
        for (var h = 0; h <= (newData[k][4] - newData[k][3]); h++) {
          if(!showStructuralColor)
            foldColor = COMPARATIVE_FOLD;  //red
          organizedData.push({
            color: foldColor,
            data:
            [[(newData[k][1] + h), (newData[k][1] + h)],
            [(newData[k][1] + h), (newData[k][4] - h)],
            [(newData[k][4] - h), (newData[k][4] - h)]
          ]});
        }
      }
      // fold is made but not in compar model
      else if(!showComparFoldsOnly) {
        if(!showStructuralColor)
          foldColor = NON_COMPARATIVE_FOLD; //blue
        for (var h = 0; h <= (newData[k][4] - newData[k][3]); h++) {
          organizedData.push({
            color: foldColor,
            data:
            [[(newData[k][1] + h), (newData[k][1] + h)],
            [(newData[k][1] + h), (newData[k][4] - h)],
            [(newData[k][4] - h), (newData[k][4] - h)]
          ]});
        }
      }
    }

    // draw diagonal line
    // should this be put first or last? last for now.
    organizedData[organizedData.length] = {
      data: [[-5000,-5000],[5000,5000]],
      color: "#555"
    };

    // legend
    if (showComparModel) {
      organizedData.push({
        color: "#333",
        label: "Comparative Model",
        data: [],
      });
    }
    if (showStructuralColor) {
      organizedData.push({
        color: PRIMARY_INITIATION,
        label: "Primary Initiation",
        data: [],
      });
      organizedData.push({
        color: PRIMARY_ELONGATION,
        label: "Primary Elongation",
        data: [],
      });
      organizedData.push({
        color: SECONDARY_INITIATION,
        label: "Secondary Initiation",
        data: [],
      });
      organizedData.push({
        color: SECONDARY_ELONGATION,
        label: "Secondary Elongation",
        data: [],
      });
    }
    else {
      organizedData.push({
        color: COMPARATIVE_FOLD,
        label: "Comparative Fold",
        data: [],
      });
      organizedData.push({
        color: NON_COMPARATIVE_FOLD,
        label: "Non-Comparative Fold",
        data: [],
      });
    }

    // append to the existing dataset
    bioflot.setData(organizedData);
    bioflot.setupGrid();
    bioflot.draw();

    flotmap.setData(organizedData);
    flotmap.setupGrid();
    flotmap.draw();
    resetZoom();
  };
  reader.onerror = function() { alert('Unable to read ' + file.fileName); };
}

var rawDataOriginal = comparativeModelData;