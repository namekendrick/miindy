"use server";

export const ReadPropertyFromJsonExecutor = async (environment) => {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input->JSON not defined");
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("input->propertyName not defined");
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];

    if (propertyValue === undefined) {
      environment.log.error("property not found");
      return false;
    }

    environment.setOutput("Property value", propertyValue);
    return true;
  } catch (error) {
    environment.log.error(error.message);
    return false;
  }
};
