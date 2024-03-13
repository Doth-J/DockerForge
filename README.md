# DockerForge

<p align="center">
  <img width="250px" src="./docs/dockerforge.png">
</p>

Command line tool to generate dockerfile definitions and scaffold project templates for CI/CD operations, developed in [Bun](https://bun.sh).

## **Motivation** 🔥

Upon creating Docker projects and modules, I observed a recurring pattern in the necessary files and considered streamlining it with a cli tool. To dockerize a project, the directory must contain the following:

- The `src` folder containing the code.
- The `Dockefile` for building the docker image.
- (_Optionally_) the `config` file for runtime configuring.
- (_Optionally_) the `.env` file for setting environmental variables.
- (_Optionally_) the `docker-compose.yaml` for creating a Docker service stack.

This CLI tool aims to automate the production of these files while also offering scaffolded templates for a variety of programming languages.

## **Installation** ⚡

### Using **Bun <img width="20px" src="./docs/bun.svg">**

To install the cli tool, execute the following command:

```bash
bun install -g dockerforge
```

### Using **Binary <img width="20px" src="./docs/binary.svg">**

To install the cli tool using the binary, head over to X:

## **Usage** 🚀

Once installed, you can use the tool interactively or with cli options by executing the `dockeforge` command:

<p align="center">
  <img width="100%" src="./docs/usage.gif">
</p>

```console
$ dockerforge -h

Usage: dockerforge [options]

🐳 Dockerfile generator tool for CD/CI projects

Options:
  -n,--name <string>      Target project name
  -e,--env                Create project .env file
  -m,--makefile           Create project Makefile
  -s,--scaffold           Scaffold template project with 'src' structure
  -c,--config <string>    Create project config file (choices: "json", "toml", "yaml", "ini", "none")
  -l,--language <string>  Target project language (choices: "typescript", "javascript", "python", "golang", "rust")
  -v, --version           Output the current version
  -h,--help               Display this help message
```

### **CLI Options** ⚙️

> -n, --name \<string>

- This option sets the name of the target project, this will be used in the generated dockerfile definitions. By default it set to

> -e, --env

- This option creates an empty `.env` inside the current working directory.

> -m, --makefile

- This option creates a `Makefile` with docker command shortcuts for development & building inside the current working directory. These command shortcuts are listed below.
- **Makefile**:

> -s, --scaffold

- This option scaffold a project template for the selected programming language. If an `src` file already exists in the current working directory, this option will not have an effect

> config

> language

> version

> help
