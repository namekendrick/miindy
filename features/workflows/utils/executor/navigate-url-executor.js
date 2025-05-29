"use server";

export const NavigateUrlExecutor = async (environment) => {
  try {
    const url = environment.getInput("URL");
    if (!url) {
      environment.log.error("input->url not defined");
    }

    await environment.getPage().goto(url);
    environment.log.info(`visited ${url}`);
    return true;
  } catch (error) {
    environment.log.error(error.message);
    return false;
  }
};
