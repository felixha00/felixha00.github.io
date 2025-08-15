"use client"

import { useMDXComponents } from "@/components/mdx-components";
import React, { createContext, useState, useContext, ReactNode } from "react";

type CommandEntry = {
    command: string;
    output: ReactNode;
};

type CommandContextType = {
    commandsHistory: CommandEntry[];
    runCommand: (command: string) => Promise<void>;
};

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const useCommand = (): CommandContextType => {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error("useCommand must be used within a CommandProvider");
    }
    return context;
};

type CommandProviderProps = {
    children: ReactNode;
};

export const CommandProvider: React.FC<CommandProviderProps> = ({ children }) => {
    const [commandsHistory, setCommandsHistory] = useState<CommandEntry[]>([]);

    const runCommand = async (command: string) => {
        let output: ReactNode = null;

        const [cmd, ...args] = command.split(" ");
        console.log("args:", args);

        switch (cmd.toLowerCase()) {
            case "echo":
                // echo prints whatever the user types
                output = <p>{args.join(" ")}</p>;
                break;
            case "date":
                output = <p>{new Date().toString()}</p>;
                break;
            case "clear":
                // Clear command history
                setCommandsHistory([]);
                return; // exit early, nothing to add to history
            case "cat":
                const fileName = args[0];
                if (!fileName) {
                    output = <p className="text-destructive">Usage: cat &lt;file&gt;</p>;
                } else {
                    try {
                        const { default: FileContent } = await import(`@/content/commands/${fileName}.mdx`);
                        output = <FileContent components={useMDXComponents()} />;
                    } catch {
                        output = <p className="text-destructive">cat: {fileName}: No such file</p>;
                    }
                }
                break;

            case "cd":
                const page = args[0];

                if (!page) {
                    output = <span style={{ color: "red" }}>Usage: cd &lt;page&gt;</span>;
                    break;
                }

                output = (
                    <div>
                        Navigating to <span style={{ color: "yellow" }}>{page}</span>...
                    </div>
                );
                break;
            default:
                try {
                    const { default: MDX } = await import(`@/content/commands/${cmd}.mdx`);
                    output = <MDX components={useMDXComponents()} />;
                } catch (err) {
                    output = (
                        <p className="text-destructive">{command}: command not found</p>
                    );
                }
        }

        const newEntry: CommandEntry = { command, output };
        setCommandsHistory((prev) => [...prev, newEntry]);
    };

    return (
        <CommandContext.Provider value={{ commandsHistory, runCommand }}>
            {children}
        </CommandContext.Provider>
    );
};
