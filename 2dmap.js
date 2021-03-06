var organizedData = [];
var files;
var currentlyLoadedGraph;   // used by next/previous buttons via reloadGraph()
var previousFile;           // used by file sidebar to reset bg color
var condDist;
var showStructuralColor;
var showComparFoldsOnly;
var showOutOfRange;

// defualt sequence: e.coli 16s
var rnaMap = e_coli_16s;
var rawDataOriginal = rnaMap['2d_map'];


//for the larger graph
var l_options = {
  series: {
    shadowSize: 0,
    lines: { show: false },
    points: { show: false },
    color: "#000",
    showLabels: true,
    labelPlacement: "above",
    canvasRender: true,
    cColor: "#444", // was #AD8200
    cPadding: -8
  },
  legend: {
    show: true,
    position: "se",
  },
  grid: { 
    hoverable: true,  //enables mouse-over events
    clickable: true,
    borderWidth: 0,
    minBorderMargin: 0
  },
  xaxis: { min: -500, max: 800, ticks: 0 },
  yaxis: { min: -700, max: 500, ticks: 0 },
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
  }
}

//for the smaller overview graph
var s_options = {
  series: {
    shadowSize: 0,
    lines: { show: true },
    points: { show: true, fillColor: "#000", radius:.3 },
    grid: { hoverable: false },
    color: "#000",
  },
  legend: {
    show: false
  },
  grid: { 
    borderWidth: 0,
    minBorderMargin: 0
  },
  xaxis: { min: -500, max: 800, ticks: 0 },
  yaxis: { min: -700, max: 500, ticks: 0 },
  selection: {
    mode: "xy",  //for selection plugin
    square: true
  }
}

$(function() {
  // set default values
  showStructuralColor = false;
  showComparFoldsOnly = true;
  showOutOfRange = true;
  condDist = 15;
  $("#condDist").prop("value", 15);

  // prints footer
  $("#footer").prepend("Flot " + $.plot.version);

  // toggles square zoom/free zoom with click/drag zooming
  $("#enableSquareZoom").on("click", enableSquareZoom);

  // toggles between click/drag zoom and navigation
  $("#toggleNav").on("click", toggleNav);

  // allows user to modify condition distance for folding
  $("#condDistButton").on("click", function() {
    condDist = $("#condDist").prop("value");
    if (showOutOfRange)
      flotFileData(files[currentlyLoadedGraph]);
  });

  // shows only comparative folds made
  $("#toggleComparFoldOnly").on("click", function() {
    showComparFoldsOnly = (showComparFoldsOnly + 1) % 2;
    flotFileData(files[currentlyLoadedGraph]);
  });

  // toggle color scheme between structural and comparative
  $("#toggleColor").on("click", function() {
    showStructuralColor = (showStructuralColor + 1) % 2;
    flotFileData(files[currentlyLoadedGraph]);
  });

  $("#toggleOutOfRange").on("click", function() {
    showOutOfRange = (showOutOfRange + 1) % 2;
  });

});

$(document).ready(function() {
  if(isAPIAvailable()) {
    $('#fileInput').bind('change', handleFileSelect);
  }
  //draw initial diagram
  flotTextData();
  flotLoadSecondaryStructure();
  bioflot.setData(organizedData);
  bioflot.setupGrid();
  bioflot.draw();

  flotmap.setData(organizedData);
  flotmap.setupGrid();
  flotmap.draw();
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
     xaxis: { min: -500, max: 800, ticks: 0 },
     yaxis: { min: -700, max: 500, ticks: 0 }
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
  flotFileData(files[0]);
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
  flotFileData(files[file]);
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
      flotFileData(files[currentlyLoadedGraph]);
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
        flotFileData(files[currentlyLoadedGraph]);
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
        flotFileData(files[currentlyLoadedGraph]);
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

/*  This function essentially graphs the initial secondary structure */
function flotLoadSecondaryStructure() {
  // clears graph between loading files
  organizedData = [];
  for (var j = 0; j < rawDataOriginal.length; j++) {
    var tempChar = rawDataOriginal[j][1];
    organizedData.push( {
        data: [[rawDataOriginal[j][2], rawDataOriginal[j][3]]],
        labels: [tempChar],
    });
  }
}

// please document this
function flotGraphComparModel() {
  var tempData = comparativeModelData;
  var nBaseColor;
  if (showStructuralColor)
    nBaseColor = "#444";
  else
    nBaseColor = "#0066ff";
  // clears graph between loading files
  for (var i = 1; i < tempData.length; i++) {
    if(tempData[i][8]) {
      for (var j = tempData[i][1]; j <= tempData[i][2]; j++) {
        organizedData[j-1].color = nBaseColor;
        organizedData[j-1].cColor = nBaseColor;
      }
      for (var j = tempData[i][3]; j <= tempData[i][4]; j++) {
        organizedData[j-1].color = nBaseColor;
        organizedData[j-1].cColor = nBaseColor;
      }
    }
  }
}

// pick RNA sequence
// change info and plot accordingly
function pickRNA(map) {
  // TODO
  rnaMap = map
  rawDataOriginal = rnaMap['2d_map'];
  flotLoadSecondaryStructure();

  var t;
  var xmin; var xmax;
  var ymin; var ymax;

  if (rnaMap['name'] == 'tRNA-Phenylalanine') {
    xmin = 50; xmax = 600;
    ymin = -550; ymax = 0;
  } else if (rnaMap['name'] == 'E.coli 5s') {
    xmin = 150; xmax = 470;
    ymin = -420; ymax = -100;
  } else if (rnaMap['name'] == 'E.coli 16s') {
    xmin = -500; xmax = 800;
    ymin = -700; ymax = 500;
  } else if (rnaMap['name'] == 'E.coli 23s') {
    xmin = -280; xmax = 1000;
    ymin = -1050; ymax = 220;
  } else {
    xmin = 0; xmax = 0;
    ymin = 0; ymax = 0;
  }

  $("#rnaSeq").html(rnaMap['name'] + ' ' + rnaMap['gen_bank_id']);

  //alert(organizedData[0]);
  bioflot = $.plot('#placeholder', organizedData,
   $.extend(true, {}, l_options, {
     xaxis: { min: xmin, max: xmax, ticks: 0 },
     yaxis: { min: ymin, max: ymax, ticks: 0 }
   })
  );

  flotmap = $.plot('#overview', organizedData,
   $.extend(true, {}, s_options, {
     xaxis: { min: xmin, max: xmax, ticks: 0 },
     yaxis: { min: ymin, max: ymax, ticks: 0 }
   })
  );
}

function flotFileData(file) {
  var reader = new FileReader();
  reader.readAsText(file);
  $("#displayFileNumber").html("Current file: " + file.name);
  reader.onload = function(event){
    var csv = event.target.result;

    //newData is of form [Array[2], Array[2] ... Array[2]]
    var newData = $.csv.toArrays(csv, {
      onParseValue:$.csv.hooks.castToScalar
    });
    // reset graph state
    flotLoadSecondaryStructure();
    //pickRNA(rnaMap);

    // load comparative model data
    flotGraphComparModel();

    // modify the data; start @ 1 to skip column titles
    // do comparative coloring
    for (var i = 1; i < newData.length; i++) {
      var nBaseColor;
      if (newData[i][11] > condDist && showOutOfRange) {
        nBaseColor = "#BF3EFF"; //purple
        for (var j = newData[i][1]; j <= newData[i][2]; j++) {
          organizedData[j-1].color = nBaseColor;
          organizedData[j-1].cColor = nBaseColor;
        }
        for (var j = newData[i][3]; j <= newData[i][4]; j++) {
          organizedData[j-1].color = nBaseColor;
          organizedData[j-1].cColor = nBaseColor;
        }
        continue; // jump to next interation
      }
      if (showStructuralColor) {
        switch(newData[i][13]) {
          // primary initiation; yellow
          case 1: nBaseColor = PRIMARY_INITIATION;
          break;
          // primary elongation; orange
          case 2: nBaseColor = PRIMARY_ELONGATION;
          break;
          // secondary initiation; green-blue/turqoise
          case 3: nBaseColor = SECONDARY_INITIATION;
          break;
          // secondary elongation; blue
          case 4: nBaseColor = SECONDARY_ELONGATION;
          break;
          default: nBaseColor = "#000000"; //this shouldn't happen
        }
      }
      // if comparative fold
      if(newData[i][8]) {
        if (!showStructuralColor)
          nBaseColor = "#CD2626"; //red
        for (var j = newData[i][1]; j <= newData[i][2]; j++) {
          organizedData[j-1].color = nBaseColor;
          organizedData[j-1].cColor = nBaseColor;
        }
        for (var j = newData[i][3]; j <= newData[i][4]; j++) {
          organizedData[j-1].color = nBaseColor;
          organizedData[j-1].cColor = nBaseColor;
        }
      }
      // not comparative fold
      else if (!showComparFoldsOnly){
        if (!showStructuralColor)
          nBaseColor = "#76EE00"; //green
        for (var j = newData[i][1]; j <= newData[i][2]; j++) {
          if (organizedData[j-1].color != "#CD2626") { //prevent overwrite of reds
            organizedData[j-1].color = nBaseColor;
            organizedData[j-1].cColor = nBaseColor;
          }
        }
        for (var j = newData[i][3]; j <= newData[i][4]; j++) {
          if (organizedData[j-1].color != "#CD2626") { //prevent overwrite of reds
            organizedData[j-1].color = nBaseColor;
            organizedData[j-1].cColor = nBaseColor;
          }
        }
      }
    }

    // legend
    // organizedData.push({
    //   color: "#444",
    //   label: "Untouched",
    //   data: [],
    // });
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
        color: "#CD2626",
        label: "Correct Comparative Fold",
        data: [],
      });
      organizedData.push({
        color: "#0066ff",
        label: "Missed Comparative Fold",
        data: [],
      });
    }
    if (!showComparFoldsOnly) {
      organizedData.push({
        color: "#33CC00",
        label: "Incorrect Fold",
        data: [],
      });
    }
    if (showOutOfRange) {
      organizedData.push({
        color: "#BF3EFF",
        label: "Out of Range",
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