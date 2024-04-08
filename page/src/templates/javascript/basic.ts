import yaml from "yaml";

export function dockerize(
  name: string,
  config: string,
  author?: string,
  license?: string
) {
  let dockerfile: string[] = [];

  dockerfile.push("FROM node:lts-alpine as development\n");

  dockerfile.push("RUN npm install -g nodemon\n");
  dockerfile.push("WORKDIR /app");
  dockerfile.push("COPY package.json /app/package.json");
  dockerfile.push("RUN npm install\n");

  if (config) dockerfile.push(`COPY config.${config} app/config.${config}`);
  dockerfile.push("COPY src /app/src");
  dockerfile.push("COPY nodemon.json /app/nodemon.json\n");

  dockerfile.push("# More development build configurations here\n");

  dockerfile.push("FROM development as production\n");

  dockerfile.push("RUN -r rm /app/node_modules");
  dockerfile.push("RUN npm install --omit=dev");
  dockerfile.push("# More production build configurations here");

  return {
    env: "FOO=bar\nBAZ=bob",
    scaffold: {
      source: {
        name: "index.js",
        content: "console.log('Hello from NodeJS!');",
      },
      manager: {
        name: "package.json",
        content: JSON.stringify(
          {
            name: name,
            version: "0.0.1",
            author: author ?? "",
            license: license ?? "",
            main: "src/index.js",
            dependencies: {},
            devDependencies: {
              nodemon: "^1.3.3",
            },
            tags: ["dockerforged"],
            scripts: {
              start: "node src/index.js",
            },
          },
          null,
          2
        ),
      },
    },
    nodemon: JSON.stringify(
      {
        watch: config ? ["src", "config." + config] : ["src"],
        ext: ".js",
        ignore: [],
        exec: "node ./src/index.js",
      },
      null,
      1
    ),
    dockerfile: dockerfile.join("\n"),
    compose_dev: yaml.stringify({
      version: "3.9",
      services: {
        app: {
          container_name: name,
          build: {
            context: ".",
            target: "development",
          },
          command: "nodemon",
          volumes: config
            ? ["./src:/app/src", `./config.${config}:/app/config.${config}`]
            : ["./src:/app/src"],
          restart: "unless-stopped",
        },
      },
    }),
    compose_prod: yaml.stringify({
      version: "3.9",
      services: {
        app: {
          container_name: name,
          build: {
            context: ".",
            target: "production",
          },
          command: "npm start",
          restart: "no",
        },
      },
    }),
  };
}
