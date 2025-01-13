import { PropsWithChildren } from "react";

function AppPanel({ children }: PropsWithChildren) {
  return <div className="bg-white bg-opacity-10 rounded p-1 lg:p-2">{children}</div>;
}

export default AppPanel;
