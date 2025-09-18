export default function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center absolute min-h-full min-w-full z-50">
      <h1 className="text-white text-9xl uppercase font-bold font-['Anton']">{message}</h1>
    </div>
  );
}
