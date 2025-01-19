import { NavLink } from "react-router";
import { observer } from "mobx-react-lite";

function AppLink({ to, text }: { to: string; text: string }) {
  return (
    <NavLink to={to}>
      <div className="border border-emerald-600 rounded p-3 text-center hover:bg-emerald-950">{text}</div>
    </NavLink>
  );
}

const AppLinkObserved = observer(AppLink);

export default AppLinkObserved;
