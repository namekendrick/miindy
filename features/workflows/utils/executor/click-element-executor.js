"use server";

export const ClickElementExecutor = async (environment) => {
  try {
    const selector = environment.getInput("Selector");

    if (!selector) {
      environment.log.error("input->selector not defined");
    }

    await environment.getPage().click(selector);

    return true;
  } catch (error) {
    environment.log.error(error.message);
    return false;
  }
};
