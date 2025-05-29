"use server";

export const FillInputExecutor = async (environment) => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector not defined");
    }

    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input->value not defined");
    }

    await environment.getPage().type(selector, value);
    return true;
  } catch (error) {
    environment.log.error(error.message);
    return false;
  }
};
