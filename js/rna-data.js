
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
    for (i=0;i<jsontest.length;i++) {
        jsontest[i] = new dataset(jsontest[i]);
    }

    //var htmldatasets = document.getElementById('divdatasets');
    var htmldatasets = d3.select("#divdatasets").html("");
    //htmldatasets.innerHTML = jsontest.length;
    for(i=0;i<jsontest.length;i++) {

        var row = htmldatasets.append("div").attr("class","panel panel-default");

        var header = row.append("div")
            .attr("class","panel-heading")
            .attr("role","tab")
            .attr("id","heading"+i);


        header.append("span")
            .attr("class","panel-title")
            .append("a")
            .attr("data-toggle","collapse")
            .attr("data-parent","#divdatasets")
            .attr("href","#collapse"+i)
            .attr("aria-expanded","true")
            .attr("aria-controls","collapse"+i)
            .text(jsontest[i].name);

        header.append("div")
            .attr("class","pull-right")
            .append("button")
            .attr("type","button")
            .attr("class","btn btn-default btn-xs")
            .attr("onclick","removeDataset("+i+")")
            .append("span")
            .attr("class","glyphicon glyphicon-remove");

        header.append("div")
            .attr("class","pull-right")
            .append("button")
            .attr("type","button")
            .attr("class","btn btn-default btn-xs")
            .attr("onclick","editdataset("+i+")")
            .append("span")
            .attr("class","glyphicon glyphicon-pencil");

        header.append("div")
            .attr("class","pull-right")
            .append("button")
            .attr("type","button")
            .attr("class","btn btn-default btn-xs")
            .attr("onclick","loadDataSet(jsontest["+i+"])")
            //.attr("onclick","pickgene('"+d.gene+"',1)")
            .append("span")
            .attr("class","glyphicon glyphicon-hdd");

        var content = row.append("div")
            .attr("id","collapse"+i)
            .attr("class","panel-collapse collapse")
            .attr("role","tabpanel")
            .attr("aria-labelledby","heading"+i)
            .append("div")
            .attr("class","panel-body")
            .text(jsontest[i].description);

    }
}

loadconfig();

function saveConfig() {
    var filedata = JSON.stringify(jsontest);
    fs.writeFileSync(bigdataPath, filedata,'utf-8');
}

function editdataset(datasetindex) {
    var dataset = jsontest[datasetindex];
    console.log(dataset.name);
    var htmleditdataset = d3.select("#diveditdataset").html("")
        .append("form")
        .attr("name","editds");

    htmleditdataset.append("label")
        .text("Name");

    htmleditdataset.append("input")
        .attr("class","form-control")
        .attr("type","text")
        .attr("name","dsname")
        .attr("value",dataset.name);

    htmleditdataset.append("label")
        .text("Description");
    htmleditdataset.append("input")
        .attr("class","form-control")
        .attr("type","text")
        .attr("name","dsdescription")
        .attr("value",dataset.description);

    htmleditdataset.append("label")
        .text("Annontation");
    htmleditdataset.append("input")
        .attr("class","form-control")
        .attr("type","text")
        .attr("name","dsannotation")
        .attr("value",dataset.Annotation);

    htmleditdataset.append("label")
        .text("Samples");
    htmleditdataset.append("input")
        .attr("class","form-control")
        .attr("type","text")
        .attr("name","dssamples")
        .attr("value",dataset.Samples);

    htmleditdataset.append("label")
        .text("Files");
    htmleditdataset.append("input")
        .attr("class","form-control")
        .attr("type","text")
        .attr("name","dsfiles")
        .attr("value",JSON.stringify(dataset.files));

    htmleditdataset.append("input")
        .attr("class","form-control")
        .attr("type","hidden")
        .attr("name","dsindex")
        .attr("value",datasetindex);

    $('#myModal').modal('hide');
    $('#editModal').modal('show');
}

function saveDataset() {
    var dsform = document.editds;
    var index = +dsform.dsindex.value;

    //console.log(index);
    jsontest[index].name = dsform.dsname.value;
    jsontest[index].description = dsform.dsdescription.value;

    saveConfig();
    loadconfig();
    $('#myModal').modal('show');
}

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
    data.shift();
	//colnames = data.shift();
	//colnames = ["gene","name","locus","CD34","BFU","CFU","Pro","Cluster"];

	//newdata = data.map(function(x,i) { return new genefpkm(x[0],x[6],[ +x[9],+x[13],+x[17],+x[21]],genenames[i][2])});
    newdata = data.map(function(x,i) { return new genefpkm(x[0],x[6],getGeneFpkm(x,dataset.Samples.length),genenames[i][2])});

	data = [];
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

function getGeneFpkm(row,numSamples) {
    var fpkm=[];
    for (i=0;i<numSamples;i++) {
        pos = 9+4*i;
        fpkm.push(+row[pos]);
    }
    return fpkm;
}

loadDataSet(jsontest[0]);

function removeDataset(dataindex) {
    jsontest.splice(dataindex,1);
    saveConfig();
    loadconfig();
}

function clickLoad() {
    var file = document.getElementById("file1").value;
    console.log("clicked load");
    file = file.substring(0,file.lastIndexOf("\\")+1);
    loadDataSetFolder(file);
    loadconfig();
}

function loadDataSetFolder(path) {
    console.log("loading data "+path);
    var samples = readgroupinfo(path+"read_groups.info");
    console.log(samples);
    samples = [].map.call(samples,function(x) { return x.name; });

    var newdataset = {};

    newdataset.name = "New Data";
    newdataset.description = "Description";

    newdataset.files = {};
    newdataset.files.fpkm = path+"genes.fpkm_tracking";
    newdataset.files.ann = "C:/John/NodeDev/CD34-Pro-Data/genenames2.txt";
    newdataset.files.iso = path+"isoforms.fpkm_tracking";
    newdataset.files.diff = path+"gene_exp.diff";

    newdataset.Annotation = "Human";
    newdataset.Samples = samples;

    console.log(JSON.stringify(newdataset));

    newdataset = new dataset(newdataset);
    jsontest.push(newdataset);

    saveConfig();
    //cuffdifffiles(path);
}

function cuffdifffiles(path) {
    var files = fs.readdirSync(path);

    for(i=0;i<files.length;i++) {
        var fileext=files[i].substring(files[i].lastIndexOf("."),files[i].length);
        if (fileext==".fpkm_tracking" || fileext==".count_tracking" || fileext==".info" || fileext==".read_group_tracking" || fileext==".diff") {
            //console.log("fpkm track");
            console.log(files[i]+" "+files[i].length+" "+fileext);
            var filepath = path+files[i];
            var filefd =  fs.openSync(filepath,'r');
            //var myline=fs.read(filefd, 100);

            var colnames="";
            var filebuflen = 100;
            do {
                var filebuf = new Buffer(filebuflen);
                fs.readSync(filefd, filebuf, 0, filebuflen, 0);
                colnames = filebuf.toString();
                filebuflen+=100;
            }
            while (colnames.indexOf("\n") < 0);
            colnames = colnames.substring(0,colnames.indexOf("\n"));

            console.log("*** "+filebuflen);
            console.log(colnames.split("\t"));
        }
    }
}

function readgroupinfo(path) {
    var contents = fs.readFileSync(path, 'utf-8');
    var readinfo = [];
    readinfo = d3.tsv.parseRows(contents);
    readinfo.shift();
    var samples = [].map.call(readinfo,function(x) { return x[1]; });
    var repnumber = [].map.call(readinfo,function(x) { return x[2]; });
    var samplefiles = [].map.call(readinfo,function(x) { return x[0]; });

    var conditions = [];
    conditions.push(new sample(samples[0]));
    conditions[0].replicates.push(new replicate(repnumber[0],samplefiles[0]));
    for (i=1;i<samples.length;i++) {
        if (samples[i]!=conditions[conditions.length-1].name) {
            conditions.push(new sample(samples[i]));
            conditions[conditions.length-1].replicates.push(new replicate(repnumber[i],samplefiles[i]));
        } else {
            conditions[conditions.length-1].replicates.push(new replicate(repnumber[i],samplefiles[i]));
        }
    }
    return conditions;
}

function sample(samplename) {
    this.name=samplename;
    this.replicates=[];
}

function replicate(replicateNum,file) {
    this.number=replicateNum;
    this.file=file;
}

function dataset(mydataset) {
    this.name = mydataset.name;
    this.description = mydataset.description;
    this.files = mydataset.files;
    this.Annotation = mydataset.Annotation;
    this.Samples = mydataset.Samples;
}