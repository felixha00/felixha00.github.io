import Bento from "@/components/Bento";

export const metadata = {
  title: "home | felix ha",
  description: "",
};

// mocking
// const sanityData: BentoItem[] = [
//   {
//     id: "box-1",
//     initialLayout: { x: 0, y: 0, w: 2, h: 2 },
//     content: (
//       <div className="flex flex-col h-full justify-center items-center text-center">
//         <span className="text-4xl mb-4">✨</span>
//         <p className="text-neutral-500 font-medium">
//           Drag from top edge. <br /> Resize from bottom right.
//         </p>
//       </div>
//     ),
//   },
//   {
//     id: "box-2",
//     initialLayout: { x: 2, y: 0, w: 2, h: 1 },
//     content: (
//       <div className="w-full h-full bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
//         Analytics
//       </div>
//     ),
//   },
//   {
//     id: "box-3",
//     initialLayout: { x: 2, y: 1, w: 1, h: 1 },
//     content: (
//       <div className="w-full h-full bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xl">
//         $$$
//       </div>
//     ),
//   },
//   {
//     id: "box-4",
//     initialLayout: { x: 3, y: 1, w: 1, h: 3 },
//     content: (
//       <div className="relative w-full h-full overflow-hidden rounded-xl">
//         <img
//           src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
//           alt="Abstract"
//           className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity"
//         />
//       </div>
//     ),
//   },
//   {
//     id: "box-5",
//     initialLayout: { x: 0, y: 2, w: 3, h: 2 },
//     content: (
//       <div className="h-full flex flex-col">
//         <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4">
//           <div className="h-2 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
//           <div className="h-2 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
//           <div className="h-2 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded" />
//         </div>
//       </div>
//     ),
//   },
// ];

export default function Page() {
  return (
    // Full screen, no padding, dark background defaults
    <main className="w-screen min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-x-hidden p-4">
      <Bento />
    </main>
  );
}