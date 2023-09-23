---
originalPath: user/devops-pipelines.md
updated: 2023-09-21 11:38:41 +0100
version: 1.11.4
navTitle: DevOps Pipelines
---

# DevOps Pipelines


**Navigation**: `Team > Application > DevOps Pipelines`


<img src="./images/ui-devops-pipelines.jpg" width="100%" />


In FlowFuse it is possible to configure a DevOps pipeline for your Node-RED instances.
DevOps Pipelines allow you to easily deploy from one instance to another, most
commonly used for having an unstable/experimental "Development" instance, and a more stable
"Production" instance.

The pipeline then allows you to move your full flow and configuration along from "Development"
to "Production" once it's ready.

You can configure this in FlowFuse from the Application screen. Note you will need to have created
any Instances you wish to include in the Pipeline before being able to add them to a Pipeline.

## Creating a Pipeline

1. Select the Application you want to configure a Pipeline for.
2. Ensure an instance is created for each stage you plan to create, e.g. development, QA, and production.
   1. For the instance you want to duplicate go to the **Settings** tab
   2. Click **Duplicate Instance** and provide the necessairy details
4. Select the "DevOps Pipelines" tab
5. Select "Add Pipeline"
6. Name your pipeline appropriately (this can be changed later)
7. Select "Add Stage"
8. Define your Stage's name and the Instance associated to this Stage.
9. Click "Add Stage"
10. Repeat 5. - 7. for as many stages as you need.

_Note: You cannot currently insert a Stage into the middle of a Pipeline, only at the end._


## Running a Pipeline Stage

<img src="./images/ui-devops-run.png" width="100%" />

Each stage currently is deployed manually. To do so, click the "play" icon on the source stage. In the example above,
it will push from the "Development" stage to the "Production" stage.

**Environment Variables** - When pushing to a next stage, _**only your environment variable keys
will be copied over**_. Values must be set on the next Stage's Instance explicitly.

**Instance Settings** - None of your Instance Settings will be copied over (e.g. Editor, Palette or Security Settings).

This ensures a split between your staging environments.
