type Props = {
  src: string | null | undefined;
  size: string;
  name: string | null;
};

export default function Avatar({ src, size, name }: Props) {
  const initials = name && (name).charAt(0).toUpperCase();
  const sizeString = (size === "sm") ? 'h-12 w-12' : 'h-20 w-20';
  const sizeInitials = (size === "sm") ? 'text-2xl' : 'text-4xl';

  return (
    <div className={sizeString + " border-2 border-zinc-500 bg-zinc-800 rounded-full overflow-clip flex items-center justify-center"}>
      {src ? (
        <img
          src={src}
          alt={`${name} avatar`}
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <div className={sizeInitials + " font-bold text-zinc-400"}>
            {initials ? (
              <>
                {initials}
              </>
            ) : (
              <>
                X
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
