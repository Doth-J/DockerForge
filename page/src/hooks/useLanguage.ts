import * as templates from "../templates";

export type Templates = "basic";
export type Languages =
  | "javascript"
  | "typescript"
  | "rust"
  | "python"
  | "golang";

export default function useLanguage(
  language: Languages,
  template: Templates,
  name: string,
  config: string,
  author: string,
  license: string
) {
  const templateModule = templates[language][template];
  if (templateModule && typeof templateModule.dockerize === "function") {
    return templateModule.dockerize(name, config, author, license);
  } else {
    throw new Error(
      `Template or method not found for language: ${language}, template: ${template}`
    );
  }
}
