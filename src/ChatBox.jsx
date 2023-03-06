import React, { useState } from "react";
import axios from "axios";
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

function ChatInterface() {
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    setConversationHistory([...conversationHistory, { user: `${message}` }]);
    axios
      .post("http://127.0.0.1:5001", { message })
      .then((response) => {
        const botMessage = response.data;
        setConversationHistory([
          ...conversationHistory,
          { user: `${message}`, bot: botMessage },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
    event.target.reset();
  };

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
        {conversationHistory.map((message, index) => (
          <Box as="li" key={index} mb="2">
            <FormLabel mb="1">User: {message.user}</FormLabel>
            {message.bot ? (
              <FormLabel mb="1">Bot: {message.bot}</FormLabel>
            ) : null}
          </Box>
        ))}
      </Box>
      <form onSubmit={handleFormSubmit}>
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
