export const RandomNumberExecutor = async (environment) => {
  const minimum = environment.getInput("Minimum");
  const maximum = environment.getInput("Maximum");

  // Parse and validate inputs with default values
  const min = minimum ? parseFloat(minimum) : 0;
  const max = maximum ? parseFloat(maximum) : 100;

  // Validate that maximum is greater than minimum
  if (max <= min) {
    environment.log.error(
      `Invalid range: Maximum (${max}) must be greater than Minimum (${min})`,
    );
    return false;
  }

  // Generate random number between min (inclusive) and max (inclusive)
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  environment.log.info(
    `Generated random number: ${randomNumber} (range: ${min}-${max})`,
  );

  // Set the output value
  environment.setOutput("Random number", randomNumber);

  return true;
};
