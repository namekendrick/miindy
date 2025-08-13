"use client";

export const ManuallyRunConfig = ({ nodeId }) => {
  return (
    <div className="flex justify-center p-10">
      <p className="text-muted-foreground text-center text-sm">
        This trigger will start the workflow when you click the "Execute"
        button.
        <br />
        <br />
        No configuration required.
      </p>
    </div>
  );
};
