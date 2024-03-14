#! /usr/bin/env node
import fs from "fs";
import ora from "ora";
import path from "path";
import kleur from "kleur";
import prompts from "prompts";
import { Command, Option } from "commander";
// import pkg from "../package.json" assert { type: "json" };
import { typescript, javascript, python, go, rust } from "./languages/index.js";

function writeConfig(config: string) {
  let configContent = "";
  switch (config) {
    case "json":
      configContent = JSON.stringify({ setup: { param: 123 } }, null, 1);
      break;
    case "toml":
    case "ini":
      configContent = "[Setup]\nparam = 123";
      break;
    case "yaml":
      configContent = "setup:\n\tparam: 123";
  }
  fs.writeFileSync(path.join(process.cwd(), "config." + config), configContent);
}

function writeMakefile(name: string, language?: string) {
  let makefileContent = "start:\n\tdocker-compose up -d\n";
  makefileContent += "stop:\n\tdocker-compose down -v\n";
  makefileContent += `build:\n\tdocker build -t ${name}-app .\n`;
  makefileContent += `remove:\n\tdocker image rm ${name}-app\n`;
  makefileContent += "update:\n\tmake stop\n\tmake remove\n\tmake start\n";
  makefileContent +=
    "production:\n\tdocker-compose -f docker-compose.yaml -f docker-compose.production.yaml up -d\n";
  if (language) {
    switch (language) {
      case "typescript":
        makefileContent += `run:\n\tnpx ts-node src/index.ts\n`;
        break;
      case "javascript":
        makefileContent += `run:\n\tnode src/index.js\n`;
        break;
      case "python":
        makefileContent += `run:\n\tpython src/index.py\n`;
        break;
      case "golang":
        makefileContent += `run:\n\tgo run src/main.go\n`;
        break;
      case "rust":
        makefileContent += `run:\n\tcargo run src/main.rs\n`;
        break;
    }
  }
  fs.writeFileSync(path.join(process.cwd(), "Makefile"), makefileContent);
}

function writeDockerfiles(docker: {
  dockerfile: string;
  compose_dev: string;
  compose_prod: string;
  nodemon?: string;
}) {
  fs.writeFileSync(path.join(process.cwd(), "Dockerfile"), docker.dockerfile);
  fs.writeFileSync(
    path.join(process.cwd(), "docker-compose.yaml"),
    docker.compose_dev
  );
  fs.writeFileSync(
    path.join(process.cwd(), "docker-compose.production.yaml"),
    docker.compose_prod
  );
  if (docker.nodemon)
    fs.writeFileSync(path.join(process.cwd(), "nodemon.json"), docker.nodemon);
}

function main() {
  const program = new Command();

  program
    .name(kleur.yellow("dockerforge"))
    .description(
      `🐳 ${kleur.cyan("Dockerfile generator cli tool for CD/CI operations.")}`
    )
    .option("-n,--name <string>", kleur.blue("Target project name"))
    .option("-e,--env", kleur.blue("Create project .env file"))
    .option("-m,--makefile", kleur.blue("Create project Makefile"))
    .option(
      "-s,--scaffold",
      kleur.blue("Scaffold template project with 'src' structure")
    )
    .addOption(
      new Option(
        "-c,--config <string>",
        kleur.blue("Create project config file")
      ).choices(["json", "toml", "yaml", "ini", "none"])
    )
    .addOption(
      new Option(
        "-l,--language <string>",
        kleur.blue("Target project language")
      ).choices(["typescript", "javascript", "python", "golang", "rust"])
    )
    .addHelpOption(
      new Option("-h,--help", kleur.blue("Display this help message"))
    )
    .version(
      `dockerforge v.1.0.0`,
      "-v, --version",
      kleur.blue("Output the current version")
    )
    .action(async (options) => {
      const response = await prompts([
        {
          type: () => (options.name ? null : "text"),
          name: "name",
          initial: path.basename(process.cwd()),
          message: "Target project name?",
        },
        {
          type: () => (options.config ? null : "select"),
          name: "config",
          choices: [
            { title: kleur.red("None"), value: "none" },
            { title: kleur.yellow("JSON"), value: "json" },
            { title: kleur.magenta("YAML"), value: "yaml" },
            { title: kleur.blue("INI"), value: "ini" },
            { title: kleur.cyan("TOML"), value: "toml" },
          ],
          initial: 0,
          hint: "'None' option will not create config file",
          message: "Config file type?",
        },
        {
          type: () => (options.language ? null : "select"),
          name: "language",
          choices: [
            { title: kleur.cyan("Typescript"), value: "typescript" },
            { title: kleur.yellow("Python"), value: "python" },
            { title: kleur.blue("Golang"), value: "golang" },
            { title: kleur.magenta("Rust"), value: "rust" },
            { title: kleur.green("NodeJS"), value: "javascript" },
          ],
          initial: 0,
          hint: "Select option and hit Enter",
          message: "Target project language?",
        },
        {
          type: () =>
            options.scaffold || fs.existsSync(path.join(process.cwd(), "src"))
              ? null
              : "confirm",
          name: "scaffold",
          message: "Scaffold template project?",
          initial: true,
        },
      ]);
      const name: string = options.name || response.name,
        config: string = options.config || response.config,
        language: string = options.language || response.language,
        scaffold =
          (options.scaffold &&
            !fs.existsSync(path.join(process.cwd(), "src"))) ||
          response.scaffold;
      const progress = ora().start();
      progress.stopAndPersist({
        symbol: "🐋",
        text: "Starting DockerForge...",
      });
      if (config && config != "none") {
        progress.start("Creating config file...");
        if (fs.existsSync(path.join(process.cwd(), "config." + config))) {
          progress.fail(
            `${kleur.bold(config.toUpperCase())} config file already exists!`
          );
        } else {
          writeConfig(config);
          progress.stopAndPersist({
            symbol: "🛠️",
            text: ` Created ${kleur.bold(config.toUpperCase())} config file!`,
          });
        }
      }
      if (options.makefile) {
        progress.start("Creating Makefile...");
        if (fs.existsSync(path.join(process.cwd(), "Makefile"))) {
          progress.fail(`Makefile already exists!`);
        } else {
          writeMakefile(name, language);
          progress.stopAndPersist({
            symbol: "📙",
            text: `Created Makefile!`,
          });
        }
      }
      if (options.env) {
        progress.start("Creating .env file...");
        if (fs.existsSync(path.join(process.cwd(), ".env"))) {
          progress.fail(`Env already exists!`);
        } else {
          fs.writeFileSync(path.join(process.cwd(), ".env"), "");
          progress.stopAndPersist({
            symbol: "⚙️",
            text: `Created .env file!`,
          });
        }
      }
      switch (language) {
        case "typescript": {
          progress.start("Creating dockerfiles...");
          writeDockerfiles({
            ...typescript.dockerize(
              name.toLowerCase(),
              config != "none" ? config : ""
            ),
          });
          progress.stopAndPersist({
            symbol: "🐳",
            text: `Created ${kleur.bold(language)} dockerfiles!`,
          });
          if (scaffold) {
            const { index, pkg, tsconfig } = typescript.scaffold(name);
            progress.start("Creating src directory...");
            fs.mkdirSync(path.join(process.cwd(), "src"));
            progress.text = "Creating src/index.ts file...";
            fs.writeFileSync(
              path.join(process.cwd(), "src", "index.ts"),
              index
            );
            progress.text = "Creating package.json...";
            fs.writeFileSync(path.join(process.cwd(), "package.json"), pkg);
            progress.text = "Creating tsconfig.json...";
            fs.writeFileSync(
              path.join(process.cwd(), "tsconfig.json"),
              tsconfig
            );
            progress.stopAndPersist({
              symbol: "📒",
              text: `Scaffolded ${kleur.bold(language)} template!`,
            });
          }
          break;
        }
        case "javascript": {
          progress.start("Creating dockerfiles...");
          writeDockerfiles({
            ...javascript.dockerize(
              name.toLowerCase(),
              config != "none" ? config : ""
            ),
          });
          progress.stopAndPersist({
            symbol: "🐳",
            text: `Created ${kleur.bold(language)} dockerfiles!`,
          });
          if (scaffold) {
            const { index, pkg } = javascript.scaffold(name);
            progress.start("Creating src directory...");
            fs.mkdirSync(path.join(process.cwd(), "src"));
            progress.text = "Creating src/index.js file...";
            fs.writeFileSync(
              path.join(process.cwd(), "src", "index.js"),
              index
            );
            progress.text = "Creating package.json...";
            fs.writeFileSync(path.join(process.cwd(), "package.json"), pkg);
            progress.stopAndPersist({
              symbol: "📒",
              text: `Scaffolded ${kleur.bold(language)} template!`,
            });
          }
          break;
        }
        case "python": {
          progress.start("Creating dockerfiles...");
          writeDockerfiles({
            ...python.dockerize(
              name.toLowerCase(),
              config != "none" ? config : ""
            ),
          });
          progress.stopAndPersist({
            symbol: "🐳",
            text: `Created ${kleur.bold(language)} dockerfiles!`,
          });
          if (scaffold) {
            const { index } = python.scaffold(name);
            progress.start("Creating src directory...");
            fs.mkdirSync(path.join(process.cwd(), "src"));
            progress.text = "Creating src/index.py file...";
            fs.writeFileSync(
              path.join(process.cwd(), "src", "index.py"),
              index
            );
            progress.text = "Creating requirements.txt...";
            fs.writeFileSync(path.join(process.cwd(), "requirements.txt"), "");
            progress.stopAndPersist({
              symbol: "📒",
              text: `Scaffolded ${kleur.bold(language)} template!`,
            });
          }
          break;
        }
        case "golang": {
          progress.start("Creating dockerfiles...");
          writeDockerfiles({
            ...go.dockerize(name.toLowerCase(), config != "none" ? config : ""),
          });
          progress.stopAndPersist({
            symbol: "🐳",
            text: `Created ${kleur.bold(language)} dockerfiles!`,
          });
          if (scaffold) {
            const { main, mod } = go.scaffold(name);
            progress.start("Creating src directory...");
            fs.mkdirSync(path.join(process.cwd(), "src"));
            progress.text = "Creating src/main.go file...";
            fs.writeFileSync(path.join(process.cwd(), "src", "main.go"), main);
            progress.text = "Creating go.mod...";
            fs.writeFileSync(path.join(process.cwd(), "go.mod"), mod);
            progress.stopAndPersist({
              symbol: "📒",
              text: `Scaffolded ${kleur.bold(language)} template!`,
            });
          }
          break;
        }
        case "rust": {
          progress.start("Creating dockerfiles...");
          writeDockerfiles({
            ...rust.dockerize(
              name.toLowerCase(),
              config != "none" ? config : ""
            ),
          });
          progress.stopAndPersist({
            symbol: "🐳",
            text: `Created ${kleur.bold(language)} dockerfiles!`,
          });
          if (scaffold) {
            const { main, cargo } = rust.scaffold(name);
            progress.start("Creating src directory...");
            fs.mkdirSync(path.join(process.cwd(), "src"));
            progress.text = "Creating src/main.rs file...";
            fs.writeFileSync(path.join(process.cwd(), "src", "main.rs"), main);
            progress.text = "Creating Cargo.toml...";
            fs.writeFileSync(path.join(process.cwd(), "Cargo.toml"), cargo);
            progress.stopAndPersist({
              symbol: "📒",
              text: `Scaffolded ${kleur.bold(language)} template!`,
            });
          }
          break;
        }
      }
      progress.stopAndPersist({
        symbol: "🚀",
        text: `DockerForge complete!`,
      });
    });

  program.parse();
}

main();
