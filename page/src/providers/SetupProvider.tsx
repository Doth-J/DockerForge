import React, { ReactNode, createContext, useContext, useReducer } from "react";
import { Templates, Languages } from "../hooks/useLanguage";

export type SetupState = {
  name: string;
  author: string;
  license: string;
  language: Languages;
  template: Templates;
  config: string;
  env: boolean;
  makefile: boolean;
  scaffold: boolean;
};

export type SetupName = {
  type: "setup_name";
  name: string;
};
export type SetupAuthor = {
  type: "setup_author";
  author: string;
};
export type SetupLicense = {
  type: "setup_license";
  license: string;
};
export type SetupLanguage = {
  type: "setup_language";
  language: Languages;
  template: Templates;
};
export type SetupTemplate = {
  type: "setup_template";
  template: Templates;
};
export type SetupConfig = {
  type: "setup_config";
  config: string;
};
export type SetupEnv = {
  type: "setup_env";
  env: boolean;
};
export type SetupMakefile = {
  type: "setup_makefile";
  makefile: boolean;
};
export type SetupScaffold = {
  type: "setup_scaffold";
  scaffold: boolean;
  template: Templates;
};

export type SetupActions =
  | SetupName
  | SetupAuthor
  | SetupLicense
  | SetupLanguage
  | SetupConfig
  | SetupEnv
  | SetupMakefile
  | SetupScaffold
  | SetupTemplate;

export function SetupReducer(state: SetupState, action: SetupActions) {
  switch (action.type) {
    case "setup_name":
      return {
        ...state,
        name: action.name,
      };
    case "setup_author":
      return {
        ...state,
        author: action.author,
      };
    case "setup_license":
      return {
        ...state,
        license: action.license,
      };
    case "setup_language":
      return {
        ...state,
        template: action.template,
        language: action.language,
      };
    case "setup_config":
      return {
        ...state,
        config: action.config,
      };
    case "setup_env":
      return {
        ...state,
        env: action.env,
      };
    case "setup_makefile":
      return {
        ...state,
        makefile: action.makefile,
      };
    case "setup_scaffold":
      return {
        ...state,
        template: action.template,
        scaffold: action.scaffold,
      };
    case "setup_template":
      return {
        ...state,
        template: action.template,
      };
    default:
      return state;
  }
}

export const SetupContext = createContext<
  [SetupState, React.Dispatch<SetupActions>] | undefined
>(undefined);

export function useSetup() {
  const setup = useContext(SetupContext);
  if (!setup) throw new Error("useSetup must be used within a SetupProvider");
  return setup;
}

export default function SetupProvider({ children }: { children: ReactNode }) {
  const initialSetup: SetupState = {
    name: "project-X",
    author: "",
    license: "",
    language: "javascript",
    config: "",
    env: false,
    makefile: false,
    scaffold: false,
    template: "basic",
  };
  const [setup, dispatch] = useReducer(SetupReducer, initialSetup);

  return (
    <SetupContext.Provider value={[setup, dispatch]}>
      {children}
    </SetupContext.Provider>
  );
}
