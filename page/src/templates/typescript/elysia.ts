import yaml from "yaml";

export function dockerize(name: string, config?: string) {
  let dockerfile: string[] = [];

  dockerfile.push("FROM oven/bun as development\n");

  dockerfile.push("RUN bun install -g nodemon\n");

  dockerfile.push("WORKDIR /app");
  dockerfile.push("COPY package.json /app/package.json");
  dockerfile.push("RUN bun install\n");

  if (config) dockerfile.push(`COPY config.${config} /app/config.${config}`);
  dockerfile.push("COPY tsconfig.json /app/tsconfig.json");
  dockerfile.push("COPY src /app/src");
  dockerfile.push("# More development build configurations here\n");

  dockerfile.push("FROM development as production\n");

  dockerfile.push("RUN rm -r /app/node_modules");
  dockerfile.push("RUN bun install --production");
  dockerfile.push("# More production build configurations here");

  return {
    env: "FOO=bar\nBAZ=bob",
    scaffold: {
      source: {
        name: "index.ts",
        content: `import { Elysia } from 'elysia'\n\nnew Elysia()\n\t.get('/', () => 'Hello Elysia')\n\t.get('/user/:id', ({ params: { id }}) => id)\n\t.post('/form', ({ body }) => body)\n\t.listen(3000)`,
      },
      manager: {
        name: "package.json",
        content: JSON.stringify(
          {
            name: name,
            version: "1.0.0",
            author: "",
            license: "",
            main: "src/index.ts",
            dependencies: {
              elysia: "latest",
            },
            devDependencies: {
              "bun-types": "latest",
            },
            scripts: {
              dev: "bun --watch run src/index.ts",
              start: "bun run src/index.ts",
            },
          },
          null,
          2
        ),
      },
      config: {
        name: "tsconfig.json",
        content: JSON.stringify(
          {
            compilerOptions: {
              target: "ES2021",
              module: "ES2022",
              moduleResolution: "node",
              noImplicitAny: false,
              removeComments: true,
              skipLibCheck: true,
              preserveConstEnums: true,
              sourceMap: true,
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              strict: true,
              types: ["bun-types"],
            },
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.spec.ts", "node_modules"],
          },
          null,
          2
        ),
      },
    },
    nodemon: "",
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
          command: "bun run dev",
          ports: ["3000:3000"],
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
          command: "bun run start",
          restart: "no",
        },
      },
    }),
  };
}

export function scaffold(name: string) {
  return {
    index: "console.log('Hello from Typescript!');",
    pkg: JSON.stringify(
      {
        name: name,
        version: "1.0.0",
        author: "",
        license: "",
        main: "src/index.ts",
        dependencies: {},
        devDependencies: {
          typescript: "^5.4.2",
          rimraf: "^5.0.5",
          "ts-node": "^10.9.2",
        },
        scripts: {
          build: "rimraf dist && tsc",
          start: "node dist/index.js",
        },
      },
      null,
      2
    ),
    tsconfig: JSON.stringify(
      {
        compilerOptions: {
          target: "es6",
          module: "commonjs",
          moduleResolution: "node",
          noImplicitAny: false,
          removeComments: true,
          preserveConstEnums: true,
          sourceMap: true,
          forceConsistentCasingInFileNames: true,
          outDir: "dist",
          declaration: true,
        },
        include: ["src/**/*.ts"],
        exclude: ["src/**/*.spec.ts", "node_modules"],
      },
      null,
      2
    ),
  };
}
