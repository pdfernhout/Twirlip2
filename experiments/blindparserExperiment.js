var parser = require('blindparser');
 
// var url = 'http://rss.cnn.com/rss/cnn_topstories.rss';
// var url = 'http://portland.craigslist.org/sof/index.rss';
var url = 'http://static.fsf.org/fsforg/rss/news.xml';

// with no options
parser.parseURL(url, function(err, out){
    console.log(JSON.stringify(out, null, 2));
});