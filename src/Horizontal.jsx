import { Step, Steps, useSteps } from "chakra-ui-steps"
import {
    Button,
    Heading,
    Flex,
    Box,
    Text
  } from "@chakra-ui/react";


export const Horizontal = (props) => {
    const steps = props.progress;
  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: 0,
  })
//todo sus
  return (
    <Flex flexDir="column" width="100%" border="none">
      {/* <Steps colorScheme="white">
        {steps.map(({ label, choice }, index) => (
          <Step label={label} key={label} description={"Control Level " + choice}>
            <Box index={index} border="none"/>
          </Step>
        ))}
      </Steps> */}
      <Steps colorScheme="white">
  {steps.map(({ label, choice }, index) => (
    <Step label={label} key={label} description={choice === "0" ? <Text color="green">Automatic</Text> : choice === "1" ? <Text color="orange">Show options</Text> : <Text color="red">I'll enter it</Text>}>
        <Box index={index} border="none" />
        </Step>
      ))}
    </Steps>


      {activeStep === steps.length && steps.length !== 0 ? (
        <Flex px={4} py={4} width="100%" flexDirection="column">
          <Heading fontSize="xl" textAlign="center">
            Woohoo! All steps completed!
          </Heading>
          <Button mx="auto" mt={6} size="sm" onClick={reset}>
            Reset
          </Button>
        </Flex>
      ) : (
        <Flex width="100%" justify="flex-end">
          {/* <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <Button size="sm" onClick={nextStep}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button> */}
        </Flex>
      )}
    </Flex>
  )
}
export default Horizontal