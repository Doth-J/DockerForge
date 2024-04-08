import {
  BiLogoTypescript,
  BiLogoJavascript,
  BiLogoPython,
  BiLogoGoLang,
} from "react-icons/bi";
import { FaRust, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import React, { useState } from "react";

type DirectoryProps = {
  name: string;
  className?: string;
  children?: React.ReactNode;
};

export function TreeDirectory({ name, className, children }: DirectoryProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <div className={"flex flex-col gap-2 " + className}>
      <h1
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? (
          <FaRegFolderOpen color="e8a87c" className="icon" />
        ) : (
          <FaRegFolder color="e8a87c" className="icon" />
        )}
        {name}
      </h1>
      {isOpen && <div className="w-full pl-4">{children}</div>}
    </div>
  );
}

type FileProps = {
  name: string;
  icon: React.ReactNode;
  className?: string;
};
export function TreeFile({ name, className, icon }: FileProps) {
  return (
    <div className={"flex items-center gap-2 " + className}>
      {icon} {name}
    </div>
  );
}

type SourceProps = {
  name: string;
  className?: string;
  language?: string;
};
export function TreeSource({ name, className, language }: SourceProps) {
  let icon, ext;
  switch (language) {
    case "javascript": {
      icon = <BiLogoJavascript />;
      ext = ".js";
      break;
    }
    case "typescript": {
      icon = <BiLogoTypescript />;
      ext = ".ts";
      break;
    }
    case "python": {
      icon = <BiLogoPython />;
      ext = ".py";
      break;
    }
    case "golang": {
      icon = <BiLogoGoLang />;
      ext = ".go";
      break;
    }
    case "rust": {
      icon = <FaRust />;
      ext = ".rs";
      break;
    }
  }
  return (
    <div className={"flex items-center gap-2 " + className}>
      {icon} {name + ext}
    </div>
  );
}
