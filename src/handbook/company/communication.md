---
navTitle: Communications
---

As a distributed company we should be mindful of how we communicate.

## Date and time

### Use UTC for times

Unless explicitly stated otherwise, communicate times in UTC. This allows each
team member to remember just their offset to UTC and makes communication around
timezones less error-prone (e.g. misremembering your own offset to a colleagues
timezone) and more efficient. **Exception**: When communicating to meet in 
physical locations, the timezone of that location will be assumed as default.

### Time of day

A 24 hour clock is assumed in time notations like `10:00`, when referencing a
time in the afternoon either use e.g. `15:00` or explicitly `3 PM`.

### Formatting dates

As there's varying standard on how to format dates, please be explicit and use
`YYYY-MM-DD` by default. This format is unambiguous, and standardized with ISO
8601, meaning it can be used in tools like Google Sheets too.

## Meetings

### General guidance

Each meeting should have an agenda. This allows potential participants to prepare
and decide whether attendance is required. Any participant can add items to the
agenda, please prefix your item with your name or initials to communicate who's
going to talk and lead the discussion. Adding new items to the agenda while the
meeting is started is good practice and can be leveraged to keep the currently
discussed item focussed and on-rails.

### During the meeting

Meetings start on time by the person with the first item on the agenda, verbalize
and discuss the item. Once done, hand over to the owner of the next agenda item.

During the meeting notes should be taken in an inline fashion. Non-participants
can then read the agenda after the meeting and are up-to-date without having to
scroll to a notes section.

### Coffee calls

Coffee calls are social of nature and thus are the exception to the rule that
each meeting should have an agenda. If you want to be matched to a random team
member every two weeks for a coffee call, join the #virtual-coffee channel on
Slack to be matched automatically.

## Asynchronous communication

### Slack

When using Slack, prefer to keep discussions in a thread. This reduces scroll
back, and focusses channels.

Note that knowledge in Slack is ephemeral, it's not storage for information or knowledge
sharing. As such knowledge and decision made in Slack should always be recorded
in the handbook, GitHub issue, or Google Doc on that topic to keep a log that also works
for asynchronous communication.

#### Recommended channels

Not all channels are joined by default when you join Slack. We've added a bunch
below so you get to decide if you want more channels or not.

- `#metrics` will output sales and engagement metrics
- `#social-twitter` is a stream of engagement with @FlowFuseInc
- `#virtual-coffee` to schedule coffee calls with other team members!

#### Channel name structure

To make it easier to find your way around in Slack, we have some rules for naming channels. This will help give everything some context and implicit sense of purpose.

|Type | Slack prefix | Purpose |
|:--- |:--- |:---|
| Department           | `#dept-` | For each company department and ask them questions |
| Project based work   | `#proj-` | Work scoped to a project with an finite horizon |
| GitHub notifications | `#gh-`   | For many updates around the website and product development a notification is sent to the corresponding channel |
| Ops notifications    | `#ops-`  | Channels receiving notifications from operations-related services |

All team members are advised to put prefix type channels into [their own section](https://slack.com/help/articles/360043207674-Organize-your-sidebar-with-custom-sections).

### GitHub

All code at FlowFuse is stored in Git, and GitHub hosts our repositories. As
such all our changes, feature ideas/requests, etc. are stored there. It also
holds task lists for onboarding, [art requests](../design/art-requests.md), and
other projects not necessarily code related. It's important to stay in the loop
on GitHub and it's notifications.

Recommended views to keep track of items requiring your attention:
- https://github.com/pulls/mentioned
- https://github.com/issues/mentioned

Please try to respond to mentions, review requests, etc within 2 business days.

### Standup meetings

Standup meetings are hard to scale across multiple timezones. To make stand-ups
async, we're using [Geekbot](https://geekbot.com/). Geekbot will trigger each
workday morning at 9:00 local time, when online in Slack. Everyone who's a
member of the #standup channel in Slack will be prompted.

Pro-tips:
- When a questions doesn't need answering, fill in `-` to skip
- When you want to report earlier that day, message Geekbot `report`

### Current meetings

#### Wednesday Team meeting

Weekly a meeting is held to announce company wide updates, get to know each
other, and share things you want to share both professionally and personally.

Personal updates don't have to be documented in the agenda, but please do keep a
list of names in the agenda so everyone gets the opportunity to share.

### Bi-weekly KPI meeting

This 25-minute meeting is held to report on [key metrics](../company/achieving-success.md#kpi).
Every department gets 5 minutes to explain what initiatives have been implemented
over the past 2 weeks, what initiatives or milestones are scheduled for the next
two weeks, and what results are expected to the company wide KPI.

## Node-RED community interactions.

As an employee of FlowFuse, when we interact with the OSS Node-RED community we 
must be mindful of our position.  For example, when offering advice on the Node-RED 
forum or the Node-RED slack, the first answer we offer should be how a solution can 
be achieved using Node-RED.  If a native Node-RED solution is not possible or the 
user would benefit from the advantages that FlowFuse offers, then, like any other 
person or company, we can offer FlowFuse as a potential solution.

## Feedback and Thanks

In FlowFuse, we strongly encourage the sharing of feedback and thank you's. We have
a custom-built SlackBot (built in Node-RED and hosted in FlowFuse of course), that 
enables users to message `@Feedback` with:

- `/give-thanks @to_user <message>` - for short thank you messages
- `/give-feedback` - to be prompted with a more formal template, within which you can provide structured feedback to a particular person. This template contains sections for _"Keep Doing"_, _"Do More Of"_, _"Do Less Of"_ and _"General Comments"_, of which you can complete, and send, the relevant sections.

All feedback is then sent directly to the relevant user via the Slack App, meaning that feedback and thank you messages are all nicely stored in a single place for future review.

## 1:1 meetings

Each employee at FlowFuse will have regular one to one meetings with their
manager. The primary goal of this meeting is for the report to set the agenda
and tone. It's important to understand what's going on in ones life, how they're
feeling, and what their challenges are.

An agenda is kept for this meeting to which both parties can add items to discuss.
It's advised to add to the agenda throughout the week, and only filter content
during the meeting.

When struggling to fill the agenda you might want to think about:
- What has changed in the last few weeks that worked out well?
- What has changed in the last few weeks that didn't work out?
- Were there difficult problems to be solved last week? What would've made it easier to solve?
- What's important but not urgent that's left undone?

Further, the document should include an "Action Items" list to track what needs
doing, and when.

## Skip level meetings

Meetings between levels of the organisation happen in regular 1:1s, usually held
weekly between the manager and report. The report however might want to
also communicate with the manager's manager to keep in touch with the strategy and
communicate feedback on what they observe directly.

The advised cadance to have these meetings depends on the wants of the report,
but generally advised once every 6-8 weeks. As FlowFuse scales, the number of
weeks between these meetings is likely increasing.
