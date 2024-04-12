import { Link, Events, scrollSpy } from "react-scroll";
import { useEffect, useState } from "react";
import { useMenu } from "../providers/MenuProvider";

export default function Sidebar() {
  const [menu, setMenu] = useMenu();
  const [scrolling, setScrolling] = useState<boolean>(false);
  useEffect(() => {
    Events.scrollEvent.register("begin", function (to) {
      setMenu(to);
      setScrolling(true);
      setTimeout(() => setScrolling(false), 400);
    });

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
    };
  }, []);

  return (
    <div className="w-full h-[100vh] flex flex-col bg-slate-800/[.75] px-2 py-4 gap-2 border-r-[2px] border-r-slate-100/[.1]">
      <img src="assets/dockerforge.png" alt="HeaderLogo" className="w-full" />
      <div className="flex flex-col gap-4 items-end sm:text-3xl my-1">
        <Link
          to="intro"
          containerId="content"
          smooth={true}
          spy={true}
          onClick={() => setMenu("intro")}
          onSetActive={() => {
            if (!scrolling) setMenu("intro");
          }}
          duration={400}
          className="w-full hover:bg-slate-300 hover:text-black rounded-xl text-center px-2 hover:shadow-md hover:cursor-pointer"
        >
          {menu === "intro" && <span>&bull; </span>}
          Intro
        </Link>
        <Link
          to="howto"
          containerId="content"
          spy={true}
          onClick={() => setMenu("howto")}
          onSetActive={() => {
            if (!scrolling) setMenu("howto");
          }}
          smooth={true}
          duration={400}
          className="w-full hover:bg-slate-300 hover:text-black rounded-xl text-center px-2 hover:shadow-md hover:cursor-pointer"
        >
          {menu === "howto" && <span>&bull; </span>}
          How
        </Link>
        <Link
          to="setup"
          containerId="content"
          spy={true}
          onClick={() => setMenu("setup")}
          onSetActive={() => {
            if (!scrolling) setMenu("setup");
          }}
          smooth={true}
          duration={400}
          className="w-full hover:bg-slate-300 hover:text-black rounded-xl text-center px-2 hover:shadow-md hover:cursor-pointer"
        >
          {menu === "setup" && <span>&bull; </span>}
          Setup
        </Link>
        <Link
          to="forge"
          onClick={() => setMenu("forge")}
          onSetActive={() => {
            if (!scrolling) setMenu("forge");
          }}
          containerId="content"
          spy={true}
          smooth={true}
          duration={400}
          className="w-full hover:bg-slate-300 hover:text-black rounded-xl text-center px-2 hover:shadow-md hover:cursor-pointer"
        >
          {menu === "forge" && <span>&bull; </span>}
          Forge
        </Link>
      </div>
      <div className="mt-auto w-full flex flex-col gap-2">
        <p className="md:text-2xl w-full flex justify-center">v.1.0.0</p>
        <a
          href="https://github.com/Doth-J/DockerForge"
          target="_blank"
          className="w-full flex items-center justify-center sm:justify-start bg-sky-600/[.5] rounded-xl p-1 shadow-sm hover:bg-sky-600 active:bg-sky-500"
        >
          <img
            src="assets/github.svg"
            alt="GitHubLogo"
            className="flex-shrink pl-1 w-[30px]"
          />
          <h2 className="flex-grow text-center text-xl text-slate-100 hover:text-slate-50 hidden sm:block">
            DockerForge
          </h2>
        </a>
        <a
          href="https://www.npmjs.com/package/dockerforged"
          target="_blank"
          className="w-full flex items-center justify-center sm:justify-start bg-sky-600/[.5] rounded-xl p-1 shadow-sm hover:bg-sky-600"
        >
          <img
            src="assets/npm.png"
            alt="HeaderLogo"
            className="flex-shrink pl-1 w-[60px] sm:w-[30px]"
          />
          <h2 className="flex-grow text-center text-xl text-slate-100 hover:text-slate-50 hidden sm:block">
            dockerforged
          </h2>
        </a>
        <a
          href="https://github.com/Doth-J"
          target="_blank"
          className="w-full flex items-center justify-center sm:justify-start bg-sky-600/[.5] rounded-xl p-1 shadow-sm hover:bg-sky-600 active:bg-sky-500"
        >
          <img
            src="https://avatars.githubusercontent.com/u/70350121?v=4"
            alt="GitHubUser"
            className="flex-shrink pl-1 w-[30px]"
          />
          <h2 className="flex-grow text-center text-xl text-slate-100 hover:text-slate-50 hidden sm:block">
            Doth-J
          </h2>
        </a>
      </div>
    </div>
  );
}
