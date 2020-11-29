# ml-pipeline-vcs
Framework for pipelining Machine Learning projects with built-in Version Control System.

Consists of following packages:
* `ml_flow_manager` - package (framework) which creates the flow of the processing nodes (ML operators)
* `ml_flow_vcs` - package that deals with persistency of the data in `DataHandler` and versions of created flows
* `ml_flow_vcs_api` - endpoints for working with

Install
=======

If you don't have python3 or your version is <3.6.0, install/upgrade it.

### 1. Create and activate virtual python environment:

Create and activate python environment with following commands.

#### (Linux)

```shell script
$ python -m venv env
$ source env/bin/activate
```

#### (Windows)

```shell script
$ python -m venv env
$ pipe_env/Scripts/activate
```

### 2. Install `ml-flow-manager` in development environment:

Run the command below from the project's root directory.

```shell script
(pipe_env) $ pip install -e .
```
- e - development mode
- . - location of setup.py file
