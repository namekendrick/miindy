export const getStatusColor = (statusValue, options) => {
  if (options && Array.isArray(options)) {
    const hasColorConfig =
      options.length > 0 && typeof options[0] === "object" && options[0].color;

    if (hasColorConfig) {
      const statusOption = options.find(
        (option) => option.status === statusValue,
      );

      if (statusOption && statusOption.color) {
        return statusOption.color;
      }
    }
  }
};
