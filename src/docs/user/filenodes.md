---
originalPath: user/filenodes.md
updated: 2023-09-21 11:38:41 +0100
version: 1.11.4
navTitle: FlowFuse File Nodes
---

# FlowFuse File Nodes

Node-RED instances running within FlowFuse include a set of nodes that make it possible
to store files safely regardless of the environment. 
Cloud based instances can read and write to persistent storage using these nodes.
Edge devices will store files on its local filesystem.

## Enabling Persistent File Storage

These nodes are enabled by default on the FlowFuse Cloud platform. If you're
running a self-hosted environment you should follow the next steps.

FlowFuse file nodes replace the core Node-RED file nodes. To make use of these
nodes, the FlowFuse platform Administrator must ensure the core file nodes are 
not loaded.

This is done by adding `10-file-js` in the **Exclude nodes by filename** 
section of your instance settings under the **Palette** section.

This setting is modifiable only by a Team owner and only if it has not been
locked in the [template](concepts.md#template) by the platform Administrator.

## Nodes

There are two nodes in the File Node collection:

- `file` - A file node for writing to persistent storage
- `file in` - A file node for reading from persistent storage

## Usage

Simply drop the file nodes into your flows as you would with the regular file nodes in Node-RED. 
There are some helpful built-in examples on the **Import Examples** dialog in Node-RED.

## Deployment Considerations

When a snapshot is deployed to a device, the original Node-RED file nodes are used and 
any files will be stored on the device's local filesystem.

