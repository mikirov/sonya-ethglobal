import { NetworkOptions } from "./NetworkOptions";
import { usePrivy } from "@privy-io/react-auth";
import { ArrowLeftOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export const WrongNetworkDropdown = () => {
  const { logout } = usePrivy();

  return (
    <div className="mr-2 dropdown dropdown-end">
      <label tabIndex={0} className="gap-1 btn btn-error btn-sm dropdown-toggle">
        <span>Wrong network</span>
        <ChevronDownIcon className="w-4 h-6 ml-2 sm:ml-0" />
      </label>
      <ul
        tabIndex={0}
        className="gap-1 p-2 mt-1 dropdown-content menu shadow-center shadow-accent bg-base-200 rounded-box"
      >
        <NetworkOptions />
        <li>
          <button
            className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
            type="button"
            onClick={() => logout()}
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-6 ml-2 sm:ml-0" />
            <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
