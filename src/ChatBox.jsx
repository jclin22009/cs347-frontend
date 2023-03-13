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
  Flex,
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

  const [progress, setProgress] = useState([]);

  useEffect(() => {
    socket.on("recommendations", (recommendations) => {
      setConversationHistory([{ bot: recommendations }]);
    });
  }, [conversationHistory]);

  useEffect(() => {
    socket.on("control-levels", (message) => {
      let stages = ["Restaurant", "Food Item", "Delivery Method", "Tip"];
      const controlLevels = message.split(": ")[1].split(", ");
      const steps = [];
      
      for (let i = 0; i < stages.length; i++) {
        steps.push({
          label: stages[i],
          choice: controlLevels[i],
        });
      }

      setProgress(steps);
    });
  }, [progress]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);

  return (
    <div>
      <Box maxWidth="65%" margin="auto" p="5">
        <Horizontal progress={progress}/>
      </Box>
      <VStack
        spacing="4"
        alignItems="flex-start"
        justifyContent="flex-end"
        h="500px"
        w="600px"
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
            Welcome to DashAdapt {user}!
          {/* <Text fontSize="xl" fontWeight={"light"} color="grey" mb="4"> */}
          {/* </Text> */}
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
          <Recommendations
            recList={conversationHistory}
            masterSock={socket}
            setUser={setUser}
          />
          <div ref={messagesEndRef} />
        </Box>
      </VStack>
    </div>
  );
}

export default ChatInterface;
