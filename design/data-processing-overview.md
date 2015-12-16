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

Another useful book is "The Discipline of Organizing":  
http://disciplineoforganizing.org/

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

## How data gets transformed as it moves through Twirlip

A single Twirlip installation is intended to handle information at a personal,
family-sized, or small-group-sized scale. However, when you 
consider the possibilities of storing a lifetime of information you have received, created, or collected,
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

Key concepts (from {at Helland's "Mulligan Stew" paper above, plus a few more from other sources) include the need to:

* extract data from a tremendous number of sources (including email feeds) into entities/documents/JSON-objects
* track the origin/provenance of data (ideally including through transformations)
* track the licensing of data
* wrap data in hashes and signed envelopes to make tampering harder
* assign reference identity strings to entities (while supporting multiple names, unification, separation/disentangling, and ambiguity)
* transform data from one form to another, including to consolidate or distill/summarize it
* make inferences about data based on its structure or content to support classification and reasoning
* classify incoming or transformed data both automatically and manually by tagging
* build and maintain indexes into the data for specific purposes including to filter and sort the data
* load a subset of data relevant to some purpose into working memory via consulting a pre-calculated index
* support reasoning by humans or algorithms about a subset of the data, with results fed back into the system
* support construction of arbitrary new data
* answer who, what, where, when, why, how, and similar questions about events implied by the data

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

## Specifics about RSS, IRC, and email storage in the first sprint

???

