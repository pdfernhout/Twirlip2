Pointrel20160516

Based on the idea that triplestores could be cheap to make and use as "documents".
Also, some of those triplestores link to each other as a directory tree.
Trying to address issue of performance when too much daat in one store.
Also, may not want to download a picture or video from a server right away.
Want to get metadata first and linking data and context and choose how to use bandwidth.

Idea that triple store names could include ".metadata" or such to indicate they are metadata
about another store. So, you could get contextual information about a big video without downloading it.

Could have on tripelstore per email.
And then have one store for each email folder which says what emails are in it as an index.
Trying to go for modularity of data, while still supporting linking via relationships.

Might have each triple store ID be a JSON object? And store via the hash of it?

Trying for simplicity in this version (again). But many aspects of simplicity.
Maybe no document hash value? 

Questions:
Should transactiosn of triples have a hash as their ID?
Should transactions of triples refer to previous transactions (and by their hashes?)


