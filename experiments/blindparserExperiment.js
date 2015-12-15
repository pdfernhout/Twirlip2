var parser = require('blindparser');
 
// var url = 'http://rss.cnn.com/rss/cnn_topstories.rss';
var url = 'http://portland.craigslist.org/sof/index.rss';

// with no options
parser.parseURL(url, function(err, out){
    console.log(JSON.stringify(out, null, 2));
});