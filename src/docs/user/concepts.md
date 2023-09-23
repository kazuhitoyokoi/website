---
originalPath: user/concepts.md
updated: 2023-09-21 11:38:41 +0100
version: 1.11.4
navTitle: FlowFuse Concepts
navOrder: 2
---

# FlowFuse Concepts

FlowFuse makes it easy to create and manage Node-RED instances. To do that, there
are a few concepts the platform introduces to help organise things. Within FlowFuse, users are members of _Teams_. Each team can create _Applications_
that are collections of one or more _Node-RED instances_. Each instance is created
from a _Template_ to provide its default settings and runs on a _Stack_ that determines
the Node-RED version, memory and CPU usage.
_Devices_ can be assigned to an instance and have flows automatically deployed to
them when _snapshots_ are created of the instance.

 - [Team](#team)
 - [Application](#application)
   - [DevOps Pipeline](#devops-pipeline)
 - [Instance](#instance)
   - [Type](#instance-type)
   - [Stack](#stack)
   - [Template](#template)
   - [Snapshot](#instance-snapshot)
 - [Device](#device)


### Team

Teams are how FlowFuse organises the user on the platform. Each team can have
multiple members, and each user can be a member of multiple teams.

The users in a team can have different roles that determine what they are
[able to do](./team/#role-based-access-control).

In FlowFuse Cloud, each team has its own billing plan, managed via Stripe.

#### Team Type

The platform can be configured to provide different types of team. These can be used
to apply limits on what teams of a given type can do. For example, a particular
team type may be restricted to certain types of [Node-RED Instance](#instance),
or how many members the team can have.

### Application

**Introduced in FlowForge 1.5**

To organise your Node-RED instances, they are grouped with Applications.

With the 1.5 release, each Application has a single Node-RED instance. With the 
1.6 release, an application can have multiple Node-RED instances.

#### DevOps Pipeline

**Introduced in FlowForge 1.8**

DevOps Pipelines allow you to manage staged development environments. Pushing
from your Development instances to Production once you have stable, and well tested,
flows. You can find out how to implement DevOps Pipelines [here](./devops-pipelines.md)

### What is the difference between an Instance and a Device?

At FlowFuse, we make a distinction between `Instances` and `Devices` in our terminology, even though both refer to Node-RED environments. The key difference lies in where these environments run. An Instance runs within the FlowFuse infrastructure, benefiting from our platform's seamless integration and management capabilities. In contrast, a Device refers to a Node-RED environment managed by FlowFuse but running on a different infrastructure—be it a PLC, Gateway, local PC, or even a server in a different network.

### Instance

**This was called a Project before FlowForge 1.5**

Within your Application you can have one or more Instances of Node-RED.

The Instance is a customised version of Node-RED that includes various FlowForge
plugins to integrate it with the platform.

A number of the standard Node-RED settings are exposed for customisation, and they
can be preset by applying a Template when creating the Instance.

When running in Docker or Kubernetes (such as FlowFuse Cloud), the instance names
are used as the hostname to access the instance. This means that the names must
be DNS safe (made up of a-z, 0-9 and -) and not start with a number. Currently
it is not possible to change an instance name after it has been created.

Within the instance there are some further concepts to learn about.

#### Instance Type

When you create a Node-RED instance, you can pick its type from the list the platform
Administrator has made available. For example, each type could provide a different
amount of memory or CPU allocation.

If the platform has billing enabled, each type may have a different monthly price
associated with it.

#### Stack

A Stack describes properties of the Node-RED runtime. This can include the
version of Node-RED, memory and CPU allocation. The specific details will depend
on how and where FlowFuse is running.

Stacks are created and owned by the platform Administrator. When a User
comes to create a new Node-RED instance, they chose from the available stacks associated
with the chosen Instance Type.

For details on how to administer and manage Stacks, please see the
[Administering FlowFuse](../admin/introduction.md#managing-stacks) docs.

#### Template

A Template describes properties of Node-RED itself. It is how many of the
settings a user familiar with Node-RED would be used to modifying in their settings
file. But it can also be used to customise the palette of nodes that are pre-installed,
provide a set of default flows and change the look and feel of the editor.

A template can also specify [Environment Variables](./envvar.md) which can then have
their values customised for each Node-RED instance, or have their values locked
to prevent any changes.

In the current release of FlowFuse, Templates are created by the Administrator.
As well as define the values, they also get to choose whether instances are able
to override any of the settings for themselves.

#### Instance Snapshot

A snapshot is a point-in-time backup of a Node-RED instance. It captures the flows, credentials
and runtime settings.

Snapshots can be created (and deleted) on the FlowFuse dashboard, or using the
[FlowFuse Node-RED Tools plugin](/docs/migration/node-red-tools.md).

The dashboard also allows you to roll an instance back to a previous snapshot.

### Device

The FlowFuse platform can be used to manage Node-RED applications running on remote devices.
A Device runs a software agent that connects back to the platform to receive updates.
Users must [install the agent](../device-agent/install.md) on the devices.

Devices are registered to a Team, and then assigned to an individual Node-RED instance within that team.
A user can create a [snapshot](#instance-snapshot) and then mark it as the
*target* snapshot for devices. The platform will then deploy that snapshot to
all of the devices assigned to the instance.

To further simplify device registration, Provisioning Tokens can be created to allow 
devices to automatically connect to a team without having to manually register them first.
The token can also be configured to assign a device directly to a Node-RED instance within the team.
