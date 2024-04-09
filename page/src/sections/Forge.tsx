import { Element } from "react-scroll";
import CodeBox from "../components/Codebox";
import { useSetup } from "../providers/SetupProvider";
import { TreeDirectory, TreeFile, TreeSource } from "../components/Treeviewer";
import { BsFiletypeJson } from "react-icons/bs";
import { useEffect } from "react";
import { useForge } from "../providers/ForgeProvider";
import useLanguage from "../hooks/useLanguage";
import JSZip from "jszip";
export default function Forge() {
  const [setup] = useSetup();
  const [forge, dispatch] = useForge();

  function writeConfig(config: string) {
    switch (config) {
      case "yaml":
        return "setup:\n  param: 123";
      case "ini":
      case "toml":
        return "[setup]\nparam=123";
      default:
        return JSON.stringify({ setup: { param: 123 } }, null, 2);
    }
  }

  function writeMakefile(name: string, language: string) {
    let appname = name.toLowerCase(),
      makefileContent = "start:\n\tdocker-compose up -d\n";
    makefileContent += "stop:\n\tdocker-compose down -v\n";
    makefileContent += `logs:\n\tdocker logs ${appname}-app\n`;
    makefileContent += `build:\n\tdocker build -t ${appname}-app .\n`;
    makefileContent += `remove:\n\tdocker image rm ${appname}-app\n`;
    makefileContent += "update:\n\tmake stop\n\tmake remove\n\tmake start\n";
    makefileContent +=
      "production:\n\tdocker-compose -f docker-compose.yaml -f docker-compose.production.yaml up -d\n";
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
    return makefileContent;
  }

  useEffect(() => {
    const lang = useLanguage(
      setup.language,
      setup.template,
      setup.name.toLowerCase().replace(" ", "_").replace("-", "_"),
      setup.config,
      setup.author,
      setup.license
    );
    if (lang) {
      dispatch({
        type: "set_language",
        dockerfile: lang.dockerfile,
        compose_dev: lang.compose_dev,
        compose: lang.compose_prod,
        nodemon: lang.nodemon,
        env: lang.env,
        scaffold: lang.scaffold,
        makefile: writeMakefile(setup.name, setup.language),
      });
    }
  }, [setup]);

  return (
    <Element name="forge" id="forge" className="flex w-full gap-2 flex-col p-1">
      <h1 className="text-2xl py-1 bg-slate-400/[.5] w-full rounded-md shadow-lg">
        🛠️ Forge
      </h1>
      <div className="w-full grid grid-cols-6 gap-2">
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-[6px] bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-xl">
          <CodeBox
            title="Dockerfile"
            value={forge.dockerfile}
            icon="assets/docker.svg"
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(dockerfile) =>
              dispatch({ type: "edit_dockerfile", dockerfile })
            }
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <CodeBox
            title="Compose Dev"
            icon="assets/compose_dev.svg"
            subtitle="docker-compose.yaml"
            value={forge.compose_dev}
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(compose_dev) =>
              dispatch({ type: "edit_compose_dev", compose_dev })
            }
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <CodeBox
            title="Compose Prod"
            icon="assets/compose.svg"
            subtitle="docker-compose.production.yaml"
            value={forge.compose}
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(compose) => dispatch({ type: "edit_compose", compose })}
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <CodeBox
            title="Source"
            icon="assets/source.svg"
            disabled={!setup.scaffold}
            subtitle={!setup.scaffold ? "" : forge.scaffold.source.name}
            value={forge.scaffold.source.content}
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(source) => dispatch({ type: "edit_source", source })}
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <CodeBox
            title="Manager"
            icon="assets/manager.svg"
            subtitle={!setup.scaffold ? "" : forge.scaffold.manager.name}
            value={forge.scaffold.manager.content}
            disabled={!setup.scaffold}
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(manager) => dispatch({ type: "edit_manager", manager })}
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <CodeBox
            title="Config"
            subtitle={setup.config == "" ? "" : "config." + setup.config}
            icon="assets/config.svg"
            disabled={setup.config == ""}
            value={writeConfig(setup.config)}
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(config) => dispatch({ type: "edit_config", config })}
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <CodeBox
            title="Enviromental"
            icon="assets/env.svg"
            disabled={!setup.env}
            subtitle={!setup.env ? "" : ".env"}
            value={forge.env}
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(env) => dispatch({ type: "edit_env", env })}
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-xl p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <CodeBox
            title="Makefile"
            icon="assets/makefile.svg"
            disabled={!setup.makefile}
            subtitle={!setup.makefile ? "" : "Makefile"}
            value={forge.makefile}
            className="h-[400px] scroller resize-none bg-[#3b3b3b]/[.9] p-2 rounded-md text-white"
            action={(makefile) => dispatch({ type: "edit_makefile", makefile })}
          />
        </div>
        <div className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full text-[16px] p-2 bg-slate-800/[.3] border-slate-300/[.75] border-[1px] rounded-md">
          <h1 className="flex w-full text-2xl gap-2  rounded-lg p-2">
            <img src={"controls/folder.svg"} alt="CodeBoxIcon" width={"25px"} />
            {setup.name ? setup.name : "Project"}
          </h1>
          <div className="flex flex-col gap-2 bg-[#3b3b3b]/[.9] p-2 rounded-md flex-grow">
            {setup.scaffold && (
              <TreeDirectory name="src">
                {setup.language == "javascript" && (
                  <TreeSource name="index" language={setup.language} />
                )}
                {setup.language == "typescript" && (
                  <TreeSource name="index" language={setup.language} />
                )}
                {setup.language == "python" && (
                  <TreeSource name="index" language={setup.language} />
                )}
                {setup.language == "golang" && (
                  <TreeSource name="main" language={setup.language} />
                )}
                {setup.language == "rust" && (
                  <TreeSource name="main" language={setup.language} />
                )}
              </TreeDirectory>
            )}
            {setup.scaffold &&
              (setup.language == "javascript" ||
                setup.language == "typescript") && (
                <TreeFile
                  name={"package.json"}
                  icon={<img src="assets/manager.svg" width={15} />}
                />
              )}
            {setup.scaffold && setup.language == "typescript" && (
              <TreeFile name={"tsconfig.json"} icon={<BsFiletypeJson />} />
            )}
            {setup.scaffold && setup.language == "python" && (
              <TreeFile
                name={"requirements.txt"}
                icon={<img src="assets/manager.svg" width={15} />}
              />
            )}
            {setup.scaffold && setup.language == "golang" && (
              <TreeFile
                name={"go.mod"}
                icon={<img src="assets/manager.svg" width={15} />}
              />
            )}
            {setup.scaffold && setup.language == "rust" && (
              <TreeFile
                name={"Cargo.toml"}
                icon={<img src="assets/manager.svg" width={15} />}
              />
            )}
            {setup.config != "" && (
              <TreeFile
                name={"config." + setup.config}
                icon={<img src="assets/config.svg" width={15} />}
              />
            )}
            {setup.env && (
              <TreeFile
                name=".env"
                icon={<img src="assets/env.svg" width={15} />}
              />
            )}
            {setup.makefile && (
              <TreeFile
                name="Makefile"
                icon={<img src="assets/makefile.svg" width={15} />}
              />
            )}
            {forge.nodemon != "" && (
              <TreeFile name={"nodemon.json"} icon={<BsFiletypeJson />} />
            )}
            <TreeFile
              name={"Dockerfile"}
              icon={<img src="assets/docker.svg" width={15} />}
            />
            <TreeFile
              name={"docker-compose.yaml"}
              icon={<img src="assets/compose_dev.svg" width={15} />}
            />
            <TreeFile
              name={"docker-compose.production.yaml"}
              icon={<img src="assets/compose.svg" width={15} />}
            />
          </div>
          <button
            className="bg-amber-600/[.5] rounded-md p-2 hover:bg-amber-600 active:bg-amber-500 tex-md sm:text-xl items-center flex gap-2 justify-center mt-auto"
            title="Forge"
            onClick={async () => {
              let audio = new Audio("assets/forge.wav");
              audio.volume = 0.25;
              try {
                const zip = new JSZip();
                let project = setup.name ? zip.folder(setup.name) : zip;
                if (project) {
                  project.file("Dockerfile", forge.dockerfile);
                  project.file("docker-compose.yaml", forge.compose_dev);
                  project.file("docker-compose.production.yaml", forge.compose);
                  if (forge.nodemon != "")
                    project.file("nodemon.json", forge.nodemon);
                  if (setup.scaffold) {
                    const src = project.folder("src");
                    src?.file(
                      forge.scaffold.source.name,
                      forge.scaffold.source.content
                    );
                    project.file(
                      forge.scaffold.manager.name,
                      forge.scaffold.manager.content
                    );
                    if (forge.scaffold.config) {
                      project.file(
                        forge.scaffold.config.name,
                        forge.scaffold.config.content
                      );
                    }
                  }
                  if (setup.config)
                    project.file("config." + setup.config, forge.config);
                  if (setup.env) project.file(".env", forge.env);
                  if (setup.makefile) project.file("Makefile", forge.makefile);
                  const zipData = await zip.generateAsync({
                    type: "blob",
                    streamFiles: true,
                  });
                  const link = document.createElement("a");
                  link.href = window.URL.createObjectURL(zipData);
                  link.download = "project.zip";
                  link.click();
                  audio.play();
                }
              } catch (e) {
                console.log("Failed to ZIP project");
              }
            }}
          >
            Forge
            <img
              src="controls/forge.svg"
              alt="ForgeIcon"
              className="sm:w-[25px] w-[15px]"
            />
          </button>
        </div>
      </div>
    </Element>
  );
}
