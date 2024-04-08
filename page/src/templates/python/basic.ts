import yaml from "yaml";

export function dockerize(
  name: string,
  config: string,
  author?: string,
  license?: string
) {
  let dockerfile: string[] = [];

  dockerfile.push("FROM python:3-alpine as development\n");

  dockerfile.push("RUN apk add --update npm");
  dockerfile.push("RUN npm install -g nodemon\n");
  dockerfile.push("WORKDIR /app");
  dockerfile.push("COPY requirements.txt /app/requirements.txt");
  dockerfile.push("RUN pip install -r requirements.txt\n");

  if (config) dockerfile.push(`COPY config.${config} app/config.${config}`);
  dockerfile.push("COPY src /app/src");
  dockerfile.push("COPY nodemon.json /app/nodemon.json\n");

  dockerfile.push("# More development build configurations here\n");

  dockerfile.push("FROM development as production\n");

  dockerfile.push("# More production build configurations here");

  return {
    env: "FOO=bar\nBAZ=bob",
    scaffold: {
      source: { name: "index.py", content: "print('Hello from Python!');" },
      manager: { name: "requirements.txt", content: "" },
    },
    nodemon: JSON.stringify(
      {
        watch: config ? ["src", "config." + config] : ["src"],
        ext: ".py",
        ignore: [],
        exec: "python3 ./src/index.py",
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
          command: "python3 /app/src/index.py",
          restart: "no",
        },
      },
    }),
  };
}
