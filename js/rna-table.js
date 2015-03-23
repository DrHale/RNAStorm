/**
 * Created by jhale on 2/20/2015.
 */


function tableScroll(dir) {
    var genePos = document.getElementById('minGene');
    var currentPos = parseInt(genePos.value);
    if (dir==0) {
        currentPos++;
        genePos.value=currentPos;
        //console.log("Scroll Down");
        clickDisplay();
    }
    if (dir==1) {
        currentPos--;
        genePos.value=currentPos;
        //console.log("Scroll Up");
        clickDisplay();
    }
}

function clickDisplay() {

    var genePos = document.getElementById('minGene');
    var currentPos = parseInt(genePos.value);
    var displayset = [];
    if (currentPos<0) {
        currentPos=0;
    }

    if(filtered.length>0) {
        if ((currentPos+displayNrows) > filtered.length) {
            if (filtered.length<displayNrows) {
                //console.log("John "+currentPos);
                currentPos=0;
            } else {
                //console.log("Hale "+currentPos);
                currentPos=(filtered.length-displayNrows);
            }
        }
        displayset = filtered.slice(currentPos, currentPos+displayNrows)
    } else {

        if ((currentPos+displayNrows) > newdata.length) {
            if (newdata.length<displayNrows) {
                currentPos=0;
            } else {
                currentPos=(newdata.length-displayNrows);
            }
        }
        displayset = newdata.slice(currentPos, currentPos+displayNrows);
    }

    genePos.value = currentPos;

   addTable(displayset);




}

function clickPlotGene(e) {
    //console.log(e.currentTarget.dataset.gene);
    //addChart(e.currentTarget.dataset.gene,loadedDataset);
    addChart(e,loadedDataset);
}

function clickSearchGene(e) {
    var genelink = "http://www.genecards.org/cgi-bin/carddisp.pl?gene="+e;
    gui.Window.get(
        window.open(genelink)
    )
}

function tableScroller(event) {
    if (event.wheelDelta>0) {
        tableScroll(1);
    }
    if (event.wheelDelta<0) {
        tableScroll(0);
    }
    //event.stopPropagation();
}

function getConFpkm(fpkm,indexes) {
    //console.log("here 2");
    var retfpkm = [];
    for (k=0; k<indexes.length; k++) {
        retfpkm.push(fpkm[indexes[k]]);
    }
    return retfpkm;
}

function addTable(datacontent) {
    var colorPal = ['#3366cc','#f04040'];
    $("#example1").empty();
    window.gc();
    var tablediv = d3.select("#example1");

    var table = tablediv.append("table");
    var thead = table.append("thead");
    //var tfoot = table.append("tfoot");
    var tbody = table.append("tbody");

    table.attr("class","table table-condensed");

    var tr = thead.append("tr");
    tr.append("th").text("Symbol");
    tr.append("th").text("Profile");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("Gene Name");
    tr.append("th").text("Locus");
/*
    var tr = tfoot.append("tr");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
*/
    for(i=0;i<datacontent.length;i++) {
        //console.log(datacontent.length);
        var d = datacontent[i];
        var tr = tbody.append("tr").datum(d.gene);
        tr.append("td").text(d.gene);

        if(loadedDataset.Conditions.length>1) {
            //console.log("here");
            for (j=0;j<loadedDataset.Conditions[1].length;j++) {

                var s = j*(loadedDataset.Conditions[0].length);
                var e = ((j+1)*loadedDataset.Conditions[0].length);
                var plotfpkm = d.fpkm.slice(s,e);

                var sptext = plotfpkm.toString();
                tr.append("td").append("span").attr("class", "inlinesparkline"+j).text(sptext);
            }
        } else {
            var sptext = d.fpkm.toString();
            tr.append("td").append("span").attr("class", "inlinesparkline").text(sptext);
        }

        tr.append("td")
            .append("button")
            .attr("type","button")
            .on("click",clickPlotGene)
            .attr("class","btn btn-default btn-xs")
            .append("span")
            .attr("class","glyphicon glyphicon-stats");

        tr.append("td")
            .append("button")
            .attr("type","button")
            .on("click",clickSearchGene)
            .attr("class","btn btn-default btn-xs")
            .append("span")
            .attr("class","glyphicon glyphicon-globe");

        tr.append("td").text(d.genename);
        tr.append("td").text(d.locus)

    }

    delete datacontent;

    //Array.isArray(jsontest[0].Conditions[0]) == false only one condition
    //Array.isArray(jsontest[0].Conditions[0]) == true then more than one

    if(loadedDataset.Conditions.length>0) {
        //console.log("here");
        for (j=0;j<loadedDataset.Conditions[1].length;j++) {
            $(".inlinesparkline"+j).sparkline('html', {
                type: 'bar',
                height: '20',
                barWidth: 10,
                disableInteraction:true,
                zeroAxis: false,
                barColor: colorPal[j%2]
            });
        }
    } else {
        $(".inlinesparkline").sparkline('html', {
            type: 'bar',
            height: '20',
            barWidth: 10,
            disableInteraction:true,
            zeroAxis: false
        });
    }
}

function addTable2(datacontent) {
    $("#example1").empty();
    document.getElementById("example1").innerHTML="";
    window.gc();
    var tablediv = document.getElementById("example1");
    var datatable = document.createElement("TABLE");

    datatable.setAttribute("id", "myTable");
    tablediv.appendChild(datatable);

    delete tablediv;

    for (i=1;i<datacontent.length;i++) {
        var d = datacontent[i];
        var y = document.createElement("TR");
        //y.setAttribute("id", "myTr");
        //document.getElementById("myTable").appendChild(y);

        var tdgene = document.createElement("TD");
        var t = document.createTextNode(d.gene);
        tdgene.appendChild(t);
        y.appendChild(tdgene);

        var tdbutton = document.createElement("TD");
        var graphbut = document.createElement("button");
        graphbut.setAttribute("data-gene", d.gene);

        t = document.createTextNode("Graph");
        graphbut.appendChild(t);
        tdbutton.appendChild(graphbut);
        graphbut.addEventListener("click", clickPlotGene, false);
        //graphbut.onclick = function (num) {return function () {pickgene(num,1);};}(d.gene);

        y.appendChild(tdbutton);
        document.getElementById("myTable").appendChild(y);
        //document.getElementById("myTr").appendChild(z);

        delete(t);
        delete(graphbut);
        delete(tdbutton);
        delete(y);
    }

}
