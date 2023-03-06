import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";
import "./ChatBox.css";

const socket = io.connect("http://localhost:5001", {
  cors: { origin: "http://localhost:3001", methods: ["GET", "POST"] },
});

function ChatInterface() {
  let isFirstMessage = true;
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("recommendations", (recommendations) => {
      setConversationHistory([
        ...conversationHistory,
        { bot: recommendations },
      ]);
    });
  }, [conversationHistory]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value.trim();
    if (message) {
      setConversationHistory([...conversationHistory, { user: message }]);
      // if the message starts with 'init', send it on message channel
      if (isFirstMessage) {
        socket.emit("init_message", message);
        isFirstMessage = false;
      } else {
        socket.emit("message", message);
      }
    }
    event.target.reset();
    console.log(conversationHistory);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);

  return (
    <VStack
      spacing="4"
      alignItems="flex-start"
      justifyContent="flex-end"
      h="500px"
      w="400px"
      flexDirection="column"
      mx="auto"
      mt="8"
      p="4"
      borderWidth="1px"
      borderRadius="lg"
      maxW="full"
    >
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Order with me!
      </Text>
      <Box
        as="ul"
        w="full"
        listStyleType="none"
        p="0"
        m="0"
        flexGrow="1"
        overflowY="auto"
      >
        {conversationHistory.map((message, index) =>
          message.user ? (
            <Box as="li" key={index} mb="2">
              <FormLabel mb="1">User: {message.user}</FormLabel>
            </Box>
          ) : (
            <Box as="li" key={index} mb="2">
              <FormLabel mb="1">Bot: {message.bot}</FormLabel>
            </Box>
          )
        )}
        <div ref={messagesEndRef} />
      </Box>
      {/* make the form span the entire width  */}
      <form onSubmit={handleFormSubmit} className="form-dialog">
        <Stack direction="row" spacing="4" w="full">
          <FormControl id="message" flex="1">
            <Input
              type="text"
              name="message"
              placeholder="Type your message here"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            variant="solid"
            aria-label="Send message"
          >
            <FaPaperPlane />
          </Button>
        </Stack>
      </form>
    </VStack>
  );
}

export default ChatInterface;
