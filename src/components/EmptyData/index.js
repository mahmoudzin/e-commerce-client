import EmptyIcon from "../icons/EmptyIcon";

export default function EmptyData({ message = "There no Results!" }) {
  return (
    <div className="w-full h-screen flex justify-center align-center">
      <EmptyIcon />
      <p>{message}</p>
    </div>
  );
}
