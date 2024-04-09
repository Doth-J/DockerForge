import "./App.css";
import Sidebar from "./components/Sidebar";
import Forge from "./sections/Forge";
import HowTo from "./sections/HowTo";
import Intro from "./sections/Intro";
import Setup from "./sections/Setup";

function App() {
  return (
    <div className="w-full h-screen flex gap-2">
      <div className="flex-shrink min-w-[100px] sm:min-w-[200px] h-full overflow-hidden">
        <Sidebar />
      </div>
      <div
        className="flex-grow flex flex-col gap-1 overflow-y-auto pt-2 pb-2 pr-2 scroller"
        id="content"
      >
        <Intro />
        <HowTo />
        <Setup />
        <Forge />
      </div>
    </div>
  );
}

export default App;
