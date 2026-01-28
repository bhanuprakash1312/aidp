import { dotSpinner } from "ldrs";

dotSpinner.register();

const Loader = ({ size = 40, color = "black" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <l-dot-spinner
        size={size}
        speed="0.9"
        color={color}
      ></l-dot-spinner>
    </div>
  );
};

export default Loader;
