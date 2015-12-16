## Background context for this design

All data stored in Twirlip is intended to be immutable.
For reasons why, see Pat Helland's paper on immutability:  
http://highscalability.com/blog/2015/1/26/paper-immutability-changes-everything-by-pat-helland.html

Beyond experiments with semantic triples over decades for Pointrel, this design is also informed by Pat Helland's other paper on making "Mulligan Stew" from heterogeneous data:  
http://cacm.acm.org/magazines/2011/6/108666-if-you-have-too-much-data-then-good-enough-is-good-enough/fulltext

Other background reading includes William Kent's "Data and Reality" on how the map is not the territory:  
http://www.bkent.net/Doc/darxrp.htm

And from Design & Memory: Computer Programming in the 20th Century" by Peter H. Huyck & Nellie W. Kremenak:

1. Language is a part of nature.
2. Language may be hosted in digital storage.
3. Programming is supposed to make digital storage useful.

Other background is Vannevar Bush's "As We May Think" and Doug Engelbart's Augment / Bootstrap / UnrevII projects. 
Another useful book is "The Discipline of Organizing":  
http://disciplineoforganizing.org/

Another related book is "The Open Source Everything Manifesto" by Robert Steele:  
http://www.phibetaiota.net/2014/05/robert-steele-at-libtechnyc-the-open-source-everything-manifesto/

Another touchstone is the failed Chandler project
(with the hopes Twirlip succeeds, even as it faces many of the same risks).
As Kyle Wilson wrote in [Software Is Hard](http://gamearchitect.net/Articles/SoftwareIsHard.html):
> "But the nature of software is that the problems are always different.
> You never have to solve the exact problem that someone's solved before,
> because if software already existed that solved your need, you wouldn't have to write it.
> Writing software is expensive. Copying software is cheap.
> Scott Rosenberg coins this as Rosenberg's Law:
> Software is easy to make, except when you want it to do something new.
> The corollary is, The only software that's worth making is software that does something new."

And of course, there is the original "ThunderbirdS Are Grow!" manifesto about this project specifically:    
http://www.pdfernhout.net/thunderbirds-are-grow-manifesto.html

## How data gets transformed as it moves through Twirlip

A single Twirlip installation is intended to handle information at a personal,
family-sized, or small-group-sized scale, providing a unified communications interface
that supports composition, archiving, inter-linking, annotation, transformation, rebroadcast, and searching.
However, when you consider the possibilities
of storing a lifetime of information you have received, created, or collected,
including frequent photographs or even continuous audio and video as "life blogging",
and also perhaps including perhaps copies of every web page you've visited if you are so inclined,
this eventually approaches a "big data" situation by current standards.

For even lesser situations, personal data demands can be large.
For example, the original author (Paul Fernhout), currently has about a million email messages
in Thunderbird received over the past decade or so
(including unread-but-searchable messages from being on mailing lists),
and about 20,000 sent emails. This is approaching ten gigabytes of data just for email.

So, any interface and support architecture for Twirlip needs to start from
the assumption of handling millions, possibly billions, of messages,
totaling in size eventually in the terabytes (or even more).

Twirlip installations are also hoped to support federation in the future,
which implies globally unique IDs. That also implies an association of Twirlip app users
might collectively hold many petabytes or even exabytes of information,
and so collective processes need to scale at that level.

While the initial emphasis is on supporting email handling (as a next-generation Thunderbird),
as a general messaging and archiving platform,
Twirlip is intended to handle all sorts of messages (RSS, IRC, Jabber, SMS, third-party)
as well as handle all sorts of notes, images, audio, video, and data from collaborative real-time applications like white boards or structured arguments.

Key activities in Twirlip include the need to:

* ingest data from a tremendous number of sources (especially email feeds, but anywhere), often parsing it into entities/documents/JSON-objects, and storing the results somewhere
* track the origin/provenance of data (ideally including through transformations)
* track the licensing of data
* wrap data in hashes and signed envelopes to make tampering harder
* assign reference identity strings to entities (while supporting multiple names, unification, separation/disentangling, and ambiguity)
* classify incoming or transformed data both automatically and manually by tagging
* make inferences about data based on its structure or content to support classification and reasoning
* build and maintain indexes into the data for specific purposes including to filter and sort the data
* transform stored data from one form to another, including to consolidate, normalize, and/or distill/summarize it
* load a subset of data relevant to some purpose into working memory via consulting a pre-calculated index
* support processing (including reasoning) by humans or algorithms involving a subset of the data, with results fed back into the system
* answer who, what, where, when, why, how, and similar questions about events implied by the data
* support construction of arbitrary new data
* support broadcasting new messages or forwarding existing ones by sending or storing them through other services.

These activities are drawn from Helland's "Mulligan Stew" paper above,
plus a few more from other sources. The above is in a very rough typical time order
cycling through ingest, parse, store, wrap, classify/infer, index, transform, load,
process, query, create.
However the stages could happen in any order depending on user needs and priorities.

Examples of specific transformations could include:

* visualizing data (transforming it from text to an image for human review)
* reading images (transforming an image to text)
* translating text from one language to another
* preparing summary or advisory reports from a variety of data

Some practical architectural constraints include:
* support short-term stores and long-term stores (like for discarding spam kept only in a short-term store) 
* support incremental and full backup
* support replication of a selected part of the system with another system (may be a backup as well)
* support checking everything into git to use for collaboration on small-scale projects
* support plugins to add new functionality in any of the key activity areas.

On plugin security: Because of reasons discussed at the link below by Firefox developers complaining about Mozilla's moves
to lock down Firefox, modular security will not be an initial emphasis when supporting
plugins. The assumption will be that community processes will help ensure the integrity of plugins (as with Node.js/NPM).
Still, at some point plugins could perhaps
be done with a mix of what Eclipse does (warn for unsigned content and ask for agreement with a license)
and a mix of the very latest for mobile phones (request fine-grained permissions,
perhaps even as an plugin tries to do something for the first time).
But all that remains for the future.
https://blog.mozilla.org/addons/2015/08/21/the-future-of-developing-firefox-add-ons/

## Specifics about RSS, IRC, and email storage in the first sprint

The first sprint intends to support (in a crude way), RSS, IRC, and email, as well as annotations/notes on them.
RSS, IRC, and email have a commonality in that all three involve handling messages.
Potentially, these messages could be either sent or received.
That is obvious for email or IRC, but for RSS specifically, you might have your own feeds you write as well as ones you read.
Notes and annotations also are messages of a sort -- messages to your future self, and also possibly drafts of parts of future messages to others.
Also, in general, drafts need to be supported when composing emails,
a capacity that often gets pressed into service for storing local data in email systems.

As in the key activities section, Twirlip cycles through ingest, parse, store, wrap, classify/infer, index, transform, load,
process, query, create activities. These stages could all apply to messages of any type.

So, a first step is to ingest messages (into temporary memory or directly into long-term storage).
Then they are parsed, likely labelled with a unique identity, possibly wrapped with contextual information, and transformed into a common normalized form that is stored long-term.
And index is maintained on key items of interest needed to support a user interface,
like a GUI where users can select/filter a subset of messages and sort them on fields like
from, to, original source, timestamps, titles, and added metadata like adding a star, tag, field/value, or free form annotation.
Draft messages (or notes) can be made as new "memo to self" messages and tagged as such for later transformation/editing and then possible broadcast/sending.

