import "./App.css";
import ChatInterface from "./ChatBox";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <ChatInterface />
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
