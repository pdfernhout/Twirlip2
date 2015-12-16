## Deciding how to store data

This has proven harder than expected and has slowed down progress in sprint.

Goals/Constraints:

* Want to have immutable data to make system easier to debug and reason about and less prone to failure.

* Want to support replication of email data across servers as master-to-master like CouchDB.

* Want to have a small number of fairly big (but not too big) server data files to make them easy to backup.
So, do not want lots of little files like one file for each stored data item in lots of nested directories.
But don't want everything in one big file either as makes backups harder.

* Want to be able to check server data into git without conflicts even if multi-user (a tough challenge).

* Retrieving data based on timestamps is problematical given differing clocks and backward moving clocks.

* Want to support indexing of data in application-specific ways for quick access to filtered subsets of data.

My proposed solution:

* Data will be appended to files that will be considered closed to further writing when they exceed 10MB.

* The data files will be called "shards" and will have random file names.
These shards will be stored in one common directory for now, but more scalable (> 10GB databases) could stored in nested subdirectories.
These subdirectories would be named recursively based on the first characters of shard files.

* Each database install will have a current randomly generated shard name as a file to append to, stored in a file somewhere.
This name will not be checked into git. Or perhaps, this name will be generated on each database startup?
Then, even if a project is copied, the shard name will be fresh. May end up with unfilled shards, but that is OK.

* A replication process will consist of getting all the shard names and their current sizes (or perhaps object counts), 
and requesting the missing data.

* Pluggable modules can create sqlite indexes (or other indexes) in a directory whose contents is not checked into git.
When new data is added, code for the indexing/application plugins will be run to bring the indexes up to date.

* Object sizes will be limited to 10MB of text.

* Applications need to treat seeing a duplicate object as an idempotent operation that is OK and changes nothing.

* (Uncertain) JSON will be used to store the objects in flat files (or maybe YAML?)

* Object IDs will be like so for references: pointrel:Type:sha256Hash:length:mimeType 

* Object IDs will be like so for immediate data (typically < 64 bytes): pointrel:Type:#:mimeType:utf8TextWithoutNewLineOrSpaces



