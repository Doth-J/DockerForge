import { Element } from "react-scroll";
export default function HowTo() {
  return (
    <Element name="howto" id="howto" className="flex w-full gap-2 flex-col p-1">
      <h1 className="text-2xl py-1 bg-slate-400/[.5] w-full rounded-lg shadow-lg">
        ⚡ How To Use
      </h1>
      <div className="w-full bg-slate-800/[.3] p-2 rounded-lg border-slate-300/[.75] border-[1px]">
        <p className="sm:text-xl">
          To get started with DockerForge, follow these steps:
          <ol className="flex flex-col p-2 gap-2 text-base">
            <li>
              1) <u>Project Setup</u>: Enter your project's details, including
              name, author, license and the programming language of your choice.
            </li>
            <li>
              2) <u>Configuration</u>: Choose if you want to scaffold a template
              project, have a configuration and also include essential files
              such as .env and Makefile.
            </li>
            <li>
              3) <u>Customization</u>: You can edit the generated Docker and
              Compose files within the Forge editor to your liking.
            </li>
            <li>
              4) <u>Forge</u>: Once configured, click on the Forge button to
              download a zip of the configured project. You can also download
              each file individually by clicking on their Download button.
            </li>
          </ol>
        </p>
      </div>
    </Element>
  );
}
