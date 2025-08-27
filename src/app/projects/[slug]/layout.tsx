export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="relative grow w-full max-w-4xl mx-auto gap-0 flex flex-col pt-2 lg:pt-24">
            {/* page height border styles */}
            <div className='absolute bg-muted/20 top-0 bottom-0 right-0 left-0 border-x -z-[1]'></div>
            {children}
        </section>
    );
}