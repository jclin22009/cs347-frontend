import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Flex
} from "@chakra-ui/react";
import io from "socket.io-client";
import "./ChatBox.css";
import Recommendations from "./Recommendations";
import { Horizontal } from "./Horizontal";

const socket = io.connect("http://localhost:5001", {
  cors: { origin: "http://localhost:3001", methods: ["GET", "POST"] },
});

function ChatInterface() {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [user, setUser] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("recommendations", (recommendations) => {
      setConversationHistory([
        { bot: recommendations },
      ]);
      console.log("recs", conversationHistory);
    });
  }, [conversationHistory]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);

  return (
    <div>
      <Box width="50%" margin="auto" p="5">
      <Horizontal/>   
      </Box>
<SimpleGrid minChildWidth="120px" spacing="40px">
  <Box height="80px"></Box>
  <Box bg="tomato" height="80px">
    <Text fontSize='xl'>Restaurant</Text>
    <Heading fontSize="10px" size='sm' >Control Level 0</Heading>
  </Box>
  <Box bg="tomato" height="80px">
    Stage 2: Food item
    Control Level: 0
  </Box>
  <Box bg="tomato" height="80px">
    Stage 3: Delivery method
    Control Level: 1
  </Box>
  <Box bg="tomato" height="80px">
    Stage 4: Tip
    Control Level: 2
  </Box>
  <Box height="80px"></Box>
</SimpleGrid>
    <VStack
      spacing="4"
      alignItems="flex-start"
      justifyContent="flex-end"
      h="500px"
      w="500px"
      flexDirection="column"
      mx="auto"
      mt="8"
      p="4"
      borderWidth="1px"
      borderRadius="lg"
      maxW="full"
    >
      <Flex>
        <Text fontSize="xl" fontWeight="bold" mb="4">
          Order with me!
        </Text>
        <Text fontSize="xl" fontWeight={"light"} color="grey" mb="4">
          {user}
        </Text>
      </Flex>
      <Box
        as="ul"
        w="full"
        listStyleType="none"
        p="0"
        m="0"
        flexGrow="1"
        overflowY="auto"
      >
        <Recommendations recList={conversationHistory} masterSock={socket} setUser={setUser} />
        <div ref={messagesEndRef} />
      </Box>
    </VStack>
    </div>
  );
}

export default ChatInterface;
