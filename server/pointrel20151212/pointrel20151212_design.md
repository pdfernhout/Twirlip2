## Pointrel Overview

The term "Pointrel" was coined around 1983 by Paul D. Fernhout
when he was an undergraduate at Princeton University
to mean "Pointers and Relations" -- in contrast to "LISP" for "List Processing". 
He much later found "pointrel" is an old term for an engraving tool,
which also seems appropriate for software and standards
to help "engrave" information into digital systems.

The key idea of Pointrel at first was to have reified triples of references
to strings, other triples, and abstract entities. ("Reified" meaning referencable.)
There have been many versions of the Pointrel software since then with variants on that theme.
Each one has a distinguishing date related to when that version was started.

Paul wrote about Pointrel and a related implementation in his 1985 Princeton undergraduate senior thesis work
("Why Intelligence: Object, Evolution, Stability and Model").

A first public release of code (in Python) was on SourceForge in 2000, in part to prevent software patents on it as prior art:
http://sourceforge.net/projects/pointrel/files/pointrel/ 

There are also versions there in Smalltalk and Java.

Other later Pointrel versions are here (mostly in Java, JavaScript, and some with a PHP backend):
https://github.com/pdfernhout

He also has many unreleased versions, especially earlier ones in C.
In the same way that a skilled pianist might play a well-known piece when encountering a new piano,
Paul tends to implement at least a simple version of Pointrel on every new programming language or database he learns.
Paul admires Chuck Moore who does the same with Forth by implementing it on every new CPU he encounters.
There are aspects of Pointrel's simplicity and generality
that have been informed by Paul's early work with Forth on a Commodore VIC (around 1980/1981).

## General trends in Pointrel design over the years

Each new version of Pointrel has generally been to explore some new idea in how to
represent knowledge or structure information.
As IBM Research "Master Inventor" Liam Comerford essentially told Paul (based on TRIZ),
typical engineering involves making tradeoffs, but invention is figuring out how to avoid tradeoffs
in some novel way by deep insight into a problem (or at least recognizing dumb luck).
Many Pointrel versions have involved changing tradeoffs, but behind it all
has remained the hope of converging towards some deep insights to make a simple, reliable,
easy-to-understand, easy-to-use general data store.

General trends in Pointrel design have involved:

* A move from thinking of the Pointrel system as its own Forth-like or SMalltalk-like language to seeing it more as a library, server, or application suite
* A move from a self-contained system with numerical positional IDs as pointers for objects towards federated systems which used UUIDs for objects
* A further move from random UUIDs for strings to hashes (like git, but SHA256)
* An emerging move from random UUIDs and hashes for object pointers to arbitrary ("poetic") descriptors of objects (hash, size, location, contents, timestamp, other)
* Thinking about a return to positional IDs behind the scenes for efficiency in lookup
* A move from single-archive versions to multiple-archive versions
* The addition of extra indexing beyond A/B/C indexes implied by triples
* The move from single local storage to arbitrary synchronized storage backends, including using the network or git
* A move from storing data in binary forms to storing data in human-readable textual forms
* A move from mutable data storage updating internal links (with recovery strategies) towards append-only data storage (with separate mutable indexes in memory or on disk)
* A move from desktop GUIs (wxWindows, Delphi, Morphic/Smalltalk, Swing) to web GUIs (HTML/CSS/JavaScript)
* Adding support for command-line interactions beyond the GUIs (like git)
* A move from being a library to being a server (a move long resisted and still in flux)
* A move from storing triples separately to storing them as a form of string
* A move from triples being of binary strings to triples being UTF-8 strings
* A move from triples being of UTF-8 strings to being of arbitrary JSON objects
* A move from storing type information in objects towards assuming they are all JSON
* A desire to support digital signatures for all content (as yet unrealized)
* Moves back and forth between incremental structure representing time to using timestamps (which may be wrong)
* A move from no transactions to transactions and back to no transaction beyond atomically adding objects.
* A move from multiple files (strings and triples), to a single file, to one file per transaction, to shards.
* A move from having some standard base concepts that were numbered to having concept be strings
* A move from no namespaces for pointers to namespaces to back to no namespaces again
* A move from indexes on disk to indexes in memory back to indexes on disk again
* A move from thinking of pointers as numbers, to UUIDs, to compound strings, to JSON objects
* A push towards ever more simplicity yet ever more functionality

Some of these trends relate to a growing conception of what the software might do, from handling one small project to supporting federated communities with big projects.

## Production use of versions of Pointrel

A Pointrel version was used briefly in the OpenVirgle project to store manufacturing-related data
(around 2008).  
https://github.com/pdfernhout/openvirgle

A Pointrel triple store is use in his Musical Phrases / EvoJazz Android apps (released 2011).  
http://evojazz.com/

A Pointrel triple store is used in NarraFirma (released 2015).  
https://narrafirma.com/

It is Paul's hope that a new Pointrel and more elegantly beautiful Pointrel version will be useful here in Twirlip.

But, yes, this is a thirty-five-year-old but still "bleeding edge" idiosyncratic data storage system. :-)

## Pointrel 20151212 low-level storage design

This section is about storing data objects (stored as Unicode strings) in this version of Pointrel (20151212).

This version of Pointrel is tuned towards having data accessible on disk in a readable mbox-inspired way.
It does not use the mbox format in order to efficiently store a variety of objects, also to have append-only files, and to support synchronization.

For convenience in human readability all stored strings in this version of Pointrel are encoded as UTF-8
using the Unicode character set.
Imported data that is binary or in non-unicode encoding and is desired to be preserved in its original form 
can be wrapped somehow like hexadecimal, base32, or base64 encoding of binary data.

This version of the Pointrel system uses a spinning and weaving metaphor to explain itself, in memory of Fran Mazolli.
Thanks for showing us how to spin/twirl, Fran!

At the conceptual base of Pointrel is the immutable data "fiber" (or object).
These data fibers are "spun" or "twirled" into a "thread" or "yarn" stored in a "skein" (or shard/file).
Skeins themselves are stored in a "basket" (or directory).
Baskets can be stored anywhere they can fit (at any compatible internet service).
Fibers (as segments of spun yarn) from one or more skeins taken from any combination of baskets can be used to weave a "tapestry" (UX display).

However, it does not quite make physical sense to think of plucking fibers from a skein to do weaving.
Another way of seeing this (for a Native American analogy) is that data objects are like immutable beads.
These beads are stored on the threads to make a skein (or string) of beads.
Skeins of beads are stored in baskets.
Beads plucked from one or more strings stored in one or more baskets can be used to create wampum belts.

The immutable objects represented as unicode strings with immutable metadata about the object, its social context, and the storage act.
The metadata can include things like purpose, format, hash, length, content timestamp, committer, 
original author, source, initial license grant, digital signatures, metadata format, metadata version, and metadata timestamp.
At a minimum, metadata should include the length of the data.
Ideally, it should also at a minimum include the hash and the format information needed to decode the string.

Metadata might also include the position of the object in the skein starting with the metadata line,
along with the name of the skein. Such information is always implied in the metadata.

These data objects and their metadata are stored in append-only files ("skeins").

The format of the file is intended to be easy to understand, reliable to write, and quick to load.

Each object + metadata pair has the following format:

    [newline = \n] @@@PCE metadata-length-in-bytes [space] content-length-in-bytes [space] metadata-json [newline]
    content-bytes-in-utf8-maybe-with-newlines [newline]

The purpose of the extra newline at the start is to make reading a corrupted file easier.
Writing it all on one line is also to help make corruption from failed writes easier to recover from.
The leading @@@PCE is for synchronization in case of corruption (not foolproof, but could help).
The purpose of the metadata is to describe the data as to purpose and author and time stored and more.
The purpose of the lengths is to make it quick to read the metadata and then perhaps the data at startup if no caching is done in an indexed database.

So, for example for one object:

    @@@PCE 33 28 {"sha256":"1234...","length":26}
    "Hello, world from Twirlip!"
    
Here is an example of a skein called "test@example.com:123456789.pces" (lengths and hashes not exact):


    @@@PCE 73 28 {"sha256":"1234...","length":28,"format":"application/json"}
    "Hello, world from Twirlip!"
    
    @@@PCE 33 78 {"sha256":"1234...","length":43,"format":"mbox"}
    To: world@example.com
    Subject: Test message
    
    Hello! This is from Twirlip!
    
    @@@PCE 33 35 {"sha256":"1234...","length":35}
    "Hello, world from Twirlip again!"

    @@@PCE 33 33 {"sha256":"1234...","length":33}
    {"hello":"world","more":"there"}
    
    @@@PCE 53 55 {"sha256":"1234...","length":55,"purpose":"triple"}
    {"_type":"triple","a":"hello","b":"there","c":"world"}
   

The default content type is "application/json".

Each skein file has a unique UUID. This can either be a random UUID,
a random UUID prefixed with an authority,
or it can be in some guaranteed unique format (like a "tag" with an authority and sequence).
These names must be file-name friendly.
The best way to create a name from arbitrary text can be to make a SHA-256 hash of it.
In general though, these skein file names are not intended to be meaningful, so random
names are acceptable and even preferred.

Basket names may be any UTF string and they are defined in the context
of a service, so they are intended to be specific locations.
However they will typically be stored 
in directories that have the HSA-256 hash of the arbitrary name.

It is OK to have copies of the same skein stored in more that one basket.

The extension of such skein files is ".pces"  (pronounced "pieces" file) standing for "Pointrel Content Engine Skein".

Each skein file is append-only. Further, these files can only be appended
by the original author in one session. Skeins that are no longer being 
appended to are considered "finished" (as opposed to still being spun).
Ideally, such skein files have an object appended at the end to indicate they are complete.
Services that support replication on unfinished skeins should tell peers the longest time they permit
a skein file to be kept open for appending (spinning) to help synchronization processes know 
skeins that are no longer being appended to because they were last synchronized after
some maximum time window.

Skein files should normally be finished after a certain standard size (such as 16 MB).
However, a final object may be added to a skein that might push it over that limit.
Data objects should not (currently) exceed 16 MB.
Larger objects need to be split into smaller ones, with a coordinating metaobject listing the segments.

A reference to an object in a skein file by position to a data object should thus be unique across the federation
of all Pointrel / Twirlip users -- even on unfinished skeins still being spun/twirled.

A key point here -- it is a major implementation error if two versions of the same skein file
with the same exact name are created that have different data at the same location.
It is however OK to have a copy of a skein that is not finished
and so has missing data at the end. Such unfinished skeins may be in the process of being replicated from
one server to another.

This design is intended to support both federation and master-to-master replication.
Here is how replication could work. A service can request from another service a list of
all its skeins in a particular basket it has access to. The response will include
the length of the skeins. For any skeins it does not already have, it will request
a copy of the entire skein. For any skeins it does have but are shorter,
it will request the remaining data. To speed up the process of exchanging list of skeins,
it can supply a timestamp of the last successful replication and only ask for a list of skeins
that have been modified since that time.

While positions in skeins can be used to point to data, it is expected
that generally SHA-256 hashes will be used to point to data,
or that other query strategies would be used.

It is acceptable to store the same content in different skeins.
It is even acceptable to store the same content more than once in the same skein.
Obviously, duplication of data is generally wasteful of space and is to be discouraged
unless it was for some purpose (like redundancy to ensure data access).

The same content can has different metadata when it is stored additional times.
The Pointrel system will keep copies of all the differing metadata.

It is an major error to store data which has a SHA different than the one in the metadata.
Such a situation should be interpreted as an instance of data corruption.

It is possible to correctly store multiple versions of data with the same SHA though if
there is a SHA conflict from a rare duplication. It is expected most
applications will not be designed to deal with such hash collisions,
but it should be possible in theory to write one which does handle them.
In general, only one result (perhaps the latest) will be return for a SHA collision.

## Pointrel 20151212 triple and pointer design

Arbitrary data can be stored using the above approach.
However, it is expected that most data will be stored as triples.
These triples are stored in objects with a list of one or more triples as transactions.
Each triple has a way to reference it (like a UUID).
The triples consist of pointers to other objects.
These pointers are URIs.
These URIs could be URLs or theory could be Magnet URIs.

To support general referencing, the Pointrel system defines its own URI.
That consists of "pointrel:" followed by a JSON object (with no CRs) which defines the pointer as a sort of query.
Typically these objects include a hash reference to an object, and also include the length and information about the type and format of the object.
Some of this information may be descriptive (like author or timestamp) and not needed
to retrieve the data -- although it may be useful for disambiguation if there are competing results.
These "pointrel:" pointers can also include immediate JSON data for small objects.
Ideally, these JSON objects would be in a variant which does not require quoting keys in order to make them ore human readable.
Other uses of the "pointrel:" namespace may be supported as well, like a format of:
    pointrel:purpose:sha256:length:format:timestamp:author:content...
where each section can be replaced with a "#" if it is omitted.

For example:

    pointrel:Greeting:#:#:text/plain:#:#:Hello,%20world!
    
For human-readable JSON, that would be:

    pointrel:{p:"Greeting",f:"text/plain",c:"Hello, world!"}
    
For now, only the JSON version will be supported:

    pointrel:{"p":"Greeting","f":"text/plain","c":"Hello, world!"}
    
Abstract ideals can also be represented like so (assuming text/plain in unicode is the default):

    pointrel:{"p":"Concept","c":"Democracy"}
    
Or in human-friendly JSON-variant:

    pointrel:{p:"Concept",c:"Democracy"}
    
Or even more concisely (assuming a very custom parser):

    pointrel:{p:Concept,c:Democracy}
    
Where acceptable abbreviations are p = purpose, h = SHA-256 hash, l = length, f = format, t = timestamp, a = author, and c = content.

## Pointrel History

As Paul realized much later, he might have had in his memory a cursory reading of part of William Kent's book "Data & Realty",
perhaps done at an IBM library in 1980, but he is uncertain about that.
However, there is a close similarity to underlying aspects of William Kent's ROSE/STAR model from that book.

An avid fan of sci-fi involving robots (Isaac Asimov, Silent Running, and James P. Hogan, especially),
Paul originally wanted to build friendly AI systems or operating systems for such.
Eventually, he moved more towards an Engelbart/Augment-emphasis on tools to empower individuals
(including himself) to deal with their own data.

Paul talked a lot about Pointrel with his undergraduate advisor, George A. Miller,
who then launched WordNet as Paul was graduating in 1985
and as George was forced to retire as a professor at age 65 under then university regulations. 
WordNet is its own system based on George's understanding of the lexicographic
organization of part of the human mind, and George had previously had talks
with Herbert Simon and Allen Newell about data representation.
WordNet does not involve triples specifically, and WordNet is not a general system like Pointrel.
However, WordNet does focus on semantic relationships between words (which can be modeled as triples);
Before Paul started working with George, George was not writing any specific
representational content or software. He was working towards understanding dictionaries
better in conjunction with graduate students, in particular, one studying Le Petit Robert, a French dictionary).
George's main focus then had been working towards helping kids learn language better or faster using videodisk systems
displaying scenes related to words (like showing a scene of a jungle along with the word "verdant").
George told Paul that he was making WordNet in part
to show people (including him) that a concept network was not enough by itself to do AI.

To be clear, as Paul wrote on the C2 wiki ( http://c2.com/cgi/wiki?PaulFernhout )
Paul does not want to put any claim to George's own unique big picture
on semantic memory or all his hard work over decades to put WordNet together
or all his other connections to people doing AI for decades.
He says George was in general a good person and a good advisor.
His point is more that Paul was an undergrad annoying George for a couple of years
about semantic networks and the Pointrel system at the start,
and so that may have indirectly prodded George to make great stuff in his own unique way.
Wordnet in turn formed the basis of Simpli and then Google AdSense and so in turn spawned
a huge industry (for good or bad).

As Paul also wrote to the Open Virgle List ( http groups.google.com/group/openvirgle/msg/231e63e966e932df )
he does feel his work at least very slightly help inspired Wordnet
in the sense of his enthusiastically talking to George a lot about networks of
concepts for AI he wanted to put on a hard disk for a Commodore PET using
Pointrel triads. That hard disk had eaten a document (a speech for an upcoming trip he thinks) that George was writing in
his office on a deadline. George was going to throw out the hard disk,
he was so mad at it. But Paul asked for the hard disk to play with in the lab instead,
and George let him have it. Paul says that file incident was the probably the only
time Paul heard George swear. Paul says the actual specific WordNet idea and all the hard
work collecting words and their relations and the psycholinguistic design behind WordNet is all George's though.

But that experience is one reason Paul previously wrote to on young people bringing an enthusiasm and energy
and playfully experiment that people (including him) can lose with aging technical conservatism.
As he wrote, being around young people can be inspiring in many ways that are not
"plagiarism". Young people bring a hopefulness which can be infectious --
even if in retrospect Paul says his plan to build a human level AI using a Commodore
PET and an unreliable 10MB hard disk was absurd. George's brilliance lay in
maybe later thinking, "What AI-ish thing can I build with all I know and the
tools at hand?" He may well have done WordNet whether he had met Paul in his
enthusiastic unreasonableness or not. Still, as an older Paul wrote,
it is often the annoying seemingly ignorant questions of youth that make us old geezers think. :-)

One idea Paul got from George, beside much other good advice on life and psychology,
was the notion of "free and open source". Paul has previously made money before Princeton
writing a computer game for the Commodore VIC (which helped pay for Princeton).
George went to great effort to get Princeton University to approve broad distribution
of WordNet for free in a way that others could make derived works from it.
That showed Paul another way to
distribute ideas and technology besides commercial sales -- as free and open source content and software.
George did not believe people should make their academic work proprietary and secret.
That was very different than some other professors who turned their work into proprietary companies.
George made a tremendous gift to the world
-- a gift started by a sixty-five year old professor who then spent the next two decades
or so working tirelessly on the project with his beloved wife Kitty, adding one word at a time.
Beyond they gift that included WordNet itself, he gave the gift of
showing others how open source could be done in academia even with the Bayh–Dole Act making possible rent-seeking by universities.
He also gave the gift of showing what was possible when you were "old" and forced to retire.
WordNet has changed the landscape of the computer science field and industry.
George's work on WordNet was funded by the intelligence community.
His early work on communication had been funded by the Air Force.

So, the underpinnings of Twirlip go back decades, before Google (Big Table itself
is analogous to the Pointrel triplestore in some ways with row, column, and value mapping onto a timestamped triple), 
and also before WordNet, all the way back to Pointrel.

Pointrel was originally meant to be data storage, a language, and applications.
However, Paul abandoned the idea of writing his own language at some point in the 1990s.
He still likes programming language design, and even wrote a version
of Smalltalk that used triples to represent object data. But with the rise of Python,
Squeak, and now JavaScript, it seems the world does not especially need or accept
new languages. Good libraries for existing seem to get better broader adoption.

When Linus Torvalds announced he wanted a new version control system,
Paul thought about proposing Pointrel. He has versions that used an ENVY-like
approach to store versioned files. He also has an idea for interlinked chains
of additions of triple to a store forming version trees. But with a young kid at the time
and other distractions, he never proposed that. And git itself is great for
what it does (ignoring some UI issues) -- but git is not fully general in the
way a triple store could be. Still, recognizing the value of git in practice,
Paul has spent some time thinking about how to make a git-friendly versions of Pointrel.
At first he though of using the low-level git structures and wrote Java code to do that.
But, then he focused on creating approaches where files with unique names written atomically
into a directory hierarchy could be shared via git.
His latest idea is the "sharding" concept where uniquely names files containing
multiple data objects would form an archive that can be checked into git without merge conflicts.
Other ideas from git use in practice like command-line integration have been informing new approaches for Pointrel.

Twirlip is what he now calls the set of applications meant to run on top of the Pointrel system.
Paul has struggled at the edges of the computer scene for decades (funded by unrelated work)
to bring that assemblage into being (while also doing other important-seeming personal projects
related to educational, constructivist, communications, and sensemaking software).

Paul also watched the rise of RDF, SPARQL, and triple stores in the 2000s, and then the NoSQL movement.
So in that sense, Pointrel as a semantic triplestore has been both affirmed and passed by.

But, as above, it is possible the Pointrel ideas are linked to William Kent's prior work,
which Paul only rediscovered much later by chance seeing Kent's book 
(perhaps not for the first time) in the Iowa State University library in the mid 1990s.
Paul later corresponded with William Kent in the mid-2000s about data storage ideas, but by then
Bill had moved on to other interests (like nature photography and broader writing) after what he called a nervous breakdown.
Such breakdowns are probably always a risk when you spend a lot of time thinking hard about the nature of "Data and Reality". :-)
Paul also learned about other Entity-Attribute-Value stores, like one by IBM and one in MUMPS.
So, he can't claim those ideas are really "new". As his wife says,
great ideas are like whales, you may be lucky to swim alongside one for a time,
but eventually it swims off on its own.

It is very rare that any idea stands alone. They are in general all interconnected in chains of history,
including in feedback loops. And defining interconnections via relationships is part of what Pointrel is about.
The other part is pointing out things that already exist (another part of what Pointrel is about),
or more generally, as a form of poetry, pointing at things that could (in theory) exist, even if just in the imagination.
