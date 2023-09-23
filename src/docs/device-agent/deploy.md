---
originalPath: device-agent/deploy.md
updated: 2023-09-21 11:38:41 +0100
version: 1.11.4
navTitle: Deploying your Flows
navOrder: 5
---

# Deploying Flows to the Device Agent

Before you're able to deploy your flows to your device,
you will have needed to have completed these steps:

1. [Install the Device Agent on the Device](./install.md) - installs Node-RED and other requirements in order to communicate with FlowFuse.
2. [Register the Device with FlowFuse](./register.md) - this step will have provided you with a `device.yml` file to move to your Device.
3. [Run the Device Agent](./running.md) - starts the Device Agent on the Device.

## Deploying a Node-RED instance to the device

To deploy a Node-RED instance to the device:

1. [Create a snapshot](../user/snapshots.md#create-a-snapshot) - a point-in-time
backup of the Node-RED flows and configuration.
2. [Mark that snapshot](../user/snapshots.md#setting-a-device-target-snapshot) as the **Device Target** snapshot.

This model allows you to develop your flows in FlowFuse and only push it out
to the registered devices when you're happy with what you've created.

## Starting Node-RED on the device without deploying a snapshot

A device can be assigned to an application without a snapshot being deployed to it.

In this mode, the device will start Node-RED with a default set of flows that can
be edited on the device see [Editing the Node-RED flows on a device that is assigned to an application](#editing-the-node-red-flows-on-a-device-that-is-assigned-to-an-application) below

## Editing the Node-RED flows on a device that is assigned to an instance

The device agent does not allow local access to the Node-RED editor. This ensures
the device is running the deployed snapshot without modification.

When running on FlowFuse Cloud, or a premium licensed FlowFuse instance (with the
[MQTT broker enabled](https://flowforge.com/docs/install/local/#setting-up-mosquitto-(optional))
access to the editor.

This can then be used to develop the flows directly on the device and a new snapshot
generated from the device that can be deployed to other devices in the application.

Whilst in Developer Mode the device will not receive new updates from the platform
when new snapshots are deployed.

**Accessing the Editor**

1. Once developer mode is enabled, click the **Enable** button next to the 'Editor Access' option
2. When the editor is available, the Editor button in the header will become active and will take you to the device editor.

**Creating a Device Snapshot**

To create an instance snapshot from the device use the **Create Snapshot** button
in the Developer Mode options panel.

You will be prompted to give the snapshot a name and description. See [Snapshots](../user/snapshots.md) for more information
about working with snapshots.

## Editing the Node-RED flows on a device that is assigned to an application

The device agent does not allow local access to the Node-RED editor. Access to the
editor is only available when:

* The device is in Developer Mode

* When running on FlowForge Cloud, or a premium licensed FlowForge instance (with the
[MQTT broker enabled](https://flowforge.com/docs/install/local/#setting-up-mosquitto-(optional))
access to the editor.

Whilst in Developer Mode the device will not receive new updates from the platform.

**Enabling Developer Mode**

1. Go to your teams's **Devices** page.
2. Select the device you want to edit by clicking its name.
3. Click the "Developer Mode" button to enable developer mode.
4. Once enabled, a Developer Mode Options panel is shown on the Device overview page.


**Accessing the Editor**

1. Once developer mode is enabled, click the **Enable** button next to the 'Editor Access' option
2. When the editor is available, the Editor button in the header will become active and will take you to the device editor.

**Creating a Device Snapshot**

Device Snapshots are not currently supported when editing flows on a device that is assigned to an application.
This feature is on the roadmap for a future release.

### Important Notes

* Remote access to the editor requires Device Agent v0.8.0 or later.
* The Web UI requires Device Agent v0.9.0 or later.
* Assigning a device to an application requires Device Agent v0.11.0 and FlowForge v0.11.0 or later.
* When a device is assigned to an instance:
    * It must first have a snapshot applied before editor access is possible.
    * Disabling Developer Mode will cause the device to check-in with the platform. If the device flows have changed, it will be reloaded with the current target snapshot assigned to that device, causing any changes made in Developer Mode to be overwritten. Therefore, it is recommended to create a snapshot of the changes before disabling Developer Mode.
* When a device is assigned to an application:
    * It will start with a set of default flows.
    * It will not be possible to take a snapshot.
    * Disabling Developer Mode will cause the device to check-in with the platform. If the device settings have changed, it will be updated and restarted. The edited flows will be untouched.
* The device will not receive any updates from the platform while in Developer Mode.
* The device must be online and connected to the platform to enable "Editor Access".
* To minimise server and device resources, it is recommended to disable "Editor Access" when not actively developing flows on a device.
