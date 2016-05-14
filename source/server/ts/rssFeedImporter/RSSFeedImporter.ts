import parser = require('blindparser');
 
// var url = 'http://rss.cnn.com/rss/cnn_topstories.rss';
// var url = 'http://portland.craigslist.org/sof/index.rss';
// var url = 'http://static.fsf.org/fsforg/rss/news.xml';

function RSSFeedImporter(store) {
	this.store = store;
}

RSSFeedImporter.prototype.readFeed = function(url) {
	// with no options
	parser.parseURL(url, function(err, out) {
	    console.log(JSON.stringify(out, null, 2));
	});
};

RSSFeedImporter.prototype.storeFeed = function(data) {
	
};

module.exports = RSSFeedImporter;