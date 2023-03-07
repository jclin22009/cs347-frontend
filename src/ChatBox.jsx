import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";
import "./ChatBox.css";
import Recommendations from "./Recommendations";

const socket = io.connect("http://localhost:5001", {
  cors: { origin: "http://localhost:3001", methods: ["GET", "POST"] },
});

function ChatInterface() {
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("recommendations", (recommendations) => {
      setConversationHistory([
        ...conversationHistory,
        { bot: recommendations },
      ]);
      console.log("recs", conversationHistory);
    });
  }, [conversationHistory]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value.trim();
    if (message) {
      setConversationHistory([...conversationHistory, { user: message }]);
      // if conversationHistory has more than 2 message (the first message), send init_message
      if (conversationHistory.length < 3) {
        socket.emit("init_message", message);
        console.log("emitted init message");
      } else {
        socket.emit("message", message);
      }
    }
    // if the last message contains "Stage 0",
    event.target.reset();
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
        <Recommendations recList={conversationHistory} />
        <div ref={messagesEndRef} />
      </Box>
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
