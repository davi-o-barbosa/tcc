interface FormInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
}

export default function FormInput(props: FormInputProps) {
  return (
    <section>
      <label
        className="text-lg font-semibold"
        htmlFor="q"
        style={{ display: "block" }}
      >
        {props.label}
      </label>
      <input
        type="search"
        id="q"
        className="w-full p-2 px-4 rounded-lg border-indigo-500 border-2"
        {...props}
      />
    </section>
  );
}
