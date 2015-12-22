# Twirlip2
A tool for messaging inspired by Thunderbird but implemented as a Node.js webserver and Mithril webapp

## Objective

Here is an ambitious "hard fun" agenda I am pursuing over the next week (starting 2015-12-12) to create a proof-of-concept for a [Thunderbird Server application along the lines of the "ThunderbirdS are Grow!" manifesto](http://pdfernhout.net/thunderbirds-are-grow-manifesto.html). The hope is that by the end of the week the entire system will work well enough to actually be useable directly (if painfully) by a development team to discuss further improvements of that software in a bootstrapping (Engelbart) way. Even if that project goes no further than a one week sprint, it hopefully will be something people could point to here when discussing what might be possible for a more serious project with broad community support.

Because this is not an official Mozilla project, I'm calling it Twirlip and not Thunderbird (not wanting to get into legal trouble with Mozilla for trademark infringement or to cause any confusion with Thunderbird Desktop users). I've used that Twirlip name for previous information management experiments, and I feel it fits this as well, even if the focus is a bit different this time by putting email at the center of things. By coincidence, the "T" in Twirlip can be seen to stand for "Thunderbird". :-) However, the project obviously could be renamed to Thunderbird Server or whatever if the project's status with Mozilla changed down the road (unlikely, but who knows) or with whoever ends up controlling the Thunderbird trademark after a spinoff. 

If I had more time, I'd have involved people on this list in planning this sprint, rather than just forge ahead without substantial discussion. But sometimes you have to "code first and ask questions later" in an agile way, to get good feedback given an all too common "failure of the imagination", right? :-) And hopefully once this system is working at a minimal level of functionality, future sprints could eventually be designed using the software itself in a bootstrapping way, time permitting. :-)

This was originally intended to be a very ambitious one-week sprint, but realistically speaking it is a much longer term project.

## Milestones for Thunderbird Server / Twirlip Proof-Of-Concept (POC)

### Project Planning and Setup

User stories:

* As a project owner, I need an initial project plan to develop a proof-of-concept of a Thunderbird Server to help others imagine what is possible.
* As a project owner, I need a GitHub site so project developers can share code.
* As a developer, I need a basic infrastructure so I can collaborate with others to developers to create and test great software.

Tasks:

* DONE Write up this document.
* DONE Set up GitHub project (https://github.com/pdfernhout/Twirlip2)
* DONE Create initial project package
* DEFER Create initial project build script
* DONE Pick unit testing framework for client (mocha, chai, tsUnit.ts)
* DONE Pick unit testing framework for server (mocha, chai)
* DONE Have Node.js host a webapp that displays "Hello World" or similar [without Mithril]
* DONE Verify the results of the hello world display as a test
* DONE Make initial decision about file format for backend
* DEFER Create code to store immutable data in file system
* DEFER Create initial unit test for server that then stores and retrieves immutable data from the local file system
* BACKLOG Hooking up tests and build script to a continuous integration build server (would be nice, but that CI part is probably not gonna happen this week by me)

### Data Storage Thinking

* DONE Create code to store immutable data in a memory store for testing
* DONE Create initial unit test for server that then stores and retrieves immutable data from the memory store
* DONE Write emails hoping to recruit support from other groups
* DONE Review some discussions of messaging and immutable storage on the web
* DONE Create a design document about the immutable storage needs
* DONE Create a design document about the high-level comprehensive processing needs
* DONE Deal with immediate consequences of 2011 MacbookPro laptop failing by setting up new Eclipse install

Note: The data storage has proved to be a big stumbling block delaying everything as it stretches into Wednesday.
Distractive email sending has slowed coding progress. So has a technical issues with a failed laptop. :-(
Still hoping to catch up to the schedule as far as what day to be able to send an email by Thursday,
but unlikely. So, I'm adjusting the schedule by two days into the next weekend. Sorry about the slippage; as I said at the beginning, this was an ambitious schedule (and beyond what I should be doing myself anyway).

On the plus side, mocha unit testing is working out well and I'm glad I put the time up-front into setting that up.

Of course, I like that data storage part, so no big surprise I'll pay extra attention to it. :-)
Here are notes for [a sharding storage design](design/data-storage-design.md) and [processing overview](design/data-processing-overview.md).
Also, I thought of doing testing with a memory-based store, so the initial focus has been on
that as a test-supporting component rather than disk storage, and there is a good unit test for that. 
I am deferring storing data to the file system until the storage and indexing APIs
(including an in-memory indexer) are worked out better during the next couple of days supporting RSS, IRC, and email UI tasks.
Permanent storage is not even needed for a demo I am realizing, although I still want to demonstrate it during the sprint so it is getting left towards the end.

### Data Storage Implementation

User stories:

* As a developer, I want a way to store data on disk in a way reminiscent of mbox format, so that I can verify its operation
* As a user, I want to be able to look at files and see a readable version of emails I send, so that I can have confidence in the system

* Create a version of the Pointrel data storage system that stores data on disk in a way reminiscent of mbox format
* Create unit tests for the data storage system
* Create documentation for file format

### RSS Feeds

User stories:

* As a user, I want to read project feeds so I can know what is going on with specific projects of interest. 
* As a user, I want to annotate feed information I am reading so I can take further action on it later. 

Tasks:

* Read basic RSS feeds into local storage
* Display feeds in a single-page webapp that uses JSON to retrieve data from Node.js
* Support annotating specific items with text strings
* Support searching for items with specific text strings
* Support searching annotations with specific text strings
* Unit tests for each of the above (ideally written beforehand)

### Chat Client

User stories:

* As a user, I want to chat with other users so I can work  as part of a team.
* As a user, I want to make local notes on what other users chat about so I can take action on them later. 

Tasks:

* Create chat client to post and receive messages from IRC
* Store IRC messages locally
* Support searching an archive of chat messages locally 
* Support annotating chat messages locally with a string (like for further action) 
* Use socket.io for real-time notifications to refresh the webapp GUI
* Unit tests for each of the above (ideally written beforehand)

### Read Thunderbird and Pipermail Archives

User stories:

* As a user, I want to be able to display existing email archives so I can understand what is going on in projects.
* As a user I want to make local notes on prior email discussions so that I can remember thoughts about them, plan actions based on them, or create summaries or outlines. 

Tasks:

* Read existing Thunderbird mbox archives and store them locally
* BACKLOG Read emails from an IMAP account
* Read existing pipermail web archives and store them locally 
* Displaying stored emails in a minimal way
* Support very simple exact text searching through stored emails
* Support annotations for stored emails
* Support overlays on top of existing messages with summaries or outlines or typo fixes
* At a minimum as a test case, the application should be able to read and display the tb-planning email list from pointing it here:
https://mail.mozilla.org/pipermail/tb-planning/
* Unit tests for each of the above (ideally written beforehand)

### Receive POP3 email and send SMTP email

User stories:

* As a user, I want to be able to send and receive plain text emails and display simple HTML emails safely so I can exchange information with other users.
* As a user, I want to be able to use this system alongside an existing Thunderbird Desktop install so that I can feel confident even if this system fails that I can just use Thunderbird Desktop

Tasks:

* Create GUI for adding information about email POP3 accounts
* Read emails from a POP3 account (without deleting them!)
* Provide configuration instructions for Thunderbird users on how to leave POP3 email on the server for a few days after reading so this application can also pick them up (or do the next task)
* BACKLOG Read new emails from an IMAP account
* Make it easy for this system to quickly read new mail from a 
* Support composing new emails in the webapp
* Support saving drafts of new emails without sending them
* Create GUI for defining basic SMTP information
* Send plain text email messages via SMTP
* Make first post to tb-planning sent from the application
* Read new tb-planning post either from a local Thunderbird mbox or by reloading the pipermail archive.
* Unit tests for each of the above (ideally written beforehand)

### Share annotations, wiki pages, and IBIS maps

User stories:

* As a user, I want to be able to send all the annotations I made locally in previous steps to others so they can review and comment on them and send back revisions.
* As a user, I want to create a wiki that other users can read and improve with versioning so we can work together as a team.
* As a user, I want to be able to make, share, and collaboratively edit Issue-Based Information System (IBIS) diagrams so I can work with others to understand complex situations.

Tasks:

* Create a module to send and receive annotations via email messages
* Send and receive email messages defining a triple store
* Create a module to interpret that triple store to define a wiki and send wiki-related triple store messages to support updating the wiki
* Create a mailing list with a pipermail archive (or similar readable archive) for this project which can support wiki interactions
* Put this document into the wiki by sending email about it to the new list
* Create a module to interpret that triple store as an IBIS map (inspired by Compendium) and support editing of it in 2D
* Create screenshots and put them on GitHub
* BACKLOG Implement other plugin modules to support making lists of to do items or user stories (like in this email), creating shared calendars, creating shared address books, using a virtual shared hierarchical file repository, creating and editing free form notes, creating and editing a spreadsheet of numbers and formulas in JavaScript, using 2D whiteboards, using 2D clustering diagrams, and/or sharing 3D objects.
* BACKLOG Support doing the same via IRC and RSS using a common infrastructure if time permits
* Unit tests for each of the above (ideally written beforehand)

The results of all of these tasks will be very crude as far as UX but should be minimally useable for the tasks outlined. Ideally the resulting application should work well enough that current Thunderbird users with POP3 accounts with very basic email needs could switch to it as their primary email client and only use Thunderbird desktop only for more specialized cases (not without some pain and loss of functionality, of course). So, this first week will create a minimal "eat our own dog food" base that could be improved upon by a team using this exact tool over the next year to discuss and plan how to make something really awesome. :-)

## Architecture and other project information

License: MPL 2 for now. I'm open to perhaps changing that to Apache or maybe something else based on feedback if someone made a case for that soon. I don't especially know what is best here, and have tended to use GPL for previous large projects and MIT/BSD for smaller ones. Mozilla says Apache 2 is acceptable for new projects, but still seems to suggest MPL 2 for product code: https://www.mozilla.org/en-US/MPL/license-policy/

Storage: The system will work with immutable stored data when possible for reliability (with copies of archives being made if compaction of deleted data from files is desired, like with Thunderbird currently does). For that reason, the mutable mbox format Thunderbird uses can't be used as-is, because a character in mbox files for each message is changed to indicate flags. A file format that stores data incrementally will be used. This could either be some improvement to mbox to make it immutable but still support flagging items (as as read, deleted, important, etc.). Or, it could be very different as with CouchDB (looks like versioned documents) or recent Pointrel versions (storing JSON for each message that represents a change, either in separate files or in big files or segments of big virtual files). Eventually, to avoid archiving spam, a short-term staging area could be use for incoming messages, where only some get copied to a more permanent long-term archive (a bit like maildir). The storage system should be pluggable, so the initial decision of backend should be changeable. I'm open to using an existing Node.js module for this backend if that makes sense, as long as the data was immutable. But I feel flat files plus sqlite for indexing are probably the best way to go at first.

Webapp: The GUI will be Mithril because I know it and like it and it is simple to pick up and understand. TypeScript will be used for the webapp code. I will borrow from the NarraFirma project which used those technologies as needed (NarraFirma is GPLv2 but I am willing to re-license such tangential borrowings under the project's MPL2 license). The GUI should have pluggable modules eventually. BTW, I explain some reasons why I prefer Mithril over the more well-known React [here](http://buytaert.net/comment/120741#comment-120741).

Server: The server will be Node.js because I know it and like it and it has a lot of basic email handling support. TypeScript will be used eventually on the server, but for this first week sprint, I'll stick with JavaScript on the server. Eventually such server code should ideally run under Firefox directly. The server modules should be pluggable too eventually.

Webapp-to-server communications: As with NarraFirma, all communications (aside from module loading) will be done via JSON to specify what data the webapp wants from the server and for the server to send back a response.

Plugin architecture: Just gonna wing it using JavaScript modules and some adhoc API... :-)

Trademark: Since this project has no official approval, it can't be called Thunderbird Server. So, I'm calling it "Twirlip" because I already have Vernor Vinge's approval from years ago to use that term for information management software -- the term comes from his book "A Fire Upon the Deep". :-) In this context, "Twirlip" could be seen to stand for: "Thunderbird Wholistic Information Resource Linking Integrated Platform". For now, I'm keeping Twirlip as a trademark I control myself. If Mozilla really wanted to support such a project, trademark ownership might be a non-issue as the project would probably then be called Thunderbird, or we could talk about Mozilla controlling the Twirlip trademark if it was used in a way to identify the sort of broad platform I've defined here and elsewhere, such as:
http://pdfernhout.net/thunderbirds-are-grow-manifesto.html

## Why not a more realistic agenda?

This agenda perhaps should realistically be six weeks of work where each day here becomes a week-long sprint involving multiple developers where the whole planning process involves feedback from other developers here and the user community, especially in the creation of user stories. That would make such a project more true to the spirit of Thunderbird and its community of developers an no doubt would go beyond what I can provide myself (even as a long-time Thunderbird user, but one who has mostly avoided plugins and so has a narrower view than some). Not having that time luxury at this point though, I'll still do what I can where I can. While it might otherwise might make sense to spend a full week if I have that on just one of these projects and do it better, without doing every phase of this agenda even in an abbreviated way, the results would not reflect the breadth of the proof-of-concept I have in mind. With a more limited approach, people would then just reasonable say, "oh that is another RSS feed reader", or "oh, that is some poorly done email client", or "oh, yet another IBIS system big whoop", or "I already have a better IRC client", or whatever. It is putting these modules all together into something that aspires to be a "social semantic desktop" that is the essence of the big picture I'm trying to convey. So that is why this first sprint is going to cover a lot of ground but very shallowly.

As one of my heroes, Dan Ingalls, said [about the initial coding of the innovative Smalltalk](https://jaortega.wordpress.com/2006/01/31/dan-ingalls-videos-on-object-oriented-programming/) (in BASIC of all things): "You just do it and it’s done." :-)

This project is an iffy proposition for all sorts of reasons, like if existing Node.js mail handling and IRC libraries are just too buggy, or if I get called away from this project for some reason. I'm still hoping though something usable might be ready in a week.

Even if this specific project accomplishes this agenda, the project may not go anywhere after that limited success though for all sorts of reasons. But even a limited success could still be a useful example for [the Thunderbird Planning group](https://mail.mozilla.org/listinfo/tb-planning) to think about in terms of what a real Thunderbird Server project might look like if Mozilla got behind some future effort. So, I hope this project eventually adds to the discussion here one way or another.

If I don't respond to any emails about this project anytime soon, it will hopefully be because I am busy coding. :-)

ThunderbirdS are grow! :-)
