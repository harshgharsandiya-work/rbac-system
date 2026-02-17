export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
                {children}
            </div>
        </div>
    );
}
