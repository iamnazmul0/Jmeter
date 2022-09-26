/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9333333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://date.nager.at/Api/v3/NextPublicHolidays/US"], "isController": false}, {"data": [1.0, 500, 1500, "https://date.nager.at/Api/v2/CountryInfo?countryCode=CA"], "isController": false}, {"data": [1.0, 500, 1500, "https://date.nager.at/Api/v3/CountryInfo/US"], "isController": false}, {"data": [1.0, 500, 1500, "https://date.nager.at/Api/v3/NextPublicHolidaysWorldwide"], "isController": false}, {"data": [0.995, 500, 1500, "https://date.nager.at/Api/v2/PublicHolidays/2022/CA"], "isController": false}, {"data": [0.955, 500, 1500, "https://date.nager.at/Api/v3/AvailableCountries"], "isController": false}, {"data": [0.935, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-4"], "isController": false}, {"data": [0.915, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-3"], "isController": false}, {"data": [0.965, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-2"], "isController": false}, {"data": [0.405, 500, 1500, "Test"], "isController": true}, {"data": [0.945, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-1"], "isController": false}, {"data": [0.995, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-0"], "isController": false}, {"data": [0.89, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA"], "isController": false}, {"data": [1.0, 500, 1500, "https://date.nager.at/Api/v2/LongWeekend/2022/US"], "isController": false}, {"data": [1.0, 500, 1500, "https://date.nager.at/Api/v2/LongWeekend/2022/CA"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1400, 0, 0.0, 162.11142857142895, 56, 1940, 71.0, 266.9000000000001, 509.9000000000001, 1225.91, 131.5047905316551, 4178.9776896839185, 75.9161304715386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://date.nager.at/Api/v3/NextPublicHolidays/US", 100, 0, 0.0, 78.77000000000002, 58, 499, 64.0, 78.70000000000002, 131.74999999999994, 498.3999999999997, 11.13213848380274, 34.71118188522765, 4.22890807636647], "isController": false}, {"data": ["https://date.nager.at/Api/v2/CountryInfo?countryCode=CA", 100, 0, 0.0, 85.48999999999997, 56, 446, 64.0, 82.9, 416.9999999999966, 445.96999999999997, 12.613521695257315, 11.810395118567104, 4.85324955852674], "isController": false}, {"data": ["https://date.nager.at/Api/v3/CountryInfo/US", 100, 0, 0.0, 65.17000000000002, 57, 151, 63.0, 72.0, 76.89999999999998, 150.83999999999992, 11.13213848380274, 11.711140139708338, 4.1528094734498495], "isController": false}, {"data": ["https://date.nager.at/Api/v3/NextPublicHolidaysWorldwide", 100, 0, 0.0, 64.55000000000001, 58, 96, 62.0, 76.80000000000001, 81.0, 96.0, 11.137097672346586, 48.355233391803104, 4.296048418532131], "isController": false}, {"data": ["https://date.nager.at/Api/v2/PublicHolidays/2022/CA", 100, 0, 0.0, 83.21, 58, 534, 64.0, 96.60000000000002, 140.5999999999999, 533.1299999999995, 12.640626975097964, 75.33714922260144, 4.814301289343952], "isController": false}, {"data": ["https://date.nager.at/Api/v3/AvailableCountries", 100, 0, 0.0, 247.68000000000004, 167, 1148, 184.0, 437.3000000000005, 842.0999999999989, 1146.4899999999993, 10.080645161290322, 49.737155052923384, 3.799930695564516], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-4", 100, 0, 0.0, 265.0199999999999, 58, 1696, 177.0, 706.1000000000003, 1201.4499999999998, 1691.2999999999975, 11.205737337516808, 80.35170257171673, 5.635697977364411], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-3", 100, 0, 0.0, 287.46999999999986, 61, 1771, 181.0, 692.0000000000005, 1197.4499999999998, 1768.6599999999987, 11.340440009072353, 238.50684058885236, 5.703443949875256], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-2", 100, 0, 0.0, 181.21999999999994, 57, 866, 174.0, 248.80000000000013, 611.0499999999993, 864.019999999999, 11.19444755401321, 12.96719327213702, 5.739340786969663], "isController": false}, {"data": ["Test", 100, 0, 0.0, 1218.0699999999995, 853, 3448, 923.0, 2335.500000000002, 2730.0999999999976, 3445.1699999999987, 9.272137227630969, 2169.691520340751, 51.54909886416319], "isController": true}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-1", 100, 0, 0.0, 244.10000000000002, 72, 1196, 194.0, 507.5, 715.0, 1192.2499999999982, 11.1781801922647, 1822.580884613235, 5.578173904538342], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-0", 100, 0, 0.0, 73.68000000000004, 58, 502, 64.0, 82.50000000000003, 101.44999999999987, 498.94999999999845, 11.134617525887986, 205.81416236360093, 5.621677012582118], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA", 100, 0, 0.0, 454.33000000000004, 241, 1940, 270.5, 1238.3000000000006, 1462.1999999999996, 1939.3199999999997, 10.893246187363834, 2297.3064746732025, 27.47778799019608], "isController": false}, {"data": ["https://date.nager.at/Api/v2/LongWeekend/2022/US", 100, 0, 0.0, 66.71999999999998, 57, 130, 63.0, 78.0, 85.89999999999998, 129.96999999999997, 11.134617525887986, 17.248653407192965, 4.208102521990869], "isController": false}, {"data": ["https://date.nager.at/Api/v2/LongWeekend/2022/CA", 100, 0, 0.0, 72.15, 58, 442, 62.5, 72.0, 84.74999999999994, 440.45999999999924, 12.645422357106728, 15.393084929817904, 4.779080519726858], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
