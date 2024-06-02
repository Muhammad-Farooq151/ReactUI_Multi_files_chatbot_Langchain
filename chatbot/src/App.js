import {
  Home,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import ChatbotUI from "./components/chatbotUI";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} text="Home" active />
      </Sidebar>
      <ChatbotUI />
    </div>
  );
}

export default App;
  