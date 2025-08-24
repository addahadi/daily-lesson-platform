
type Props = {
  size?: number; // spinner size in pixels
  color?: string; // Tailwind color class (e.g., "blue-500")
  thickness?: number; // border thickness in pixels
  center?: boolean; // center spinner in container
};

const LoadingSpinner = ({
  size = 40,
  color = "blue-500",
  thickness = 4,
  center = true,
}: Props) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${thickness}px`,
  };

  const containerClass = center ? "flex justify-center items-center" : "";

  return (
    <div className={containerClass}>
      <div
        className={`rounded-full animate-spin border-t-transparent border-${color}`}
        style={spinnerStyle}
      />
    </div>
  );
};

export default LoadingSpinner;
