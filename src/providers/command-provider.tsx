"use client"

import { useMDXComponents } from "@/components/mdx-components";
import { GH_REPO_URL, RAW_GH_REPO_URL } from "@/constants";
import { useTheme } from "next-themes";
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
    const { setTheme } = useTheme()

    const getDefaultCmdOutput = async (cmd: string) => {
        const { default: MDX } = await import(`@/content/commands/${cmd}.mdx`);
        return <MDX components={useMDXComponents()} />;
    }

    const runCommand = async (command: string) => {
        let output: ReactNode = null;
        const [cmd, ...args] = command.split(" ");

        switch (cmd.toLowerCase()) {
            case "theme":
                setTheme(args[0] || "system")
                output = <p>Set <span className="text-ansi-magenta">theme</span> to <span className="text-ansi-green">{args[0]}</span></p>
                break;
            case "whoami":
                const { default: MDX } = await import(`@/content/about.mdx`);
                output = <>
                    <code>@/content/about.mdx</code>
                    <MDX components={useMDXComponents()} />
                </>;
                break;
            case "echo":
                output = <p>{args.join(" ")}</p>;
                break;
            case "date":
                output = <p>{new Date().toString()}</p>;
                break;
            case "clear":
                setCommandsHistory([]);
                return;
            case "cat":
                const fileName = args[0];
                if (!fileName) {
                    const data = await (await fetch("https://api.thecatapi.com/v1/images/search")).json();
                    output = (
                        <div>
                            <p>Usage: cat &lt;file&gt;</p>
                            <small className="text-muted-foreground">Here's a cat for your troubles</small>
                            <img src={data[0].url}></img>
                        </div>
                    )
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
            case "apt":
                if (args[0] === "list") {
                    try {
                        const res = await fetch(`${RAW_GH_REPO_URL}/package.json`);
                        const pkg = await res.json();

                        const allDeps = {
                            ...(pkg.dependencies || {}),
                            ...(pkg.devDependencies || {}),
                        };

                        output = (
                            <>
                                <p>Listing... Done</p>
                                <code className="font-mono text-sm rounded">
                                    {Object.entries(allDeps).length > 0 ? (
                                        Object.entries(allDeps).map(([name, version]) => (
                                            <div key={name} className="text-[var(--tw-prose-body)] font-normal">
                                                <span className="text-green-500">{name}</span>/{version as string} stable [installed]
                                            </div>
                                        ))
                                    ) : (
                                        "No dependencies found"
                                    )}
                                </code>
                                <br />
                            </>
                        );
                    } catch (err) {
                        output = <p className="text-destructive">Error fetching dependencies</p>;
                    }
                } else {
                    output = await getDefaultCmdOutput(cmd)
                    // output = <p>Usage: apt [command]</p>;
                }
                break;
            default:
                try {
                    const { default: MDX } = await import(`@/content/commands/${cmd}.mdx`);
                    output = <MDX components={useMDXComponents()} />;
                } catch (err) {
                    output = (
                        <p>{command}: command not found</p>
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
