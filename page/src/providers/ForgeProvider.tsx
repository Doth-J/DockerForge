import React, { ReactNode, createContext, useContext, useReducer } from "react";

export type ScaffoldTemplate = {
  source: {
    name: string;
    content: string;
  };
  manager: {
    name: string;
    content: string;
  };
  config?: {
    name: string;
    content: string;
  };
};

export type ForgeState = {
  dockerfile: string;
  compose_dev: string;
  compose: string;
  nodemon: string;
  config: string;
  env: string;
  makefile: string;
  scaffold: ScaffoldTemplate;
};

export type SetLanguage = {
  type: "set_language";
  dockerfile: string;
  compose_dev: string;
  compose: string;
  nodemon: string;
  env: string;
  makefile: string;
  scaffold: ScaffoldTemplate;
};
export type EditDockerfile = {
  type: "edit_dockerfile";
  dockerfile: string;
};
export type EditComposeDev = {
  type: "edit_compose_dev";
  compose_dev: string;
};
export type EditCompose = {
  type: "edit_compose";
  compose: string;
};
export type EditConfig = {
  type: "edit_config";
  config: string;
};
export type EditEnv = {
  type: "edit_env";
  env: string;
};
export type EditMakefile = {
  type: "edit_makefile";
  makefile: string;
};
export type EditSource = {
  type: "edit_source";
  source: string;
};
export type EditManager = {
  type: "edit_manager";
  manager: string;
};

export type ForgeActions =
  | SetLanguage
  | EditDockerfile
  | EditComposeDev
  | EditCompose
  | EditConfig
  | EditEnv
  | EditMakefile
  | EditSource
  | EditManager;

export function ForgeReducer(state: ForgeState, action: ForgeActions) {
  switch (action.type) {
    case "set_language":
      return {
        ...state,
        dockerfile: action.dockerfile,
        compose_dev: action.compose_dev,
        compose: action.compose,
        env: action.env,
        nodemon: action.nodemon,
        makefile: action.makefile,
        scaffold: action.scaffold,
      };
    case "edit_dockerfile":
      return {
        ...state,
        dockerfile: action.dockerfile,
      };
    case "edit_compose_dev":
      return {
        ...state,
        compose_dev: action.compose_dev,
      };
    case "edit_compose":
      return {
        ...state,
        compose: action.compose,
      };
    case "edit_config":
      return {
        ...state,
        config: action.config,
      };
    case "edit_env":
      return {
        ...state,
        env: action.env,
      };
    case "edit_makefile":
      return {
        ...state,
        makefile: action.makefile,
      };
    case "edit_source":
      return {
        ...state,
        scaffold: {
          ...state.scaffold,
          source: {
            ...state.scaffold.source,
            content: action.source,
          },
        },
      };
    case "edit_manager":
      return {
        ...state,
        scaffold: {
          ...state.scaffold,
          manager: {
            ...state.scaffold.manager,
            content: action.manager,
          },
        },
      };
    default:
      return state;
  }
}

export const ForgeContext = createContext<
  [ForgeState, React.Dispatch<ForgeActions>] | undefined
>(undefined);

export function useForge() {
  const Forge = useContext(ForgeContext);
  if (!Forge) throw new Error("useForge must be used within a ForgeProvider");
  return Forge;
}

export default function ForgeProvider({ children }: { children: ReactNode }) {
  const initial: ForgeState = {
    dockerfile: "",
    compose_dev: "",
    compose: "",
    nodemon: "",
    config: "",
    env: "",
    makefile: "",
    scaffold: {
      source: {
        name: "",
        content: "",
      },
      manager: {
        name: "",
        content: "",
      },
    },
  };
  const [Forge, dispatch] = useReducer(ForgeReducer, initial);

  return (
    <ForgeContext.Provider value={[Forge, dispatch]}>
      {children}
    </ForgeContext.Provider>
  );
}
