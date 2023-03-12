import "./App.css";
import ChatInterface from "./ChatBox";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { StepsTheme as Steps } from 'chakra-ui-steps';

const theme = extendTheme({
  components: {
    Steps,
  },
});


function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <ChatInterface />
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
