import WindowPanelCard from "@/components/helpers/window-panel-card";
import Image from "next/image";

// Generate random images with varying dimensions
const randomImages = Array.from({ length: 20 }, (_, i) => {
    const width = 200 + Math.floor(Math.random() * 400); // 200–600
    const height = 200 + Math.floor(Math.random() * 500); // 200–700
    return {
        id: i,
        src: `https://picsum.photos/${width}/${height}?random=${i}`,
        width,
        height,
    };
});

export default function GalleryPage() {
    return (
        <main className="p-2">
            <div
                className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                style={{ gridAutoFlow: "dense", gridAutoRows: "8px" }}
            >
                {randomImages.map((image) => {
                    const rowSpan = Math.ceil((image.height / image.width) * 25); // scale row span to height
                    return (
                        <div
                            key={image.id}
                            className="w-full overflow-hidden relative"
                            style={{ gridRowEnd: `span ${rowSpan}` }}
                        >
                            <WindowPanelCard type="img">
                                <div className="relative flex-1 w-full overflow-hidden">
                                    <Image
                                        src={image.src}
                                        alt={`Random ${image.id}`}
                                        fill
                                        className="object-cover transition-transform"
                                    />
                                </div>
                            </WindowPanelCard>

                        </div>
                    );
                })}
            </div>
        </main>
    );
}
