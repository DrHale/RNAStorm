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
    var displayset = []
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

//var genes = [].map.call(displayset,function(x) { return x.gene; })

    //$("#example1").unbind();
    var table = d3.select("#example1");
        table.selectAll("button").on("click",null);
       // table.selectAll("*").unbind("click");
        table.selectAll("*").remove();
        table.append("table");
    var thead = table.append("thead");
    var tfoot = table.append("tfoot");
    var tbody = table.append("tbody");

    table.attr("class","table table-condensed");

    var tr = thead.append("tr");
    tr.append("th").text("Symbol");
    tr.append("th").text("Profile");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("Gene Name");
    tr.append("th").text("Locus");



    var tr = tfoot.append("tr");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");


    for(i=0;i<displayset.length;i++) {
        //console.log(displayset.length);
        var d = displayset[i];
        var tr = tbody.append("tr");
        tr.append("td").text(d.gene);

        if(loadedDataset.Conditions.length>0) {
            //console.log("here");
            for (j=0;j<loadedDataset.Conditions.length;j++) {
                var plotfpkm = getConFpkm(d.fpkm,loadedDataset.Conditions[j].index);
                var sptext = plotfpkm.toString();
                tr.append("td").append("span").attr("class", "inlinesparkline").text(sptext);
            }
        } else {
            var sptext = d.fpkm.toString();
            tr.append("td").append("span").attr("class", "inlinesparkline").text(sptext);
        }

        var butgraph =  tr.append("td")
            .append("button")
            .attr("type","button");
        butgraph.on('click',function(){pickgene(d.gene,1)});
        butgraph.attr("class","btn btn-default btn-xs")
            .append("span")
            .attr("class","glyphicon glyphicon-stats");

        var butlink =  tr.append("td")
            .append("button")
            .attr("type","button");
        butlink.on('click',function(){pickgene(d.gene,0)});
        butlink.attr("class","btn btn-default btn-xs")
            .append("span")
            .attr("class","glyphicon glyphicon-globe");

        //tr.append("td").append("button").attr("type","button").attr("class","btn btn-default btn-xs").attr("onclick","pickgene('"+d.gene+"',1)").append("span").attr("class","glyphicon glyphicon-stats");

        //tr.append("td").append("button").attr("type","button").attr("class","btn btn-default btn-xs").attr("onclick","pickgene('"+d.gene+"',0)").append("span").attr("class","glyphicon glyphicon-globe");
        tr.append("td").text(d.genename);
        tr.append("td").text(d.locus)

    }

    delete displayset;
    delete table;
    /*
    $(".inlinesparkline").sparkline('html', {
        type: 'bar',
        height: '20',
        barWidth: 10,
        disableInteraction:true,
        zeroAxis: false
    });
*/

}

document.getElementById("example1").addEventListener("mousewheel", tableScroller, false);

function tableScroller(event) {

    if (event.wheelDelta>0) {

        tableScroll(1);
    }
    if (event.wheelDelta<0) {

        tableScroll(0);
    }
    event.stopPropagation();
}

function getConFpkm(fpkm,indexes) {
    //console.log("here 2");
    var retfpkm = [];
    for (k=0; k<indexes.length; k++) {
        retfpkm.push(fpkm[indexes[k]]);
    }
    return retfpkm;
}
