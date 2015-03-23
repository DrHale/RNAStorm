
var gui = require('nw.gui');

var geneindex = [];
var filtered = [];
var displayNrows = 15;
var win = gui.Window.get();
var newdata = [];

var genenames = [];
var genediff = [];

var filter = {
    "symbol": "",
    "genename": "",
    "minFpkm": 0,
    "maxFpkm": 0,
    "foldChange": 0,
    "cluster": ""
};

Object.observe(filter, function(changeRecords) {
    //console.log('observe', changeRecords);
    clickFilter();
    clickDisplay();
});

function imageclip(img) {
	img.clipboardData.setData('image/png', imgClip.src);
}

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Uint8Array(array);
}

function genelisttoClipboard() {
var clipboard = gui.Clipboard.get();
clipboard.clear();

var strList = [].map.call(filtered,function(x) { return x.gene; });
var strClip = strList.join("\n");

clipboard.set(strClip, 'text');
}

function copytoclipboard(svgclip) {

//console.log(svgclip);
//console.log(geneplots[svgclip]);
var canvas = document.getElementById("canvas");
var svg = d3.select("#svgClipboard");

lineGraph(geneplots[svgclip],svg,0);
canvg(canvas, svg.html());

var testdata = dataURItoBlob(canvas.toDataURL());
var buf = new Buffer(testdata,'base64');

fs.writeFile('temp.png', buf, function (err) {
  if (err) throw err;
  //console.log('It\'s saved!');
});

svg.html("");

var exec = require('child_process').exec,
    child;

child = exec('convert temp.png -background white -alpha remove clipboard:',
  function (error, stdout, stderr) {
    //console.log('stdout: ' + stdout);
    //console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

/*
Add clear down of svg and canvas etc!!
*/

}

function fold(sample1,sample2,log2fold,pvalue,qvalue) {
	this.sample1=sample1;
	this.sample2=sample2;
	this.log2fold=+log2fold;
	this.pvalue=+pvalue;
	this.qvalue=+qvalue;
}

function getGene(gene) {
	var retVal = geneindex.indexOf(gene);
  return retVal;
}

function changeCluster(foldChangeLimit) {
	newdata.forEach(function(x) {x.setcluster(foldChangeLimit)});
}

function txtFilter(element) {

    var filterResult = (element.gene.indexOf(filter.symbol) > -1);

    filterResult = filterResult && (element.genename.indexOf(filter.genename) > -1);

    if (filter.cluster!="") {
        try {
            var re = new RegExp(filter.cluster);
            var testre = (element.cluster.search(re)>-1);
        } catch(err) {
            //console.log("Reg Error!"+err);
            var testre = true;
        }

        filterResult = filterResult && testre;
    }

    if (!isNaN(filter.foldChange)) {
        var testfold = element.folds.filter(function(x) {return Math.abs(x.log2fold)>filter.foldChange});
        filterResult = filterResult && (testfold.length>0);
    }

    if (!isNaN(filter.minFpkm)) {
        var testMin = d3.max(element.fpkm) > filter.minFpkm;
        filterResult = filterResult && testMin;
    }

    if (!isNaN(filter.maxFpkm)) {
        var testMax = d3.max(element.fpkm) < filter.maxFpkm;
        filterResult = filterResult && testMax;
    }

    return filterResult;
}

function clickFilter() {
    //delete filtered;
	filtered = newdata.filter(txtFilter);
	//console.log(filtered.length);
	//updateNumFilterResults(filtered.length);
    var toChange= document.getElementById('nfilterResults');
    toChange.innerHTML = filtered.length;
	//updateMaxScroll(filtered.length);
    var genePos = document.getElementById('minGene');
    var currentPos = parseInt(genePos.value);
    if ((filtered.length-displayNrows)<0 ) {
        genePos.max = 0;
    } else {
        genePos.max = filtered.length-displayNrows;
    }

    if (currentPos>filtered.length) {
        genePos.value=genePos.max;
    }
}

function changetxtFoldLimit() {
	var foldLimitChange = parseFloat(document.getElementById('txtFoldLimit').value);
	if (!isNaN(foldLimitChange)) {
		changeCluster(foldLimitChange);
		changetxtFilter();
	}
	//var nested_data = d3.nest().key(function(d) { return d.cluster; }).rollup(function(leaves) { return leaves.length; }).entries(newdata);
}

function changetxtFilter() {
    filter.symbol = document.getElementById('txtGene').value.toUpperCase();
    filter.genename = document.getElementById('txtGeneName').value;
    filter.foldChange = parseFloat(document.getElementById('txtFold').value);
    filter.minFpkm = parseFloat(document.getElementById('txtMin').value);
    filter.maxFpkm = parseFloat(document.getElementById('txtMax').value);
    filter.cluster = document.getElementById('txtCluster').value;
}

function pickgene(geneid,column) {

	if (column==0) {
		var genelink = "http://www.genecards.org/cgi-bin/carddisp.pl?gene="+geneid;

        console.log("here");
        gui.Window.get(
            window.open(genelink)
        )
	} else {
		addChart(geneid,loadedDataset);
	}
	
}

function clickData() {
    console.log("Clicked Datasets");
    loadconfig();
    $('#myModal').modal('show');
}


window.onload = function() {
    loadconfig();
    loadDataSet(jsontest[0]);
    document.getElementById("example1").addEventListener("mousewheel", tableScroller, false);
};
