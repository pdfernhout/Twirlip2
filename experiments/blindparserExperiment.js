var parser = require('blindparser');
 
// with no options
parser.parseURL('http://rss.cnn.com/rss/cnn_topstories.rss', function(err, out){
    console.log(JSON.stringify(out, null, 2));
});