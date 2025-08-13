import {
  validateNumericInput,
  validateNumericRange,
} from "@/features/workflows/utils/common-validators";
import {
  createStandardExecutor,
  handleExecutorSuccess,
} from "@/features/workflows/utils/error-handling";

const randomNumberExecutorFn = async (environment) => {
  const minimumInput = environment.getInput("Minimum");
  const maximumInput = environment.getInput("Maximum");

  const minimum = validateNumericInput(minimumInput, "Minimum", 0);
  const maximum = validateNumericInput(maximumInput, "Maximum", 100);

  validateNumericRange(minimum, maximum);

  const randomNumber =
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  return handleExecutorSuccess(
    environment,
    { "Random number": randomNumber },
    `Generated random number: ${randomNumber} (range: ${minimum}-${maximum})`,
  );
};

export const RandomNumberExecutor = createStandardExecutor(
  randomNumberExecutorFn,
  {
    name: "Random Number Generator",
    validateInputs: false,
  },
);
