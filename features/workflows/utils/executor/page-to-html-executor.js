"use server";

export const PageToHtmlExecutor = async (environment) => {
  try {
    const html = await environment.getPage().content();
    environment.setOutput("Html", html);
    return true;
  } catch (error) {
    environment.log.error(error.message);
    return false;
  }
};
