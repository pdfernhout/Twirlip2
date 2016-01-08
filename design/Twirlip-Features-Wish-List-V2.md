Twirlip Features (wish) List
============================
Version: 2

Author: David Krings

Description of last change: Added features, converted doc to markdown


GENERAL
-------
* allow access from multiple browser clients to one common instance/profile/install
    * have one location where app code and data is located and allow it to be accessed by multiple browsers on multiple systems at the same time (Thunderbird cannot do this and it is major problem!): craft an email client 'server' (see also Lofty Stuff section, might require use of a lightweight web server)
* internationalized / localized (can do German, might be able to ask people for translation to Hindi, Pakistani, Arabic, Russian, Japanese
* use freeware/open source dictionaries / thesaurus
* provide menu system
* save last state for UI
* support full screen view (browser tab full screen)
* contain app and data in one folder/directory (intention is to make backup and moving easier)
* override browser behavior at all times so that backspace does not navigate back
* set autofill to off on (all?) text fields
* allow for tagging any content
    * entire item
    * portion of content
* field level help

ACCOUNT SETUP
-------------
* setup wizard for new email account
    * allow for selecting free email services (GMX, GMAIL, WEB.DE, HOTMAIL/OUTLOOK, YAHOO, others)
        * ask for desired user name and have wizard check availability, propose alternatives
        * have option to check all free services for desired name
        * if name is available ask for password
        * if password is acceptable create account
* manual account creation
* keep incoming / outgoing servers as part of each account
* import account settings from Thunderbird profile
* add option to account to force text only / HTML only send/receive (means convert HTML content to text in either way)
* send test email to account (send and receive until success or give up and report error, think printer test page)
* associate language with account

SECURITY / USERS
----------------
* allow for password / 2 factor ? protection of entire app
* make it so that Twirlip is considered as "safe app" for Gmail (currently, Thunderbird requires dropping Gmail security)
* do not execute JS in messages, or any other active content like Flash
* store email account passwords
* allow for master password for email account password lookup
* add option to not allow clicking on a link
* spam filter
    * from 3rd party with updates
    * by declaring a received email as spam
        * by sender
        * by (portion of) subject
    * move to spam folder
    * allow for personal whitelist (will only be effective when email server does not already delete spam)
* check links against known bad domains (Spybot has a list of bad domains, not sure what the licensing is and if it can be reused freely; could make Spybot installation a prerequsisite and import list, will only be an option for Windows)

RECEIVING EMAIL
---------------
* get headers only
* download entire message
* threaded view
* column (grid) view
* get email on demand from one / all accounts

VIEWING EMAIL
-------------
* allow for text only view
* allow for HTML view
* do not allow any active content
* if links are included in HTML show target URL in status bar (if present) and / or tool tip
* provide tri-pane view (accounts on left full height, folder content at top, preview at bottom)
* provide tabbed interface within browser tab
* allow for opening email in new browser tab (edit mode) - setting? context menu?
* print email (assumed that this will be handled through the browser's print capabilities)

EDITING EMAIL
-------------
* have three editor options (general default setting, but with per email account override): plain text, 'rich text' (bold, underline, font size - nothing else), full HTML
* show / hide editor characters (CR/LF, tab, space)
* attach files
* attach files by uploading to file share services (Hightail, Dropbox, etc)
* type as you go spell checking
* on demand spell check (after pasting content)
* reply
* reply all / reply some
* quote email
* forward email with or without attachments
* add option to force edit mode to full browser tab view
* edit as new for any email

SENDING EMAIL
-------------
* send to any email address (obvious)
* multiple addresses
* CC / BCC
    * set easily disabled confirmation asking if CC should be turned into BCC

ORGANIZING EMAIL
----------------
* by email account
* have inbox, sent, trash, drafts be the same as folders
* allow accounts to have their own set of folders or use any existing one
* allow for merging folders
    * ideally by drag & drop with confirmation
    * update any filters that might be impacted
* folder structure with theoretically unlimited levels (force limit if performance suffers too much / implementation might get too convoluted)
* query based folders across accounts (e.g. show all emails with "cheesecake" in subject line in one folder), query based folders are views only, emails do not reside in them
* on demand purge of email based on
    * age
    * size
    * account
    * folder
        * purge to trash (default)
        * purge to delete (hard delete, dev/nul, gone for good)
        * purge to archive
    * purge setting per account (override?)
    * purge setting for entire Twirlip instance (global default)
* drag & drop messages from one folder to the other
* allow for adding any kind of item (email, tweet, URL, chat message, etc) to be stored in folder (might make storing content difficult due to varying content and associated attributes, maybe folders only contain pointers to content???)

FILTERING / SORTING EMAIL
-------------------------
* filter rules (same as Thunderbird)
* filter by size
* full text search across everything / account / folder / thread
* actions based on filter rules
    * move to folder
    * send to trash
    * delete
    * delete and remove from / do not add to address book
* sort on any column
* sort / filter on tags

ADDRESS BOOK
------------
* manual add addresses
* automatically collect addresses
* mailing lists (multiple addresses associated with an alias)
    * add option to force BCC
* associate language with address
    * when sending message to address automatically use proper dictionary

CALENDAR
--------
* same feature set as Lightning will be fine
* allow for multiple calendars (work, home, hobby, clubs, etc) and / or tag entries in calendar and allow for filtering of master calendar (might be better and easier to implement)
* allow for creating resources
* allow for booking resources
* manage resource and participant availability
    * have graphical view that allows for time shifting and viewing availability of participants and resources

ADVANCED EMAIL / CALENDAR
-------------------------
* connect to Exchange server impersonating an Outlook client
* Parental Controls
    * allow only to use one specific email account
    * allow only email to be sent to approved list of addresses
    * allow only email to be received from approved list of addresses
    * protect settings by password or additional security means (2 factor)
    * send message to parent email when attempts are made to enter password, edit settings, uninstall, or update (if necessary, should be fine)
* import mbx / pst files (Other formats?)
* export folders or selected / filtered emails to mbx / pst file, other formats?


RSS
---
* honor the name and make it real simple
    * drag RSS feed link to where??? to add feed to Twirlip
* allow for opening all current feed entries to be opened in new browser tabs

SMS
---
* SMS 'light' using email to mobile phone


CHAT
----
* peer to peer chat
* support connectivity to various chat servers (DALnet comes to mind...if it still exists)
    * make joining chat servers and channels easy (what exactly "easy" means here is TBD)

VIDEO CHAT
----------
* use webcam via browser (if uspported)
* peer to peer chat
* allow for video chat by sending link via email (like Firefox's Telefonica supported video chat)
* support Skype (requires Skype account)
* support TeamSpeak as client

VOICE / MULTIMEDIA
------------------
* record audio source and send as email/multimedia SMS
* record from webcam and send as email

COLLABORATION
-------------
* share screen
* annotate shared screen

SOCIAL NETWORKS
---------------
* follow Twitter feed
* follow Facebook updates
* follow LinkedIn profiles
* send tweets (requires Twitter account)

AUTOMATION
----------
* scheduled email reception (a l· check for new email every x minutes)
    * ideally without browser being open (not sure if this is technically possible?)
* delayed email send (fixed schedule / fixed delay aka "unsend" option)
* backup data and settings to specified location using flat file XML or more optimized (Twirlip specific) format
    * use 7zip or the like for compression
    * send as email attachment? FTP? cloud storage? => need to discuss if there is ever a need to do that, might be 'lofty stuff'
* automatic purge using specified settings

USABILITY
---------
* add support for visually impaired
* add support for hearing impaired
* add support for physically impaired

LOFTY STUFF
-----------
* support Thunderbird plugins (necessary? reasonable? are there plugins aside from Lightning worth supporting?)
* office suite integration with LibreOffice/OpenOffice, MS Office / Office 365
* allow for multiple users (one installation accessed by various users with various profiles)
    * users will have access to only their own email accounts / calendar(s??)
    * users can share email accounts / calendars
* integration with Blur / 10 minute mail, other alternate email / short term email services
* drawing tool to annotate text / images
* use small web server to serve up app
* fully customizable GUI using design editor supporting drag & drop
* UI templates
* themes / skins
* equation editor (MathFlow crafting MathML)
* email to phone: convert text or use recorded audio and dial regular phone to play message
* add tool in account configuration to open settings page of email account in browser
* scan image / text from scanner and send as email OCR?)
* find links in email and open browser tabs, allow for comparison with only portion of URL (without URL parameters, only page file name in URL)
* allow sending email using specific account but using different account as reply to address (might not be allowed by email services for security reasons?)
* integrate web mail provider interface for send / receive if desired so and ideally still support filters, folders, queries within Twirlip
* undo / redo for everything
* column editing / advanced editing like Notepad++ has it
* merge emails into one, ideally with proper quoting in chronological order
* compare email content
* make filter suggestions based on selected emails
* have multiple clipboards