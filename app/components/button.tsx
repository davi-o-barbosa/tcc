export default function Button(props: { text: string }) {
  return (
    <button className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-blue-500 transition duration-150 ease-in-out font-semibold active:scale-125">
      {props.text}
    </button>
  );
}
