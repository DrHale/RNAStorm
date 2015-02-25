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
        var displayset = filtered.slice(currentPos, currentPos+displayNrows);
    } else {

        if ((currentPos+displayNrows) > newdata.length) {
            if (newdata.length<displayNrows) {
                currentPos=0;
            } else {
                currentPos=(newdata.length-displayNrows);
            }
        }
        var displayset = newdata.slice(currentPos, currentPos+displayNrows);
    }

    genePos.value = currentPos;

//var genes = [].map.call(displayset,function(x) { return x.gene; })

    var table = d3.select("#example1").html("").append("table");
    var thead = table.append("thead");
    var tfoot = table.append("tfoot");
    var tbody = table.append("tbody");

    table.attr("class","table table-condensed");

    var tr = thead.append("tr");
    tr.attr("onmousemove","tableScroll(1)");
    tr.append("th").text("Symbol");
    tr.append("th").text("Profile");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("Gene Name");
    tr.append("th").text("Locus");



    var tr = tfoot.append("tr");
    tr.attr("onmousemove","tableScroll(0)");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");
    tr.append("th").text("\u00A0");


    for(i=0;i<displayset.length;i++) {
        var d = displayset[i];
        var tr = tbody.append("tr");
        tr.append("td").text(d.gene);

        var sptext=d.fpkm[0]+','+d.fpkm[1]+','+d.fpkm[2]+','+d.fpkm[3];
        tr.append("td").append("span").attr("class","inlinesparkline").text(sptext);
        tr.append("td").append("button").attr("type","button").attr("class","btn btn-default btn-xs").attr("onclick","pickgene('"+d.gene+"',1)").append("span").attr("class","glyphicon glyphicon-stats");

        tr.append("td").append("button").attr("type","button").attr("class","btn btn-default btn-xs").attr("onclick","pickgene('"+d.gene+"',0)").append("span").attr("class","glyphicon glyphicon-globe");
        tr.append("td").text(d.genename);
        tr.append("td").text(d.locus)

    }

    $(".inlinesparkline").sparkline('html', {
        type: 'bar',
        height: '20',
        barWidth: 10});


}

