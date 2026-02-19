export default function ActionButton({ label }: any) {
    return (
        <button className="px-5 py-2.5 bg-black text-white rounded-xl hover:opacity-90 transition">
            {label}
        </button>
    );
}
