import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  FormLabel,
  Flex,
  Input,
  Text,
  InputGroup,
  InputRightElement,
  FormControl,
} from "@chakra-ui/react";

import { FaPencilAlt } from "react-icons/fa";

import "./ChatBox.css";

function Recommendations(props) {
  let conversationHistory = props.recList;
  let conversationHistoryJsx = [];
  let [user, setUser] = useState('');
  let [pref, setPref] = useState('');

  function handleMoreInput(event, stage, directManipulation) {
    const inputField =
      event.target.parentNode.parentNode.querySelector("input");
    const inputValue = inputField.value;
    console.log("HEYO 1");

    if (inputValue.trim() !== "") {
      console.log("HEYO");
      props.masterSock.emit(
        "message",
        `${stage}, ${directManipulation ? 3 : 0}, ${inputValue}`
      );
      inputField.value = "";
    }
  }

  function handleSelection(event, stage, index) {
    console.log("STAGE", stage);
    console.log("INDEX", index);
    props.masterSock.emit("message", `${stage}, 2, ${index}`);
  }

  function handleIncrease(event, stage) {
    console.log("STAGE", stage);
    props.masterSock.emit("message", `${stage}, 1`);
  }

  for (let i = 0; i < conversationHistory.length; i++) {
    if (conversationHistory[i].user) {
      conversationHistoryJsx.push(
        <Box as="li" key={i} mb="2">
          <FormLabel mb="1"><Text color='LightCoral' >User:</Text>{conversationHistory[i].user}</FormLabel>
        </Box>
      );
    } else {
      if (conversationHistory[i].bot.includes("To start, enter your name, comma separated with your initial input")) {
        // create chakra form input boxes that ask for name and what sort of food they're feeling.
        // on submit, format the user input message to emit a message
        // to the server, and then lock the input boxes


        conversationHistoryJsx.push(
          <Box as="li" key={i} mb="2">
            <FormLabel mb="1">Bot: {conversationHistory[i].bot}</FormLabel>
            {user === "" ? (
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input type='username' />
                <FormLabel>What are you feeling?</FormLabel>
                <Input type='preference' />

                <Button
                  mt={4}
                  colorScheme="teal"
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault();
                    setUser(event.target.parentNode.querySelector("input[type='username']").value);
                    props.setUser(event.target.parentNode.querySelector("input[type='username']").value)
                    setPref(event.target.parentNode.querySelector("input[type='preference']").value);
                    props.masterSock.emit("init_message", `${user}, ${pref}`);
                  }}
                >
                  Submit
                </Button>
              </FormControl>
            ) : (
              <Text>Hi {user}! You're feeling {pref} today.</Text>
            )}
          </Box>
        );
      }
      else if (conversationHistory[i].bot.includes("Stage 0")) {
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
          console.log("BODY", body);

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
                  maxW='sm'
                  p='3'
                  _hover={{ bg: 'cornflowerblue' }}
                >
                  <Text fontSize={"15px"}>{list[k]}</Text>
                </Card>
              );
            }
            conversationHistoryJsx.push(
              <Accordion allowToggle>
                <AccordionItem
                  key={"unique" + j}
                  stage={stage}
                  maxHeight={"20%"}
                  mt={2}
                  mb={2}
                  position="relative"
                  border="none"
                >
                  <Text fontSize={"10px"} color={"gray"}>
                    {header}
                  </Text>
                  <Box>
                    <Flex alignItems="center" gap="5px" mt="15px">
                      {listJsx}
                    </Flex>
                    <AccordionButton>
                      <FaPencilAlt />
                    </AccordionButton>
                  </Box>
                  <AccordionPanel pb={4}>
                    <InputGroup size="md">
                      <Input pr="4.5rem" placeholder="Specify more" />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={(event) =>
                            handleMoreInput(event, stage, false)
                          }
                        >
                          Submit
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <InputGroup size="md">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={(event) =>
                          handleIncrease(event, stage)
                        }
                      >
                        More
                      </Button>
                    </InputGroup>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            );
          } else {
            console.log(body);
            conversationHistoryJsx.push(
              <Accordion allowToggle>
                <AccordionItem
                  key={"unique" + j}
                  maxHeight={"20%"}
                  mt={2}
                  mb={2}
                  position="relative"
                  stage={stage}
                  border="none"
                >
                  <Text fontSize={"10px"} color={"gray"}>
                    {header}
                  </Text>
                  <Box>
                    <Text fontSize={"15px"}>{body}</Text>
                    <AccordionButton>
                      <FaPencilAlt />
                    </AccordionButton>
                  </Box>
                  <AccordionPanel pb={4}>
                    <InputGroup size="md">
                      <Input pr="4.5rem" placeholder="Specify more" />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
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
                    </InputGroup>
                    <InputGroup size="md">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={(event) =>
                          handleIncrease(event, stage)
                        }
                      >
                        More
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
            <FormLabel mb="1"><Text color='cornflowerblue'>Bot:</Text> {conversationHistory[i].bot}</FormLabel>
          </Box>
        );
      }
    }
  }
  return <Box as="ul">{conversationHistoryJsx}</Box>;
}

export default Recommendations;
