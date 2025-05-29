export const createLogCollector = () => {
  const logs = [];
  const getAll = () => logs;

  const logFunctions = {};
  ["info", "warn", "error", "debug"].forEach(
    (level) =>
      (logFunctions[level] = (message) => {
        logs.push({ message, level, timestamp: new Date() });
      }),
  );

  return {
    getAll,
    ...logFunctions,
  };
};
