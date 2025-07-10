export default function StatusDot({ status }) {
  return (
    <span
      className={
        "inline-block w-2.5 h-2.5 rounded-full mr-2 " +
        (status === "Enable" ? "bg-green-500" : "bg-red-500")
      }
      title={status}
    />
  );
}
