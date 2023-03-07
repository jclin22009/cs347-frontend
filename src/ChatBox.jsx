import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
  InputGroup,
  InputRightElement,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FaPaperPlane, FaPencilAlt } from "react-icons/fa";
import io from "socket.io-client";
import "./ChatBox.css";

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

  // conversationHistory.map((message, index) =>
  //   message.user ? (
  //     <Box as="li" key={index} mb="2">
  //       <FormLabel mb="1">User: {message.user}</FormLabel>
  //     </Box>
  //   ) : (
  //     <Box as="li" key={index} mb="2">
  //       <FormLabel mb="1">Bot: {message.bot}</FormLabel>
  //     </Box>
  //   )
  // )

  let conversationHistoryJsx = [];
  for (let i = 0; i < conversationHistory.length; i++) {
    if (conversationHistory[i].user) {
      conversationHistoryJsx.push(
        <Box as="li" key={i} mb="2">
          <FormLabel mb="1">User: {conversationHistory[i].user}</FormLabel>
        </Box>
      );
    } else {
      if (conversationHistory[i].bot.includes("Stage 0")) {
        // create a new array of recommendations, splitting the string by "Stage:"
        let recommendations = conversationHistory[i].bot.split(/Stage [0-4]: /);
        for (let j = 0; j < recommendations.length; j++) {
          conversationHistoryJsx.push(
            <Accordion allowToggle>
              <AccordionItem key={"unique" + j} maxHeight={"20%"} mt={2} mb={2}>
                <Text fontSize={"10px"} color={"gray"}>
                  {recommendations[j].split(":")[0]}
                </Text>
                <Box>
                  <Text fontSize={"15px"}>
                    {recommendations[j].split(":")[1]}
                  </Text>
                  <AccordionButton>
                    <FaPencilAlt />
                  </AccordionButton>
                </Box>
                <AccordionPanel pb={4}>
                  <InputGroup size="md">
                    <Input pr="4.5rem" placeholder="Specify more" />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm">
                        Submit
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          );
        }
      } else {
        conversationHistoryJsx.push(
          <Box as="li" key={i} mb="2">
            <FormLabel mb="1">Bot: {conversationHistory[i].bot}</FormLabel>
          </Box>
        );
      }
    }
  }

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
        {conversationHistoryJsx}
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
