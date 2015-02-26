
var fs = require('fs');
var bigdataPath = "C:/John/NodeDev/CD34-Pro-Data/jhdata.json";
var jsontest;

function genefpkm(gene,locus,fpkm,name) {
    this.gene=gene;
    this.genename=name;
    this.locus=locus;
    this.fpkm=fpkm;

    this.folds=[];
}
genefpkm.prototype.addfold = function(sample1,sample2,log2fold,pvalue,qvalue) {
    var nfold = new fold(sample1,sample2,log2fold,pvalue,qvalue);
    this.folds.push(nfold);
};
/*genefpkm.prototype.setcluster = function(foldlimit) {
    var clusterstr = "XXX";
    var clusterarr = clusterstr.split("");
    for(i=0;i<this.folds.length;i++) {
        var pos;
        if (this.folds[i].sample1=="CD34") {
            pos=0;
        }
        if (this.folds[i].sample1=="BFU") {
            pos=1;
        }
        if (this.folds[i].sample1=="CFU") {
            pos=2;
        }

        var result = "";
        if (this.folds[i].log2fold>0) {
            result = "u";
        } else {
            result = "d";
        }
        if (Math.abs(this.folds[i].log2fold)>foldlimit) {
            result = result.toUpperCase();
        }
        //console.log(pos+" "+result);
        clusterarr[pos]=result;
    }
    this.cluster=clusterarr.join("");
};
*/

function loadconfig() {
	var configjson = fs.readFileSync(bigdataPath, 'utf-8');
	jsontest = JSON.parse(configjson);
}

loadconfig();

function loadDataSet(dataset) {

fs.readFile(dataset.files.ann, 'utf-8',function(error, contents) {
	var data =[];
	data = d3.tsv.parseRows(contents);
	
	genecols = data.shift();
	data.forEach(function(element, index, array) {element.splice(0,1)});
	genenames = data;
	data="";
});

fs.readFile(dataset.files.fpkm, 'utf-8', function (error, contents) {
	var data = [];
    
	data = d3.tsv.parseRows(contents);

	colnames = data.shift();
	colnames = ["gene","name","locus","CD34","BFU","CFU","Pro","Cluster"];
	
	newdata = data.map(function(x,i) { return new genefpkm(x[0],x[6],[ +x[9],+x[13],+x[17],+x[21]],genenames[i][2])});
		
	data="";
	geneindex = [].map.call(newdata,function(x) { return x.gene; })
});
//}


fs.readFile(dataset.files.diff, 'utf-8',function(error, contents) {
	var data = [];
	data = d3.tsv.parseRows(contents);
	
	genecols = data.shift();
    //console.log("data length"+data.length);
	var j=0;
	var i=0;
	while(i<data.length && j<newdata.length) {
		if (newdata[j].gene==data[i][1]) {
			newdata[j].addfold(data[i][2],data[i][3],data[i][7],data[i][9],data[i][10]);
			//console.log(i+" "+j);
			i++;
		} else {
		if (newdata[j].gene<data[i][1]) {
			j++;
		} 
		if (newdata[j].gene>data[i][1]) {
			i++;
		}
		}
	}
	//changeCluster(2.0);
	data=[];
	console.log("DONE!!");
	d3.select("#appStatus").text("Ready ...");
});

}

loadDataSet(jsontest[0]);

function clickLoad() {
    var file = document.getElementById("file1").value;
    console.log("clicked load");
    file = file.substring(0,file.lastIndexOf("\\")+1);
    loadDataSetFolder(file);
}

function loadDataSetFolder(path) {
    console.log("loading data "+path);
    var files = fs.readdirSync(path);

    for(i=0;i<files.length;i++) {
        var fileext=files[i].substring(files[i].lastIndexOf("."),files[i].length);
        if (fileext==".fpkm_tracking" || fileext==".count_tracking" || fileext==".info" || fileext==".read_group_tracking" || fileext==".diff") {
            //console.log("fpkm track");
            console.log(files[i]+" "+files[i].length+" "+fileext);
            var filepath = path+files[i];
            var filefd =  fs.openSync(filepath,'r');
            //var myline=fs.read(filefd, 100);
            var filebuf =new Buffer(100)
            fs.readSync(filefd, filebuf, 0, 100, 0)
            console.log(filebuf.toString());
        }

    }
    console.log(files);
}