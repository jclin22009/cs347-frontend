import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Button,
  Card,
  Grid,
  GridItem,
  FormLabel,
  Flex,
  Input,
  Text,
  InputGroup,
  InputRightElement,
  FormControl,
  Spinner,
} from "@chakra-ui/react";

import { FaPencilAlt } from "react-icons/fa";
import Confetti from "react-confetti";

import "./ChatBox.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";

function button_text(level) {
  if (level === "0") {
    return "Show me several options";
  } else {
    return "Let me enter what I want";
  }
}

function prompt_text(level) {
  if (level === "0") {
    return "Specify more";
  } else if (level === "1") {
    return "Specify more for more options";
  } else if (level === "2") {
    return "Enter what you want!";
  }
}

function Recommendations(props) {
  const CONTROL_GROUP_FLAG = false;
  let conversationHistory = props.recList;
  let conversationHistoryJsx = [];
  let [user, setUser] = useState("");
  let [pref, setPref] = useState("");
  let [confirmText, setConfirmText] = useState("Confirm");
  let progress = props.progress;
  let [initMessageSent, setInitMessageSent] = useState(false);

  function handleMoreInput(event, stage, directManipulation) {
    const inputField =
      event.target.parentNode.parentNode.querySelector("input");
    const inputValue = inputField.value;

    if (inputValue.trim() !== "") {
      props.masterSock.emit(
        "message",
        `${stage}, ${directManipulation ? 3 : 0}, ${inputValue}`
      );
      inputField.value = "";
    }
  }

  function handleSelection(event, stage, index) {
    props.masterSock.emit("message", `${stage}, 2, ${index}`);
  }

  function handleIncrease(event, stage, level) {
    props.masterSock.emit("message", `${stage}, 1, ${level}`);
  }

  function handleConfirm() {
    props.masterSock.emit("message", `CONFIRM`);
    setConfirmText("Confirmed");
  }

  function handleInitMessage(event) {
    event.preventDefault();
    const tempUser = event.target.parentNode.querySelector(
      "input[type='username']"
    ).value;
    const tempPref = event.target.parentNode.querySelector(
      "input[type='preference']"
    ).value;

    setUser(tempUser);
    props.setUser(tempUser);
    setPref(tempPref);
    props.masterSock.emit("init_message", `${tempUser}; ${tempPref}`);
    setInitMessageSent(true);
  }
  let confirm_flag = true;

  function show() {
    document.getElementById("confirm-box").style.display = "none";
  }

  for (let i = 0; i < conversationHistory.length; i++) {
    if (conversationHistory[i].user) {
      conversationHistoryJsx.push(
        <Box as="li" key={i} mb="2">
          <FormLabel mb="1">
            <Text color="LightCoral">User:</Text>
            {conversationHistory[i].user}
          </FormLabel>
        </Box>
      );
    } else {
      console.log("conversationHistory[i]", conversationHistory[i].bot);
      try {
        conversationHistory[i].bot.includes("hi");
      } catch (error) {
        console.log("error", error);
        continue;
      }
      if (conversationHistory[i].bot.includes("To start, enter the below.")) {
        conversationHistoryJsx.push(
          <Box as="li" key={i} mb="2">
            <FormLabel mb="1">Bot: {conversationHistory[i].bot}</FormLabel>
            {user === "" ? (
              <FormControl>
                <FormLabel>What's your name?</FormLabel>
                <Input placeholder="First name" type="username" />
                <FormLabel mt="3">What would you like to order?</FormLabel>
                <Text color="grey" align="left" mb="2" mt="1">
                  e.g. "Something filling", "idk", "burgers"
                </Text>
                <Input placeholder="Type any food" type="preference" />

                <Button
                  mt={4}
                  colorScheme="teal"
                  type="submit"
                  onClick={(event) => {
                    handleInitMessage(event);
                  }}
                >
                  Submit
                </Button>
              </FormControl>
            ) : (
              <div>
                <Text mt="10" mb="10">
                  DashAdapt is loading your order.
                </Text>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </div>
            )}
          </Box>
        );
      } else if (conversationHistory[i].bot.includes("Stage 0")) {
        let recommendations = conversationHistory[i].bot.split("Stage ");
        recommendations.shift();

        // for every recommendation
        for (let j = 0; j < recommendations.length; j++) {
          let stage = recommendations[j].split(":")[0];
          let header = recommendations[j].split(":")[1];
          let body = recommendations[j].split(":")[2];

          if (body === undefined) {
            body = "";
          }
          console.log(body);
          if (
            body.includes("USER INPUT") ||
            body.includes("[") ||
            body.length === 0
          ) {
            confirm_flag = false;
          }

          // if the bot returns a LIST
          if (body.includes("[")) {
            // split body by comma, but not comma in apostrophes
            let list = body.match(/(?:[^',]+|'[^']*')+/g);
            // strip list of "\n", apostrophes, brackets, and double quotes
            for (let k = 0; k < list.length; k++) {
              list[k] = list[k].replace(/\\n/g, "");
              list[k] = list[k].replace(/'/g, "");
              list[k] = list[k].replace(/\[/g, "");
              list[k] = list[k].replace(/\]/g, "");
              list[k] = list[k].replace(/"/g, "");
            }
            console.log("LIST", list);
            let listJsx = [];
            for (let k = 0; k < list.length; k++) {
              listJsx.push(
                <Card
                  key={k}
                  onClick={(event) => handleSelection(event, stage, k)}
                  width="sm"
                  p="3"
                  _hover={{ bg: "cornflowerblue" }}
                  height="100px"
                  justifyContent="center"
                >
                  <Text fontSize={"15px"}>{list[k]}</Text>
                </Card>
              );
            }
            conversationHistoryJsx.push(
              <Accordion key={j} allowToggle>
                <AccordionItem
                  key={"unique" + j}
                  stage={stage}
                  maxHeight={"20%"}
                  mt={2}
                  mb={2}
                  position="relative"
                  border="none"
                >
                  <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                    <GridItem colSpan={5} h="10">
                      <Text fontSize={"12px"} color={"gray"} height="30px">
                        {header}
                      </Text>
                      <Box>
                        <Flex
                          alignItems="center"
                          gap="5px"
                          mt="15px"
                          margin="auto"
                        >
                          {listJsx}
                        </Flex>
                      </Box>
                    </GridItem>
                    {/* <GridItem colStart={6} colEnd={6} h="10" pos="absolute" right="1" top="-2">
                      <AccordionButton>
                        <FaPencilAlt w={4}/>
                      </AccordionButton>
                    </GridItem> */}
                  </Grid>

                  {/* <AccordionPanel pb={4}> */}
                  <Box top="100%" left="0" right="0" mt="110px">
                    {/* <InputGroup size="md">
                        <Input pr="4.5rem" placeholder={prompt_text(progress[j]["choice"])} />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            mr="5px"
                            onClick={(event) =>
                              handleMoreInput(event, stage, false)
                            }
                          >
                            Submit
                          </Button>
                        </InputRightElement>
                      </InputGroup> */}
                    {CONTROL_GROUP_FLAG ? null : (
                      <InputGroup
                        size="md"
                        display="flex"
                        justifyContent="center"
                      >
                        <Button
                          h="1.75rem"
                          size="sm"
                          mt="3"
                          mr="3"
                          onClick={(event) => handleIncrease(event, stage, 1)}
                        >
                          Show me more options
                          {/* {button_text(progress[j]["choice"])} */}
                        </Button>
                        <Button
                          h="1.75rem"
                          size="sm"
                          mt="3"
                          onClick={(event) => handleIncrease(event, stage, 2)}
                        >
                          I'll enter what I want
                        </Button>
                      </InputGroup>
                    )}
                  </Box>
                  {/* </AccordionPanel> */}
                </AccordionItem>
              </Accordion>
            );
          } else if (body.includes("USER INPUT")) {
            conversationHistoryJsx.push(
              <Box key={j}>
                <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                  <GridItem colSpan={5} h="8">
                    <Text fontSize={"12px"} color={"gray"}>
                      {header}
                    </Text>
                  </GridItem>
                </Grid>

                <InputGroup size="md" width="60%" margin="0 auto">
                  <Input
                    pr="4.5rem"
                    placeholder={prompt_text(progress[j]["choice"])}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      mr="5px"
                      onClick={(event) => handleMoreInput(event, stage, true)}
                    >
                      Submit
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            );
          } else {
            console.log(body);
            console.log(progress);
            conversationHistoryJsx.push(
              <Accordion key={j} allowToggle>
                <AccordionItem
                  key={"unique" + j}
                  maxHeight={"20%"}
                  mt={2}
                  mb={2}
                  position="relative"
                  stage={stage}
                  border="none"
                  pb="15px"
                >
                  <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                    <GridItem colSpan={5} h="10">
                      <Text fontSize={"12px"} color={"gray"}>
                        {header}
                      </Text>
                      <Text fontSize={"15px"}>{body}</Text>
                    </GridItem>
                    <GridItem
                      colStart={6}
                      colEnd={6}
                      h="10"
                      pos="absolute"
                      right="1"
                      top="-2"
                    >
                      <AccordionButton>
                        <FaPencilAlt w={4} />
                      </AccordionButton>
                    </GridItem>
                  </Grid>

                  <AccordionPanel pb={4}>
                    {/* <InputGroup size="md">
                      <Input pr="4.5rem" placeholder={prompt_text(progress[j]["choice"])} />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          mr="5px"
                          onClick={(event) =>
                            handleMoreInput(
                              event,
                              stage,
                              body.trim() === "USER INPUT"
                            )
                          }
                        >
                          Submit
                        </Button>
                      </InputRightElement>
                    </InputGroup> */}
                    
                      <InputGroup
                        size="md"
                        display="flex"
                        justifyContent="center"
                      >
                        {CONTROL_GROUP_FLAG ? null : (
                        progress[j]["choice"] > 1 ? null : (
                          <Button
                            h="1.75rem"
                            size="sm"
                            mt="3"
                            mr="3"
                            onClick={(event) => handleIncrease(event, stage, 1)}
                          >
                            Show me several options
                            {/* {button_text(progress[j]["choice"])} */}
                          </Button>
                        )
                        )}
                        <Button
                          h="1.75rem"
                          size="sm"
                          mt="3"
                          onClick={(event) => handleIncrease(event, stage, 2)}
                        >
                          I'll enter what I want
                        </Button>
                      </InputGroup>
                    
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            );
          }
        }
      } else {
        conversationHistoryJsx.push(
          <Box as="li" key={i} mb="2">
            <FormLabel mb="1">
              <Text color="cornflowerblue">Bot:</Text>{" "}
              {conversationHistory[i].bot}
            </FormLabel>
          </Box>
        );
      }
    }
  }
  console.log(confirmText);
  return (
    <React.Fragment>
      {confirmText === "Confirmed" ? (
        <Box position="static">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </Box>
      ) : null}
      <Box as="ul" padding="10px">
        {conversationHistoryJsx}
      </Box>
      {initMessageSent ? (
        <Box mb="2">
          <Button
            isDisabled={!confirm_flag || confirmText === "Confirmed"}
            onClick={() => handleConfirm()}
            float="right"
            id="confirm-box"
            position="fixed"
            right="47%"
            bottom="10%"
          >
            {confirmText}
          </Button>
        </Box>
      ) : null}
    </React.Fragment>
  );
}

export default Recommendations;
