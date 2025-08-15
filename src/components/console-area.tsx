export default function ConsoleArea({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-foreground font-mono p-6 min-h-[300px]">
            {children}
        </div>
    );
}