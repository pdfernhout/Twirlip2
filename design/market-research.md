Taken from my one week progress report. Needs to be rewritten.
Added item on N1 and Slashdot article.  
https://mail.mozilla.org/pipermail/tb-planning/2015-December/004309.html

== Learning

A bunch of time went to learning (sort-of market research), including 
evaluating open source server-based stuff like mailpile, Kolab, and 
Citadel, and watching an hour long video about Kolab and its community 
especially.  
"Kolab Presentation at #FISL15" by Torsten Grote of Kolab Systems  
https://www.youtube.com/watch?v=pVU0y-SKXnE  

Incidentally, Torsten mentioned Thunderbird is not improving and plugged 
KDE's Kontact, sigh.

I also looked at discussions about some other proprietary systems, 
including discussions of Skype vs. Slack. Ideally I would have written 
up notes on that learning, but I did not think to do that. I've just 
been accumulating bookmarks. I was trying to address comments pointed 
out about maybe joining forces with such projects, to try to see where 
they are and where they are heading.

Hopefully I may write something up in the future on that. But in short:

* Citadel is in C, which is not where I want to go. But it's got a good 
community and longevity. It uses Berkeley DB as the primary data store. 
I looked at some of the webapp code, but did not see anything especially 
I might want to reuse from casual poking around (but I have a high bar 
to reuse as I like Mithril).  
http://www.citadel.org/doku.php/installation:source  

* mailpile is in Python, and looks really cool as far as the UI. It 
focuses on just email and encryption (but is thinking about plugins it 
seems). I can wonder if that GUI could be reused? However, it seems 
mostly templates processed in Python? Maybe with some fancy bits of 
JavaScript here and there? I know Smári McCarthy from another context 
(Open Manufacturing) and he's a great guy. It stores email in files and 
has a memory index. Wikipedia says they crowdfunded $163,192 for it.  
https://github.com/mailpile/Mailpile  
https://www.mailpile.is/blog/2013-08-15_Digging_Through_the_Details.html  

* Kolab was especially interesting though as they generalize IMAP into a 
general data store and are truly committed to open sourcing everything 
they do (so, no Enterprise holdback). It has been funded mainly 
initially by a German government organization. It also has been funded 
by people who it consults for. Most recently, a related $103,541USD was 
raised to improve the interface of Roundcube which Kolab uses (usually) 
as its email client; I'm not 100% clear about the people involved in 
that funding effort, but someone told me they are connected with Kolab. 
The related company might have the biggest hope of being the next 
Automattic/WordPress perhaps? However, Kolab itself which integrates 
multiple services seems like a problematical thing for a single user to 
manage and maintain on a desktop. Kolab is also only for Linux. I guess 
Kolab could set that up as a VM like in Virtual Box though as an 
appliance. That difficulty in setup for any FOSS application suite can 
also be a great source of revenue for hand-holding (a perennial conflict 
when writing FOSS under a consulting-based funding model). Still, 
Automattic/WordPress has succeeded even with a "famous five minute 
install" and now easy upgrades, so it is not impossible -- but 
Automattic's funding model seems based more on hosting or support 
related to hosted accounts. So, the VirtualBox appliance approach might 
be the easiest way forward for an easy install. I have not had time to 
look through the source code there, but it seems to be some mix of PHP, 
Python, and Erlang?  Plus whatever else is in supporting modules (C++?). 
As with mailpile, I wonder if that webapp code could be reused? I may 
contact Kolab when/if Twirlip looks presentable to see if we could work 
together somehow though because I like their company's style of open 
sourcing everything -- see, now I can justify some of the time spent on 
this to my wife as "job hunting". :-)  
https://en.wikipedia.org/wiki/Kolab  
https://www.indiegogo.com/projects/roundcube-next--2#/  
https://kolab.org/get-kolab  
https://git.kolab.org/diffusion/  

* I had a digression into looking at Sakai and the Apereo Foundation, 
because online learning management overlaps with a lot of these 
email/workgroup systems. That does make me wonder if an improved 
Thunderbird could become part of the educational scene somehow, at least 
the informal educational one?

* I did a search on "Skype versus Slack" and found a lot of interesting 
discussion that helps to understand a certain instant messaging space. 
Skype has many new features (we're mostly on old Macs on Snow Leopard 
and so can't upgrade Skype though). Since people's thoughts on Skype 
were formed from older versions, Slack has a mindshare advantage 
starting from having addressed these limitation and seeming fresher. 
Slack seems to be winning based on a focus on "teams" and also "company 
wide" integration. But both have their strengths and weaknesses for 
various situations once you've bought into their premises.

* A useful reference for seeing what else is out there as far as market 
research:  
http://alternativeto.net/software/kolab/  
http://alternativeto.net/software/mozilla-thunderbird/  

* Also I should have mentioned Nylas, as open source webmail.
As with Automattic, presumably the company's business model is paid hosting?
So, as with Kolab, they too might become the next Automattic. 
Server is in Python, client in JavaScript with React.
They use their own "sync-engine" (in Python) for storage which I think uses MySQL as the backend?
The encourage plugins and have examples.
However, they chose Slack for company communications, which perhaps tells me something about their ambitions.
All very realistic and practical choices, of course
compared to my initial choices of Node.js, Mithril, and eat-you-own-dog-food chat hosting.
The results look impressive from screenshots, and they are hiring
(in San Francisco though, so not practical for me specifically).
They have a broad contributor license that seems to give them rights to do
anything they want with contributions (so, not limited to the Affero GPL they use);
it also has language about patents.
They say it applies to any pull requests.
Such agreements seem typical when a company plans a proprietary for-pay Enterprise version?
But the FSF and other places use them as well, so that does not prove anything (although
expectations might be different when signing broad agreements with, say, the FSF or the Apache project).  
https://nylas.com/N1  
https://github.com/nylas/N1  
https://github.com/nylas/n1-plugins  
https://github.com/nylas/sync-engine  
https://www.nylas.com/cla.html  

* My own comments on React vs. Mithril, suggesting the Drupal project consider Mithril
for their default client-side UX library:  
http://buytaert.net/comment/120741#comment-120741

* More discussions of email options and Thunderbird is in many comments by others
in this recent Slashdot article:  
http://it.slashdot.org/story/15/12/17/2241236/replacement-for-mozilla-thunderbird

* My post on that SLashdot article to the tb-planning list highlighting key comments:  
https://mail.mozilla.org/pipermail/tb-planning/2015-December/004308.html

* My own comment on that Slashot article is here:  
"Sprint for Thunderbird webapp proof-of-concept (Score:2)"  
http://it.slashdot.org/comments.pl?sid=8496187&cid=51149659
