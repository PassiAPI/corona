// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}




// ONLOAD



editcasestoday()
editvaccinationrate()
editvaccinationamount()
editrrate()

laodcaseschart()
loadmutationchart()

editdoses()

casesapi = []
datesapi = []


function editrrate(){
  var r
  $.getJSON("https://api.corona-zahlen.org/germany",
      function(data) {


        r = data;
        // Edit cases today
        document.getElementById("r-rate").innerHTML = ""+r.r.value

      }
  );
}

function editdoses(){
  var doses
  $.getJSON("https://api.corona-zahlen.org/vaccinations",
      function(data) {


        doses = data;
        // Edit cases today
        var amount = doses.data.vaccinated
        var biontech = (doses.data.vaccination.biontech)
        var percentbiontech = ((biontech/amount)*100).toFixed(2)
        document.getElementById("biontechbar").style.width= ""+percentbiontech+"%"
        document.getElementById("biontechtext").innerHTML= percentbiontech+"%"

        var moderna = (doses.data.vaccination.moderna)
        var percentmoderna = ((moderna/amount)*100).toFixed(2)
        document.getElementById("modernabar").style.width= ""+percentmoderna+"%"
        document.getElementById("modernatext").innerHTML= percentmoderna+"%"

        var astra = (doses.data.vaccination.astraZeneca)
        var percentastra = ((astra/amount)*100).toFixed(2)
        document.getElementById("astrabar").style.width= ""+percentastra+"%"
        document.getElementById("astratext").innerHTML= percentastra+"%"

      }
  );
}


function editteststoday(){
  var tests
  $.getJSON("https://api.corona-zahlen.org/germany/history/cases/1",
      function(data) {


        tests = data;
        // Edit cases today
        document.getElementById("tests-today").innerHTML = tests.data[0].tests

      }
  );
}


function editvaccinationrate(){
  var rate
  $.getJSON("https://api.corona-zahlen.org/vaccinations",
      function(data) {


        rate = data;
        ratepercent = (((rate.data.vaccinated)/83000000)*100).toFixed(2)

        // Edit cases today
        document.getElementById("vaccinated").innerHTML = ratepercent + "%"

        document.getElementById("vaccinated-rate").style.width= ""+ratepercent+"%"

      }
  );
}

function editvaccinationamount(){
  var rate
  $.getJSON("https://api.corona-zahlen.org/vaccinations",
      function(data) {


        rate = data;
        ratenumber = rate.data.vaccinated.toLocaleString()

        // Edit cases today
        document.getElementById("vaccinated-amount").innerHTML = ratenumber


      }
  );
}



function editcasestoday(){

  var cases
  $.getJSON("https://api.corona-zahlen.org/germany/",
      function(data) {


        cases = data;
        // Edit cases today
        document.getElementById("cases-today").innerHTML = cases.delta.cases

      }
  );
}

function laodcaseschart(){

  var apidata;
  $.getJSON("https://api.corona-zahlen.org/germany/history/cases/",
      function(data) {




        apidata = data;
        apidatalen = (apidata.data).length
        for (i = apidatalen-60; i < apidatalen; i++) {
          casesapi.push(apidata.data[i].cases)
          datesapi.push((apidata.data[i].date).substring(0,10))
        }
        console.log(casesapi)
        console.log(datesapi)



        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: datesapi,
            datasets: [{
              label: "Fälle",
              lineTension: 0.3,
              backgroundColor: "rgba(78, 115, 223, 0.05)",
              borderColor: "rgba(78, 115, 223, 1)",
              pointRadius: 3,
              pointBackgroundColor: "rgba(78, 115, 223, 1)",
              pointBorderColor: "rgba(78, 115, 223, 1)",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
              data: casesapi,
            }],
          },
          options: {
            maintainAspectRatio: false,
            layout: {
              padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
              }
            },
            scales: {
              xAxes: [{
                time: {
                  unit: 'date'
                },
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  maxTicksLimit: 7
                }
              }],
              yAxes: [{
                ticks: {
                  maxTicksLimit: 5,
                  padding: 10,
                  // Include a dollar sign in the ticks
                  callback: function (value, index, values) {
                    return '' + number_format(value);
                  }
                },
                gridLines: {
                  color: "rgb(234, 236, 244)",
                  zeroLineColor: "rgb(234, 236, 244)",
                  drawBorder: false,
                  borderDash: [2],
                  zeroLineBorderDash: [2]
                }
              }],
            },
            legend: {
              display: false
            },
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              titleMarginBottom: 10,
              titleFontColor: '#6e707e',
              titleFontSize: 14,
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              intersect: false,
              mode: 'index',
              caretPadding: 10,
              callbacks: {
                label: function (tooltipItem, chart) {
                  var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                  return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                }
              }
            }
          }
        });






        // or use your data here by calling yourFunction(data);
      }
  );

}

function loadmutationchart(){

  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["unverändert", "B.1.1.7", "B.1.351"],
      datasets: [{
        data: [6, 93, 1],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });

}








/*

var caseskjson =
[
  {"field1":"1","Kalenderwoche":"Bis einschlie�lich KW49/2020","tests":"30952935","cases":"1283514","Positivenquote (%)":"","Anzahl �bermittelnder Labore":""}
  ,
  {"field1":"2","Kalenderwoche":"50/2020","tests":"1516038","cases":"169520","Positivenquote (%)":"11.181777765465","Anzahl �bermittelnder Labore":"206"}
  ,
  {"field1":"3","Kalenderwoche":"51/2020","tests":"1672033","cases":"188283","Positivenquote (%)":"11.2607227249701","Anzahl �bermittelnder Labore":"212"}
  ,
  {"field1":"4","Kalenderwoche":"52/2020","tests":"1091482","cases":"141461","Positivenquote (%)":"12.9604519359916","Anzahl �bermittelnder Labore":"209"}
  ,
  {"field1":"5","Kalenderwoche":"53/2020","tests":"844502","cases":"129872","Positivenquote (%)":"15.3785307790864","Anzahl �bermittelnder Labore":"204"}
  ,
  {"field1":"6","Kalenderwoche":"1/2021","tests":"1228604","cases":"157569","Positivenquote (%)":"12.8250437081436","Anzahl �bermittelnder Labore":"205"}
  ,
  {"field1":"7","Kalenderwoche":"2/2021","tests":"1185297","cases":"123858","Positivenquote (%)":"10.4495329018803","Anzahl �bermittelnder Labore":"205"}
  ,
  {"field1":"8","Kalenderwoche":"3/2021","tests":"1107202","cases":"109764","Positivenquote (%)":"9.91363816178078","Anzahl �bermittelnder Labore":"205"}
  ,
  {"field1":"9","Kalenderwoche":"4/2021","tests":"1141389","cases":"96366","Positivenquote (%)":"8.44287092305954","Anzahl �bermittelnder Labore":"202"}
  ,
  {"field1":"10","Kalenderwoche":"5/2021","tests":"1092988","cases":"82007","Positivenquote (%)":"7.50301009709164","Anzahl �bermittelnder Labore":"203"}
  ,
  {"field1":"11","Kalenderwoche":"6/2021","tests":"1040260","cases":"67204","Positivenquote (%)":"6.4603079999231","Anzahl �bermittelnder Labore":"201"}
  ,
  {"field1":"12","Kalenderwoche":"Summe","tests":"42872730","cases":"2549418","Positivenquote (%)":"","Anzahl �bermittelnder Labore":""}

]







var casesk = []
var datesk = []

for (i = 1; i < 10; i++) {


  casesk.push(caseskjson[i].cases)
  datesk.push(caseskjson[i].Kalenderwoche)

}


var casesjson = '{ "casesj" : [' +
    '{"field1":"Gesamt","field2":"5980","field3":"5705","field4":"5394","field5":"5703","field6":"5715","field7":"5769","field8":"5730","field9":"5374","field10":"5075","field11":"4727","field12":"4407","field13":"4327","field14":"4309","field15":"4075","field16":"4002","field17":"3830","field18":"3487","field19":"3441","field20":"3417","field21":"3395","field22":"3260","field23":"2887","field24":"2801","field25":"2967","field26":"2962","field27":"2872","field28":"2969","field29":"2775","field30":"2425","field31":"2162","field32":"2158","field33":"2160","field34":"2105","field35":"2130","field36":"2324","field37":"2349","field38":"2421","field39":"2181","field40":"2083","field41":"2053","field42":"2083","field43":"2142","field44":"2065","field45":"2137","field46":"2625","field47":"2876","field48":"3280","field49":"3645","field50":"3899","field51":"3862","field52":"3420","field53":"3277","field54":"3128","field55":"2905","field56":"2904","field57":"2878","field58":"2775","field59":"2756","field60":"2642","field61":"2498","field62":"2402","field63":"2422","field64":"2388","field65":"2339","field66":"2299","field67":"2248","field68":"2203","field69":"2157","field70":"2174","field71":"2274","field72":"2237","field73":"2304","field74":"2464","field75":"2578","field76":"2496","field77":"2614","field78":"2809","field79":"2802","field80":"2843","field81":"3104","field82":"3348","field83":"3233","field84":"3405","field85":"3611","field86":"3773","field87":"3968","field88":"4141","field89":"4233","field90":"4127","field91":"4278","field92":"4641","field93":"4639","field94":"4783","field95":"5077","field96":"5281","field97":"5271","field98":"5407","field99":"5576","field100":"5853","field101":"6189","field102":"6472","field103":"6914","field104":"6837","field105":"7081","field106":"7391","field107":"7711","field108":"7902","field109":"7853","field110":"8498","field111":"8528","field112":"8738","field113":"8458","field114":"8505","field115":"8266","field116":"8211","field117":"8211","field118":"7905","field119":"7952","field120":"7756","field121":"7564","field122":"7255","field123":"7177","field124":"7196","field125":"7352","field126":"7627","field127":"7944","field128":"7810","field129":"8268","field130":"8268","field131":"8397","field132":"8242","field133":"8590","field134":"8606","field135":"9128","field136":"9578","field137":"9960","field138":"10599","field139":"10735","field140":"10905","field141":"11221","field142":"11003","field143":"10982","field144":"10819","field145":"11131","field146":"11150","field147":"11656","field148":"12094","field149":"12065","field150":"12393","field151":"12687","field152":"12954","field153":"13452","field154":"13965","field155":"14803","field156":"15473","field157":"16813","field158":"18437","field159":"20248","field160":"21527","field161":"22832","field162":"24583","field163":"26163","field164":"28327","field165":"30975","field166":"33742","field167":"35698","field168":"37764","field169":"40434","field170":"42689","field171":"46771","field172":"50123","field173":"56866","field174":"62329","field175":"67320","field176":"72320","field177":"77866","field178":"82322","field179":"87215","field180":"92250","field181":"95312","field182":"99873","field183":"103273","field184":"104606","field185":"105442","field186":"107030","field187":"110874","field188":"112786","field189":"115566","field190":"115668","field191":"114881","field192":"115519","field193":"116770","field194":"117549","field195":"118550","field196":"119170","field197":"117596","field198":"115518","field199":"115532","field200":"115585","field201":"117128","field202":"117011","field203":"118988","field204":"117938","field205":"116097","field206":"114596","field207":"113507","field208":"112986","field209":"112724","field210":"115082","field211":"113568","field212":"111468","field213":"111407","field214":"111984","field215":"115121","field216":"117880","field217":"121347","field218":"122177","field219":"123793","field220":"124271","field221":"129741","field222":"135944","field223":"140383","field224":"146451","field225":"144485","field226":"149551","field227":"149060","field228":"153714","field229":"157696","field230":"159835","field231":"163912","field232":"164378","field233":"162256","field234":"163186","field235":"157022","field236":"142003","field237":"134142","field238":"131197","field239":"124095","field240":"117551","field241":"116257","field242":"117974","field243":"117459","field244":"116094","field245":"115894","field246":"112002","field247":"105867","field248":"101319","field249":"113555","field250":"127975","field251":"134879","field252":"138516","field253":"136788","field254":"128873","field255":"125747","field256":"121521","field257":"115800","field258":"113119","field259":"111785","field260":"109365","field261":"102704","field262":"98946","field263":"95908","field264":"93672","field265":"92427","field266":"92457","field267":"89509","field268":"92458","field269":"81627","field270":"78481","field271":"75567","field272":"75030","field273":"75585","field274":"74869","field275":"68955","field276":"67119","field277":"66466","field278":"64326","field279":"62895","field280":"63209","field281":"60577","field282":"56547","field283":"53380","field284":"51696","field285":"50008","field286":"47715","field287":"49018","field288":"48794","field289":"47436","field290":"47525","field291":"47266","field292":"","field293":"","field294":"","field295":"","field296":"","field297":"","field298":"","field299":"","field300":"","field301":"","field302":"","field303":"","field304":"","field305":"","field306":"","field307":"","field308":"","field309":"","field310":""}'
    + ']}';

var datesjson = '{ "datesj" : [' +
    '{"field1":"","field2":"05/06/2020","field3":"05/07/2020","field4":"05/08/2020","field5":"05/09/2020","field6":"05/10/2020","field7":"05/11/2020","field8":"05/12/2020","field9":"05/13/2020","field10":"05/14/2020","field11":"05/15/2020","field12":"05/16/2020","field13":"05/17/2020","field14":"05/18/2020","field15":"05/19/2020","field16":"05/20/2020","field17":"05/21/2020","field18":"05/22/2020","field19":"05/23/2020","field20":"05/24/2020","field21":"05/25/2020","field22":"05/26/2020","field23":"05/27/2020","field24":"05/28/2020","field25":"05/29/2020","field26":"05/30/2020","field27":"05/31/2020","field28":"06/01/2020","field29":"06/02/2020","field30":"06/03/2020","field31":"06/04/2020","field32":"06/05/2020","field33":"06/06/2020","field34":"06/07/2020","field35":"06/08/2020","field36":"06/09/2020","field37":"06/10/2020","field38":"06/11/2020","field39":"06/12/2020","field40":"06/13/2020","field41":"06/14/2020","field42":"06/15/2020","field43":"06/16/2020","field44":"06/17/2020","field45":"06/18/2020","field46":"06/19/2020","field47":"06/20/2020","field48":"06/21/2020","field49":"06/22/2020","field50":"06/23/2020","field51":"06/24/2020","field52":"06/25/2020","field53":"06/26/2020","field54":"06/27/2020","field55":"06/28/2020","field56":"06/29/2020","field57":"06/30/2020","field58":"07/01/2020","field59":"07/02/2020","field60":"07/03/2020","field61":"07/04/2020","field62":"07/05/2020","field63":"07/06/2020","field64":"07/07/2020","field65":"07/08/2020","field66":"07/09/2020","field67":"07/10/2020","field68":"07/11/2020","field69":"07/12/2020","field70":"07/13/2020","field71":"07/14/2020","field72":"07/15/2020","field73":"07/16/2020","field74":"07/17/2020","field75":"07/18/2020","field76":"07/19/2020","field77":"07/20/2020","field78":"07/21/2020","field79":"07/22/2020","field80":"07/23/2020","field81":"07/24/2020","field82":"07/25/2020","field83":"07/26/2020","field84":"07/27/2020","field85":"07/28/2020","field86":"07/29/2020","field87":"07/30/2020","field88":"07/31/2020","field89":"08/01/2020","field90":"08/02/2020","field91":"08/03/2020","field92":"08/04/2020","field93":"08/05/2020","field94":"08/06/2020","field95":"08/07/2020","field96":"08/08/2020","field97":"08/09/2020","field98":"08/10/2020","field99":"08/11/2020","field100":"08/12/2020","field101":"08/13/2020","field102":"08/14/2020","field103":"08/15/2020","field104":"08/16/2020","field105":"08/17/2020","field106":"08/18/2020","field107":"08/19/2020","field108":"08/20/2020","field109":"08/21/2020","field110":"08/22/2020","field111":"08/23/2020","field112":"08/24/2020","field113":"08/25/2020","field114":"08/26/2020","field115":"08/27/2020","field116":"08/28/2020","field117":"08/29/2020","field118":"08/30/2020","field119":"08/31/2020","field120":"09/01/2020","field121":"09/02/2020","field122":"09/03/2020","field123":"09/04/2020","field124":"09/05/2020","field125":"09/06/2020","field126":"09/07/2020","field127":"09/08/2020","field128":"09/09/2020","field129":"09/10/2020","field130":"09/11/2020","field131":"09/12/2020","field132":"09/13/2020","field133":"09/14/2020","field134":"09/15/2020","field135":"09/16/2020","field136":"09/17/2020","field137":"09/18/2020","field138":"09/19/2020","field139":"09/20/2020","field140":"09/21/2020","field141":"09/22/2020","field142":"09/23/2020","field143":"09/24/2020","field144":"09/25/2020","field145":"09/26/2020","field146":"09/27/2020","field147":"09/28/2020","field148":"09/29/2020","field149":"09/30/2020","field150":"10/01/2020","field151":"10/02/2020","field152":"10/03/2020","field153":"10/04/2020","field154":"10/05/2020","field155":"10/06/2020","field156":"10/07/2020","field157":"10/08/2020","field158":"10/09/2020","field159":"10/10/2020","field160":"10/11/2020","field161":"10/12/2020","field162":"10/13/2020","field163":"10/14/2020","field164":"10/15/2020","field165":"10/16/2020","field166":"10/17/2020","field167":"10/18/2020","field168":"10/19/2020","field169":"10/20/2020","field170":"10/21/2020","field171":"10/22/2020","field172":"10/23/2020","field173":"10/24/2020","field174":"10/25/2020","field175":"10/26/2020","field176":"10/27/2020","field177":"10/28/2020","field178":"10/29/2020","field179":"10/30/2020","field180":"10/31/2020","field181":"11/01/2020","field182":"11/02/2020","field183":"11/03/2020","field184":"11/04/2020","field185":"11/05/2020","field186":"11/06/2020","field187":"11/07/2020","field188":"11/08/2020","field189":"11/09/2020","field190":"11/10/2020","field191":"11/11/2020","field192":"11/12/2020","field193":"11/13/2020","field194":"11/14/2020","field195":"11/15/2020","field196":"11/16/2020","field197":"11/17/2020","field198":"11/18/2020","field199":"11/19/2020","field200":"11/20/2020","field201":"11/21/2020","field202":"11/22/2020","field203":"11/23/2020","field204":"11/24/2020","field205":"11/25/2020","field206":"11/26/2020","field207":"11/27/2020","field208":"11/28/2020","field209":"11/29/2020","field210":"11/30/2020","field211":"12/01/2020","field212":"12/02/2020","field213":"12/03/2020","field214":"12/04/2020","field215":"12/05/2020","field216":"12/06/2020","field217":"12/07/2020","field218":"12/08/2020","field219":"12/09/2020","field220":"12/10/2020","field221":"12/11/2020","field222":"12/12/2020","field223":"12/13/2020","field224":"12/14/2020","field225":"12/15/2020","field226":"12/16/2020","field227":"12/17/2020","field228":"12/18/2020","field229":"12/19/2020","field230":"12/20/2020","field231":"12/21/2020","field232":"12/22/2020","field233":"12/23/2020","field234":"12/24/2020","field235":"12/25/2020","field236":"12/26/2020","field237":"12/27/2020","field238":"12/28/2020","field239":"12/29/2020","field240":"12/30/2020","field241":"12/31/2020","field242":"01/01/2021","field243":"01/02/2021","field244":"01/03/2021","field245":"01/04/2021","field246":"01/05/2021","field247":"01/06/2021","field248":"01/07/2021","field249":"01/08/2021","field250":"01/09/2021","field251":"01/10/2021","field252":"01/11/2021","field253":"01/12/2021","field254":"01/13/2021","field255":"01/14/2021","field256":"01/15/2021","field257":"01/16/2021","field258":"01/17/2021","field259":"01/18/2021","field260":"01/19/2021","field261":"01/20/2021","field262":"01/21/2021","field263":"01/22/2021","field264":"01/23/2021","field265":"01/24/2021","field266":"01/25/2021","field267":"01/26/2021","field268":"01/27/2021","field269":"01/28/2021","field270":"01/29/2021","field271":"01/30/2021","field272":"01/31/2021","field273":"02/01/2021","field274":"02/02/2021","field275":"02/03/2021","field276":"02/04/2021","field277":"02/05/2021","field278":"02/06/2021","field279":"02/07/2021","field280":"02/08/2021","field281":"02/09/2021","field282":"02/10/2021","field283":"02/11/2021","field284":"02/12/2021","field285":"02/13/2021","field286":"02/14/2021","field287":"02/15/2021","field288":"02/16/2021","field289":"02/17/2021","field290":"02/18/2021","field291":"02/19/2021","field292":"02/20/2021","field293":"02/21/2021","field294":"02/22/2021","field295":"02/23/2021","field296":"02/24/2021","field297":"02/25/2021","field298":"02/26/2021","field299":"02/27/2021","field300":"02/28/2021","field301":"03/01/2021","field302":"03/02/2021","field303":"03/03/2021","field304":"03/04/2021","field305":"03/05/2021","field306":"03/06/2021","field307":"03/07/2021","field308":"03/08/2021","field309":"03/09/2021","field310":"03/10/2021"}'
    + ']}';



var casesparse = JSON.parse(casesjson)
var datesparse = JSON.parse(datesjson)
var casesparse1 = casesparse.casesj[0]
var daresparse1 = datesparse.datesj[0]

var cases = []
var dates = []

for (i = 2; i < 310; i++) {
  stri = "field" + i


  cases.push(casesparse1[stri])
  dates.push(daresparse1[stri])

}

//console.log(dates)
//console.log(cases)


function getdate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return(today);
}

function getcasestoday(){
  var date = getdate()
  var position = dates.indexOf(date)
  return cases[position-1]
}

*/


// Area Chart Example


  /*
  function ReadData(cell, row) {
    var excel = new ActiveXObject("Excel.Application");
    var excel_file = excel.Workbooks.Open("../../data/Fallzahlen.xlsx");
    var excel_sheet = excel.Worksheets("Sheet1");
    var data = excel_sheet.Cells(cell, row).Value;
    document.getElementById('div1').innerText = data;
  }
  */






