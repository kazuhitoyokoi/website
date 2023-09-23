---
originalPath: device-agent/introduction.md
updated: 2023-09-21 11:38:41 +0100
version: 1.11.4
navTitle: Introduction
navOrder: 1
---
# FlowFuse Device Agent

The FlowFuse platform can be used to manage Node-RED instances running on remote Devices.
A Device runs a software agent that connects back to FlowFuse in order to receive updates.

In order to connect your device to FlowFuse, and to allow FlowFuse to manage it, you'll need to do the following steps:

- [Install the FlowFuse Device Agent](./install.md) - Install the agent directly onto your device.
- [Register your Device](./register.md) - Let FlowFuse know your device has been setup with the Device Agent.
- [Run the Device Agent](./running.md) - Run the agent on your device, this will connect to FlowFuse and wait for instruction on which Node-RED flows to run.
- [Deploy Flows to your Device](./deploy.md) - With the above steps completed, you can now run Node-RED flows directly on your device, and have them managed by FlowFuse remotely.
