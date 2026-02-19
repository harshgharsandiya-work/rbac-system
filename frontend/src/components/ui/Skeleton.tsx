export function TableSkeleton({ rows = 5, cols = 3 }: { rows?: number; cols?: number }) {
    return (
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex gap-6">
                    {Array.from({ length: cols }).map((_, i) => (
                        <div
                            key={i}
                            className="skeleton h-4 rounded-md"
                            style={{ width: `${80 + i * 20}px` }}
                        />
                    ))}
                </div>
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="p-4 border-b border-gray-100 last:border-0"
                >
                    <div className="flex gap-6">
                        {Array.from({ length: cols }).map((_, j) => (
                            <div
                                key={j}
                                className="skeleton h-4 rounded-md"
                                style={{
                                    width: `${100 + ((i + j) % 3) * 40}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
            <div className="skeleton h-4 w-24 rounded-md mb-3" />
            <div className="skeleton h-8 w-16 rounded-md" />
        </div>
    );
}
