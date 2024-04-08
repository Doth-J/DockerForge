import { Element } from "react-scroll";
export default function Intro() {
  return (
    <Element name="intro" id="intro" className="flex w-full gap-2 flex-col p-1">
      <h1 className="text-2xl py-1 bg-slate-400/[.5] w-full rounded-lg shadow-lg">
        🔥 Introduction
      </h1>
      <div className="w-full bg-slate-800/[.3] p-2 rounded-lg border-slate-300/[.75] border-[1px]">
        <p className="text-justify sm:text-xl">
          DockerForge is a suite that aims to empower developers by generating
          seamless integrations and template scaffolds of dockerized projects.
          Envisioned as an extensible platform for the various development
          phases of applications, DockerForge utlizes the powerful{" "}
          <a
            href="https://www.npmjs.com/package/nodemon"
            className=" text-yellow-500"
          >
            nodemon
          </a>{" "}
          module to create docker definitions for your project. Essentialy, it
          assists in the dockerization process of a project through an intuitive
          interface, handling the creation of Dockerfile, docker-compose, and
          docker-compose.production files. To simplify the complex dockerization
          operations, DockerForge uses a Makefile containing shortcut commands
          for interacting with Docker and Docker compose. This simplifies
          working on intricate services, managing container states, and
          monitoring the performance of distributed applications. Using
          DockerForge, you are able to scaffold reusable project templates for a
          smooth development experience in building robust scalable programming
          projects.
        </p>
      </div>
    </Element>
  );
}
