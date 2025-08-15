"use client";

import ConsoleArea from '@/components/console-area';
import { motion } from 'motion/react';
import HomeContent from "../content/home.mdx";
import { useMDXComponents } from '@/components/mdx-components';
import { useCommand } from '@/providers/command-provider';
// import AnimatedMarkdown from '@/components/mdx-components';

export default function Home() {
  const { commandsHistory } = useCommand();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-8">
      {/* Hero Animation */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full text-center h-[50vh] items-center justify-center content-center"
      >
        <h1 className="text-5xl font-extrabold">Hi, I'm Jane Doe</h1>
        <p className="text-lg text-gray-400 mt-2">Creative Developer & Designer</p>
      </motion.div>

      <div className='max-w-full font-mono prose prose-neutral dark:prose-invert prose-sm'>
        <motion.ul
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, delay: 0.5 }}
        >
          <HomeContent components={useMDXComponents()} />
          {commandsHistory.map((entry, idx) => (
            <div key={idx}>
              <div className="text-emerald-400">{`$ ${entry.command}`}</div>
              <div>{entry.output}</div>
            </div>
          ))}
        </motion.ul>

      </div>
    </div>
  );
}