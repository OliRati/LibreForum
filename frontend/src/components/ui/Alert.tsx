type Props = {
  message: string;
  type?: "error" | "success" | "info";
};

export default function Alert({ message, type = "info" }: Props) {
  const styles = {
    error: "border-red-500/30 bg-red-500/10 text-red-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    info: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}