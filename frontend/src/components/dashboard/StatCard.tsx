export default function StatCard({ title, value }: any) {
    return (
        <div className="p-6 bg-white border rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
    );
}
