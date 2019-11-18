function LightenDarkenColor(hex_col, amt) {
    // adjust hex color


    if (hex_col.substring(0,2) == 'rbg') {

        return hex_col;
    } else {


        var useHash = false;
      
        if (hex_col[0] == "#") {
            hex_col = hex_col.slice(1);
            useHash = true;
        }
     
        var num = parseInt(hex_col,16);
     
        var r = (num >> 16) + amt;
     
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;
     
        var b = ((num >> 8) & 0x00FF) + amt;
     
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;
     
        var g = (num & 0x0000FF) + amt;
     
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
     
        return (useHash?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    }
  
}



// function getRandomInt(str, min, max) {


//     function hashCode(s) {
//         for(var i = 0, h = 0; i < s.length; i++)
//             h = Math.imul(31, h) + s.charCodeAt(i) | 0;
//         return h;
//     }

//     // var seed = hashCode(str);
//     // function random() {
//     //     var x = Math.sin(seed++) * 10000;
//     //     return x - Math.floor(x);
//     // }

//     Math.seed = hashCode(str);

//     function randomSeeded(max, min) {
//         max = max || 1;
//         min = min || 0;
     
//         Math.seed = (Math.seed * 9301 + 49297) % 233280;
//         var rnd = Math.seed / 233280;
     
//         return Math.floor((min + rnd * (max - min)));
//     }


//     return randomSeeded(max, min)
// }

var colorSchemes = {}

// TODO: get a darkmode friendly foregeound set of colors...
colorSchemes['flattened'] = [
    '#ED4C67','#F79F1F','#A3CB38','#1289A7',
    '#D980FA','#B53471','#EE5A24','#009432',
    '#0652DD','#9980FA','#833471','#EA2027',
    '#006266','#1B1464','#5758BB','#6F1E51',
    '#FFC312','#C4E538','#12CBC4','#FDA7DF']

colorSchemes['solarized'] = [
    '#b58900','#cb4b16','#dc322f','#d33682',
    '#6c71c4','#268bd2','#2aa198','#859900']

colorSchemes['default_NodeOutline'] = '#586e75'

var currencyColors = {
    'USD': '#ED4C67',
    'GBP': '#D980FA',
    'EUR': '#0652DD',
    'HKD': '#006266'
}

function hashCode (str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }

    scaled_hash = Math.round((Math.abs(hash)/2147483647)*colorSchemes['flattened'].length)

    return (scaled_hash);
}

