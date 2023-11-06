interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

export default function Button(props: ButtonProps) {
  return (
    <button
      className="p-2 w-48 rounded-lg shadow-md bg-emerald-500 text-black hover:bg-emerald-600 
      font-semibold transiton duration-200 ease-in-out flex justify-center items-center gap-2"
      {...props}
    >
      {props.children}
    </button>
  );
}
