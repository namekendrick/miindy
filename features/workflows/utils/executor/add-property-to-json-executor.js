"use server";

export const AddPropertyToJsonExecutor = async (environment) => {
  try {
    const jsonData = environment.getInput("JSON");

    if (!jsonData) {
      environment.log.error("input->JSON not defined");
    }

    const propertyName = environment.getInput("Property name");

    if (!propertyName) {
      environment.log.error("input->propertyName not defined");
    }

    const propertyValue = environment.getInput("Property value");

    if (!propertyValue) {
      environment.log.error("input->propertyValue not defined");
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput("Upadte JSON", JSON.stringify(json));
    return true;
  } catch (error) {
    environment.log.error(error.message);
    return false;
  }
};
