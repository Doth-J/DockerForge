import { Element } from "react-scroll";
import { useSetup } from "../providers/SetupProvider";
import { Templates, Languages } from "../hooks/useLanguage";
import * as templates from "../templates";
export default function Setup() {
  const [state, setup] = useSetup();
  return (
    <Element name="setup" id="setup" className="flex w-full gap-2 flex-col p-1">
      <h1 className="text-2xl py-1 bg-slate-400/[.5] w-full rounded-md shadow-lg">
        ⚙️ Setup
      </h1>
      <div className="grid grid-cols-6 rounded-md bg-slate-800/[.3] border-slate-300/[.75] border-[1px] sm:text-xl">
        <label
          htmlFor="name"
          className="flex flex-col col-span-6 sm:col-span-2 gap-2 sm:border-r-[1px] w-full border-b-[1px] border-slate-400/[.75] p-4 hover:bg-slate-500/[.75]"
        >
          Project Name:
          <input
            type="text"
            id="name"
            name="name"
            className="rounded-lg flex-grow p-1 border-[1px] text-center"
            placeholder="Name"
            defaultValue={state.name}
            onChange={(e) =>
              setup({ type: "setup_name", name: e.target.value })
            }
          />
          <p className="text-xs sm:text-sm">
            &bull; <u>Description</u>: Specify the name of the project.
          </p>
        </label>
        <label
          htmlFor="author"
          className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full border-b-[1px] border-slate-400/[.75] p-4  sm:border-r-[1px] hover:bg-slate-500/[.75]"
        >
          Project Author:
          <input
            type="text"
            id="author"
            name="author"
            className="rounded-lg flex-grow p-1 border-[1px] text-center"
            placeholder="Developer X"
            defaultValue={state.author}
            onChange={(e) =>
              setup({ type: "setup_author", author: e.target.value })
            }
          />
          <p className="text-xs sm:text-sm">
            &bull; <u>Description</u>: Specify the author of the project.
          </p>
        </label>
        <label
          htmlFor="license"
          className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full border-b-[1px] border-slate-400/[.75] p-4 hover:bg-slate-500/[.75]"
        >
          <div className="w-full flex gap-2 justify-between">
            Project License:
            <a
              target="_blank"
              href="https://choosealicense.com/"
              className="rounded-full bg-slate-700 hover:bg-slate-600 px-2 border-[1px]"
            >
              ?
            </a>
          </div>
          <select
            className="rounded-lg flex-grow p-1 border-[1px] text-center"
            name="license"
            id="license"
            defaultValue={state.license}
            onChange={(e) =>
              setup({ type: "setup_license", license: e.target.value })
            }
          >
            <option value="">None</option>
            <option value="MIT">MIT License</option>
            <option value="Apache-2.0">Apache License 2.0</option>
            <option value="GPLv3">GNU General Public License (GPL) v3</option>
            <option value="MPL-2.0">Mozilla Public License 2.0</option>
            <option value="BSD-3">BSD 3-Clause License</option>
          </select>
          <p className="text-xs sm:text-sm">
            &bull; <u>Description</u>: Specify the license of the project.
          </p>
        </label>
        <label
          htmlFor="language"
          className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full border-r-[1px] p-4 border-b-[1px] border-slate-400/[.75] hover:bg-slate-500/[.75]"
        >
          Programming Language:
          <select
            name="language"
            id="language"
            defaultValue={state.language}
            onChange={(e) =>
              setup({
                type: "setup_language",
                language: e.target.value as Languages,
              })
            }
            className="rounded-lg p-1 border-[1px] text-center"
          >
            <option value="javascript">Javascript</option>
            <option value="typescript">Typescript</option>
            <option value="python">Python</option>
            <option value="golang">Golang</option>
            <option value="rust">Rust</option>
          </select>
          <p className="text-xs sm:text-sm">
            &bull; <u>Description</u>: Specify the project's programming
            language.
          </p>
        </label>
        <label
          htmlFor="scaffold"
          className={`flex gap-4 border-b-[1px] border-slate-400/[.75] col-span-6 sm:col-span-2 hover:bg-slate-500/[.75] w-full justify-between hover:cursor-pointer items-center sm:border-r-[1px] active:bg-slate-500 ${state.scaffold ? "bg-slate-600/[.75] p-2" : "p-2"}`}
        >
          <div className="flex-grow flex flex-col gap-2 justify-center h-full">
            Scaffold Template Project?
            {state.scaffold && (
              <select
                name="template"
                id="template"
                className="rounded-lg border-[1px] text-center p-1"
                defaultValue={state.language}
                onChange={(e) =>
                  setup({
                    type: "setup_template",
                    template: e.target.value as Templates,
                  })
                }
              >
                {Object.keys(templates[state.language]).map(
                  (templateName, i) => (
                    <option key={i} value={templateName}>
                      {templateName}
                    </option>
                  )
                )}
              </select>
            )}
            <p className="text-xs sm:text-sm">
              &bull; <u>Description</u>: Scaffold a template language project.
            </p>
          </div>
          <input
            onChange={(e) =>
              setup({
                type: "setup_scaffold",
                scaffold: e.target.checked,
                template: "basic",
              })
            }
            type="checkbox"
            id="scaffold"
            name="scaffold"
            className="rounded-lg text-center scale-150 accent-emerald-600 mr-1"
          />
        </label>
        <label
          htmlFor="configuration"
          className="flex flex-col col-span-6 sm:col-span-2 gap-2 w-full p-4 border-b-[1px] border-slate-400/[.75] hover:bg-slate-500/[.75]"
        >
          Configuration File:
          <select
            name="configuration"
            id="configuration"
            defaultValue={state.config}
            onChange={(e) =>
              setup({ type: "setup_config", config: e.target.value })
            }
            className="rounded-lg p-1 border-[1px] text-center"
          >
            <option value="">None</option>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="toml">TOML</option>
            <option value="ini">INI</option>
          </select>
          <p className="text-xs sm:text-sm">
            &bull; <u>Description</u>: Specify the project's configuration file
            format.
          </p>
        </label>
        <label
          htmlFor="env"
          className={`flex gap-2 max-sm:border-b-[1px] border-slate-400/[.75] p-4 col-span-6 sm:col-span-3 hover:bg-slate-500/[.75] w-full justify-between hover:cursor-pointer sm:border-r-[1px] active:bg-slate-500 items-start ${state.env && "bg-slate-600/[.75]"}`}
        >
          <div className="flex-grow flex flex-col gap-1">
            Include Env File?
            <p className="text-xs sm:text-sm">
              &bull; <u>Description</u>: Include an.env file for the project.
            </p>
          </div>
          <input
            onChange={(e) =>
              setup({ type: "setup_env", env: e.target.checked })
            }
            type="checkbox"
            id="env"
            name="env"
            className="rounded-lg text-center scale-150 accent-emerald-600 mr-1"
          />
        </label>
        <label
          htmlFor="makefile"
          className={`flex gap-2 max-sm:border-b-[1px] border-slate-400/[.75] p-4 col-span-6 sm:col-span-3 hover:bg-slate-500/[.75] w-full justify-between hover:cursor-pointer active:bg-slate-500 items-start ${state.makefile && "bg-slate-600/[.75]"}`}
        >
          <div className="flex-grow flex flex-col gap-1">
            Include Makefile?
            <p className="text-xs sm:text-sm">
              &bull; <u>Description</u>: Include a makefile for the project.
            </p>
          </div>
          <input
            onChange={(e) =>
              setup({ type: "setup_makefile", makefile: e.target.checked })
            }
            type="checkbox"
            id="makefile"
            name="makefile"
            className="rounded-lg text-center scale-150 accent-emerald-600 mr-1"
          />
        </label>
      </div>
    </Element>
  );
}
