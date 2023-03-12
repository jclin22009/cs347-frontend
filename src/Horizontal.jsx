import { Step, Steps, useSteps } from "chakra-ui-steps"
import {
    Button,
    Heading,
    Flex,
    Box,
    CardBody
  } from "@chakra-ui/react";

const steps = [{ label: "Restaurant", description: "userchoice" }, { label: "Step 2" }, { label: "Step 3" }]

export const Horizontal = (props) => {
  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: 0,
  })
//todo sus
  return (
    <Flex flexDir="column" width="100%">
      <Steps onClickStep={(step) => setStep(step)} activeStep={activeStep}>
        {steps.map(({ label, choice }, index) => (
          <Step label={label} key={label} description={choice}>
            <Box index={index} />
          </Step>
        ))}
      </Steps>
      {activeStep === steps.length ? (
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