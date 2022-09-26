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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.701, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9375, 500, 1500, "https://date.nager.at/Api/v3/NextPublicHolidays/US"], "isController": false}, {"data": [0.975, 500, 1500, "https://date.nager.at/Api/v2/CountryInfo?countryCode=CA"], "isController": false}, {"data": [0.9475, 500, 1500, "https://date.nager.at/Api/v3/CountryInfo/US"], "isController": false}, {"data": [0.8575, 500, 1500, "https://date.nager.at/Api/v3/NextPublicHolidaysWorldwide"], "isController": false}, {"data": [0.9, 500, 1500, "https://date.nager.at/Api/v2/PublicHolidays/2022/CA"], "isController": false}, {"data": [0.6225, 500, 1500, "https://date.nager.at/Api/v3/AvailableCountries"], "isController": false}, {"data": [0.6175, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-4"], "isController": false}, {"data": [0.5625, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-3"], "isController": false}, {"data": [0.7975, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-2"], "isController": false}, {"data": [0.005, 500, 1500, "Test"], "isController": true}, {"data": [0.4675, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-1"], "isController": false}, {"data": [0.7775, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-0"], "isController": false}, {"data": [0.2075, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA"], "isController": false}, {"data": [0.875, 500, 1500, "https://date.nager.at/Api/v2/LongWeekend/2022/US"], "isController": false}, {"data": [0.965, 500, 1500, "https://date.nager.at/Api/v2/LongWeekend/2022/CA"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2800, 0, 0.0, 806.3899999999992, 57, 16725, 218.5, 2201.3000000000006, 3265.899999999996, 8856.99, 129.04415153470367, 4100.744497260692, 74.49563323808646], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://date.nager.at/Api/v3/NextPublicHolidays/US", 200, 0, 0.0, 221.32500000000002, 57, 2316, 67.0, 538.3000000000002, 801.3499999999988, 2220.92, 9.817878356487164, 30.620754534632567, 3.7296432428452215], "isController": false}, {"data": ["https://date.nager.at/Api/v2/CountryInfo?countryCode=CA", 200, 0, 0.0, 161.57499999999985, 57, 4799, 65.0, 425.9, 481.54999999999967, 1275.2900000000025, 11.40966398539563, 10.685027757573165, 4.390046494380741], "isController": false}, {"data": ["https://date.nager.at/Api/v3/CountryInfo/US", 200, 0, 0.0, 225.64000000000001, 57, 4328, 66.0, 436.9, 975.9999999999973, 4276.210000000018, 9.839130220888475, 10.350015527377378, 3.6704567816205045], "isController": false}, {"data": ["https://date.nager.at/Api/v3/NextPublicHolidaysWorldwide", 200, 0, 0.0, 440.24500000000006, 57, 8900, 72.0, 1032.4, 1451.099999999999, 6872.460000000021, 9.818842358485934, 42.640672176469145, 3.7875417300800236], "isController": false}, {"data": ["https://date.nager.at/Api/v2/PublicHolidays/2022/CA", 200, 0, 0.0, 354.47499999999974, 57, 8240, 74.0, 732.6000000000004, 1415.0999999999985, 4406.550000000008, 10.205643720977701, 60.82070318479869, 3.886915089044241], "isController": false}, {"data": ["https://date.nager.at/Api/v3/AvailableCountries", 200, 0, 0.0, 1396.985, 170, 16725, 500.5, 4366.400000000004, 5465.099999999999, 12163.37000000002, 9.582674524459778, 47.28291873293087, 3.612219107853002], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-4", 200, 0, 0.0, 1128.06, 58, 11883, 659.5, 2396.5000000000005, 3699.049999999994, 8854.69, 9.79431929480901, 70.2252693437806, 4.925853942213516], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-3", 200, 0, 0.0, 1371.1750000000002, 59, 12966, 754.5, 3155.1000000000013, 4719.449999999999, 9514.410000000002, 9.852216748768473, 207.20808959359604, 4.954972290640394], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-2", 200, 0, 0.0, 687.2649999999999, 57, 12485, 231.0, 1454.1000000000001, 2237.2999999999997, 12287.580000000047, 9.797677950325772, 11.345117847695096, 5.023223558516632], "isController": false}, {"data": ["Test", 200, 0, 0.0, 6226.025000000002, 1171, 17535, 5564.0, 10763.5, 12299.199999999997, 14261.94, 9.1453655859893, 2140.003892138987, 50.84430300882528], "isController": true}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-1", 200, 0, 0.0, 1191.7450000000003, 78, 9381, 917.0, 2489.0, 2870.7, 4777.210000000005, 9.784735812133071, 1595.3806778222847, 4.8828125], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-0", 200, 0, 0.0, 685.1899999999999, 58, 8857, 294.0, 1368.3000000000002, 2716.649999999996, 8697.64, 9.784735812133071, 180.85693837145303, 4.940144936399217], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA", 200, 0, 0.0, 2955.145000000001, 240, 13652, 1992.5, 6665.100000000001, 9414.549999999997, 13339.400000000005, 9.69227041434456, 2044.0130353464986, 24.44837351587109], "isController": false}, {"data": ["https://date.nager.at/Api/v2/LongWeekend/2022/US", 200, 0, 0.0, 306.43, 57, 3505, 70.5, 801.1000000000001, 1134.9499999999994, 3387.780000000011, 9.784735812133071, 15.143073095034246, 3.6979421477495107], "isController": false}, {"data": ["https://date.nager.at/Api/v2/LongWeekend/2022/CA", 200, 0, 0.0, 164.205, 57, 2318, 67.0, 427.9, 748.3999999999999, 1819.2200000000053, 11.40966398539563, 13.87761664598665, 4.312050744480575], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
