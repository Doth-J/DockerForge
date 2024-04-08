import { useRef } from "react";

export type CodeBoxParams = {
  title: string;
  subtitle?: string;
  icon: string;
  value: string;
  disabled?: boolean;
  className?: string;
  action?: (e: string) => void;
};

export default function CodeBox({
  title,
  subtitle,
  icon,
  disabled,
  value,
  className,
  action,
}: CodeBoxParams) {
  const codeRef = useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <div className="flex w-full justify-between items-center p-1">
        <h1 className="flex items-center text-xl sm:text-3xl gap-2">
          <img src={icon} alt="CodeBoxIcon" width={"25px"} />
          {title}
          {subtitle && <span className="text-sm sm:text-md">({subtitle})</span>}
        </h1>
        <div className="flex items-center gap-2">
          {!disabled && subtitle?.endsWith(".json") && (
            <button
              className="bg-sky-600/[.5] rounded-md p-1 hover:bg-sky-600 active:bg-sky-500 text-xs sm:text-md"
              title="Format"
              onClick={() => {
                let audio = new Audio("assets/format.wav");
                audio.volume = 0.25;
                try {
                  if (codeRef.current) {
                    codeRef.current.value = JSON.stringify(
                      JSON.parse(codeRef.current.value),
                      null,
                      2
                    );
                    audio.play();
                  }
                } catch (e) {
                  console.log("Invalid JSON");
                }
              }}
            >
              <img
                src="controls/format.svg"
                alt="FormatIcon"
                className="sm:w-[25px] w-[15px]"
              />
            </button>
          )}
          {!disabled && (
            <button
              className="bg-sky-600/[.5] rounded-md p-1 hover:bg-sky-600 active:bg-sky-500 text-xs sm:text-md"
              title="Download"
              onClick={() => {
                let audio = new Audio("assets/download.wav");
                audio.volume = 0.25;
                if (codeRef.current) {
                  const fileName = subtitle || title;
                  const fileExtension = fileName.split(".").pop();
                  let mimeType = "text/plain";
                  switch (fileExtension) {
                    case "json":
                      mimeType = "application/json";
                      break;
                    case "js":
                      mimeType = "text/javascript";
                      break;
                    case "yaml":
                      mimeType = "text/yaml";
                      break;
                    case "ts":
                      mimeType = "text/typescript";
                      break;
                    case "py":
                      mimeType = "text/python";
                      break;
                    case "rs":
                      mimeType = "text/rust";
                      break;
                    case "go":
                    case "mod":
                      mimeType = "text/golang";
                      break;
                    case "Dockerfile":
                      mimeType = "text/x-dockerfile";
                      break;
                    case "Makefile":
                      mimeType = "text/x-makefile";
                      break;
                  }

                  const content = new Blob([codeRef.current.value], {
                    type: mimeType,
                  });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(content);
                  a.download = fileName;
                  a.click();
                  audio.play();
                  a.remove();
                }
              }}
            >
              <img
                src="controls/download.svg"
                alt="DownloadIcon"
                className="sm:w-[25px] w-[15px]"
              />
            </button>
          )}
        </div>
      </div>
      <textarea
        spellCheck={false}
        ref={codeRef}
        onChange={(e) => {
          if (action) action(e.target.value);
        }}
        disabled={disabled}
        defaultValue={value}
        className={"blurred " + className}
      />
    </>
  );
}
