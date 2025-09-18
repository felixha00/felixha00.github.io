import { Minus, Square, Wrench, X } from "lucide-react";
import React, { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren & {
  type?: string;
};

const WindowPanelCard = (props: Props) => {
  return (
    <div className="h-full rounded relative flex flex-col gap-0 p-0 bg-card/50 border shadow-md my-inset-shadow hover-opacity">
      <div className="flex items-center justify-between bg-foreground/10 p-1 border-b select-none">
        <span className="text-xs flex flex-row items-center gap-2 font-mono truncate max-w-[70%] px-1 ">
          <Wrench size={10} className="shrink-0" />
          {props.type}
        </span>
        <div className="flex gap-1 [&>button]:transition-colors [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:size-5">
          <button className="hover:bg-foreground/20 rounded-sm">
            <Minus size={12} />
          </button>
          <button className="hover:bg-foreground/20 rounded-sm">
            <Square size={9} />
          </button>
          <button className="hover:bg-foreground/20 rounded-sm">
            <X size={12} />
          </button>
        </div>
      </div>
      {props.children}
      <div
        id="footer"
        className="w-full absolute bottom-0 px-2 py-1 bg-linear-to-t from-background/75 from-25% to-transparent"
      >
        <small>Footer message</small>
      </div>
    </div>
  );
};

export default WindowPanelCard;
