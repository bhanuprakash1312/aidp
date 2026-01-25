import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

const Loader = ({ size = 40, color = "black" }) => {
  return (
    <div style={styles.container}>
      <TailChase size={size} speed="1.75" color={color} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};

export default Loader;
