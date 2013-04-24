// raw flot data for the graphs
// also some "constants"

var PRIMARY_INITIATION= "#CDCD00"       //yellow
var PRIMARY_ELONGATION = "#FF9900";     //orange
var SECONDARY_INITIATION = "#66CC99";   //turquoise
var SECONDARY_ELONGATION = "#006fff";   //blue

var COMPARATIVE_FOLD = "#FF0000";
var NON_COMPARATIVE_FOLD = "#006fff";

var comparativeModelData =[
    [0,9,13,21,25,5,7,-7.5,1,1,2,8],
    [0,27,30,553,556,4,522,-4.4,1,0,-1,37],
    [0,32,37,547,552,6,509,-11,1,0,-1,39],
    [0,39,44,398,403,6,353,-14.6,1,0,-1,61],
    [0,45,47,394,396,3,346,-6.7,1,0,-1,66],
    [0,52,54,357,359,3,302,-4.3,1,0,-1,51],
    [0,56,58,354,356,3,295,-5.5,1,0,-1,44],
    [0,61,63,104,106,3,40,-4,1,0,7,11],
    [0,66,67,102,103,2,34,-2.2,1,0,6,5],
    [0,69,70,98,99,2,27,-2.2,1,0,6,4],
    [0,73,75,95,97,3,19,-4.2,1,0,5,3],
    [0,76,82,87,93,7,4,-9.7,1,1,5,5],
    [0,113,115,312,314,3,196,-4.3,1,0,-1,52],
    [0,122,128,233,239,7,104,-14.6,1,0,-1,33],
    [0,131,132,230,231,2,97,-2.2,1,0,-1,33],
    [0,136,142,221,227,7,78,-12.4,1,0,12,34],
    [0,146,147,175,176,2,27,-3.3,1,0,10,13],
    [0,153,158,163,168,6,4,-9.1,1,1,9,5],
    [0,184,186,191,193,3,4,-4.6,1,1,10,5],
    [0,198,203,214,219,6,10,-10.3,1,0,11,11],
    [0,206,207,212,213,2,4,-3.3,1,1,11,5],
    [0,240,245,281,286,6,35,-11.4,1,0,15,6],
    [0,247,249,275,277,3,25,-5.5,1,0,15,4],
    [0,252,259,267,274,8,7,-14.6,1,1,14,8],
    [0,289,292,308,311,4,15,-7.6,1,0,16,5],
    [0,293,296,301,304,4,4,-5.9,1,1,16,5],
    [0,316,320,333,337,5,12,-9.9,1,1,17,13],
    [0,339,342,347,350,4,4,-7.8,1,1,18,5],
    [0,368,371,390,393,4,18,-7.6,1,0,20,6],
    [0,375,379,384,388,5,4,-8.5,1,1,20,5],
    [0,406,409,433,436,4,23,-4.9,1,0,23,13],
    [0,416,419,424,427,4,4,-6.3,1,1,22,5],
    [0,442,446,488,492,5,41,-12.4,1,0,25,13],
    [0,455,462,470,477,8,7,-11.9,1,1,24,8],
    [0,500,504,541,545,5,36,-11,1,0,28,20],
    [0,511,517,534,540,7,16,-13.4,1,0,27,17],
    [0,521,522,527,528,2,4,-3.4,1,1,27,5],
    [0,567,570,880,883,4,309,-9.1,1,0,-1,37],
    [0,576,580,761,765,5,180,-10.1,1,0,40,12],
    [0,584,586,755,757,3,168,-5.5,1,0,-1,22],
    [0,587,594,645,652,8,50,-11.2,1,0,33,20],
    [0,596,597,643,644,2,45,-2.1,1,0,34,15],
    [0,598,606,632,640,9,25,-14.4,1,0,32,10],
    [0,612,617,623,628,6,5,-13.4,1,1,32,6],
    [0,655,658,748,751,4,89,-6.7,1,0,-1,39],
    [0,659,662,743,746,4,80,-7,1,0,-1,30],
    [0,666,672,734,740,7,61,-17.8,1,0,-1,46],
    [0,677,684,706,713,8,21,-13.4,1,0,36,14],
    [0,688,690,697,699,3,6,-4.8,1,1,35,7],
    [0,725,726,731,732,2,4,-3.4,1,1,37,5],
    [0,769,774,805,810,6,30,-13.4,1,0,41,8],
    [0,778,779,803,804,2,23,-2.5,1,0,41,8],
    [0,783,786,796,799,4,9,-7.5,1,1,40,4],
    [0,821,826,874,879,6,47,-11.6,1,0,44,9],
    [0,827,840,846,859,14,5,-19.8,1,1,43,6],
    [0,861,862,867,868,2,4,-3.4,1,1,44,5],
    [0,884,887,910,913,4,22,-5.7,1,0,46,12],
    [0,894,897,902,905,4,4,-6.3,1,1,46,5],
    [0,921,922,1395,1396,2,472,-2.1,1,0,-1,39],
    [0,923,925,1391,1393,3,465,-3.6,1,0,-1,47],
    [0,927,933,1384,1390,7,450,-17.8,1,0,-1,43],
    [0,935,936,1379,1380,2,442,-2.2,1,0,-1,44],
    [0,938,943,1340,1345,6,396,-10.8,1,0,-1,51],
    [0,946,953,1228,1235,8,274,-14.7,1,0,-1,26],
    [0,954,955,1225,1226,2,269,-2.2,1,0,-1,41],
    [0,960,963,972,975,4,8,-5.7,1,1,49,3],
    [0,984,990,1215,1221,7,224,-15.4,1,0,-1,36],
    [0,997,998,1043,1044,2,44,-2.4,1,0,53,20],
    [0,999,1003,1037,1041,5,33,-10,1,0,53,17],
    [0,1006,1012,1017,1023,7,4,-8.7,1,1,52,5],
    [0,1027,1028,1033,1034,2,4,-3.3,1,1,52,5],
    [0,1046,1048,1209,1211,3,160,-5.4,1,0,-1,38],
    [0,1050,1053,1205,1208,4,151,-5.2,1,0,-1,35],
    [0,1056,1057,1203,1204,2,145,-2.1,1,0,-1,43],
    [0,1058,1060,1197,1199,3,136,-4.6,1,0,-1,34],
    [0,1063,1067,1189,1193,5,121,-9.1,1,0,-1,38],
    [0,1068,1073,1102,1107,6,28,-12.5,1,0,56,6],
    [0,1074,1076,1081,1083,3,4,-2.3,1,1,55,5],
    [0,1086,1089,1096,1099,4,6,-8,1,1,55,7],
    [0,1113,1117,1183,1187,5,65,-6.9,1,0,60,17],
    [0,1118,1124,1149,1155,7,24,-11.7,1,0,58,15],
    [0,1128,1129,1143,1144,2,13,-3.3,1,0,58,4],
    [0,1132,1135,1139,1142,4,3,-8.2,1,1,58,4],
    [0,1158,1159,1177,1178,2,17,-2.1,1,0,59,4],
    [0,1161,1165,1171,1175,5,5,-9.7,1,1,59,6],
    [0,1239,1247,1290,1298,9,42,-16.1,1,0,-1,34],
    [0,1253,1255,1282,1284,3,26,-4.5,1,0,65,18],
    [0,1258,1259,1276,1277,2,16,-3.4,1,0,64,17],
    [0,1263,1265,1270,1272,3,4,-4.5,1,1,64,5],
    [0,1308,1314,1323,1329,7,8,-14.5,1,1,67,9],
    [0,1350,1356,1366,1372,7,9,-12.9,1,1,69,4],
    [0,1404,1405,1496,1497,2,90,-2.4,1,0,-1,47],
    [0,1409,1412,1488,1491,4,75,-7.6,1,0,-1,32],
    [0,1414,1416,1484,1486,3,67,-1.8,1,0,-1,24],
    [0,1419,1430,1470,1481,12,39,-14.3,1,0,75,18],
    [0,1435,1440,1461,1466,6,20,-8.7,1,0,74,11],
    [0,1442,1445,1457,1460,4,11,-6,1,0,73,12],
    [0,1448,1449,1454,1455,2,4,-3.3,1,1,73,5],
    [0,1506,1515,1520,1529,10,4,-18.7,1,1,77,5]
  ];