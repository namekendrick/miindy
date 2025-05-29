"use server";

export const ScrollToElementExecutor = async (environment) => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector not defined");
    }

    await environment.getPage().evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("element not found");
      }

      const top = element.getBoundingClientRect().top;
      window.scrollTo({ top });
    }, selector);

    return true;
  } catch (error) {
    environment.log.error(error.message);
    return false;
  }
};
