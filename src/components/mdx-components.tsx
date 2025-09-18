import type { MDXComponents } from "mdx/types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Captions, ImageIcon, Minus, Square, Wrench, X } from "lucide-react";
import { ImageZoom } from "./ui/shadcn-io/image-zoom";

const components: MDXComponents = {
  code: (props: any) => (
    <code className="rounded border bg-muted px-1 py-0.5 font-mono text-xs" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      {...props}
      className="border bg-muted/50  p-2 rounded prose-headings:m-0 not-italic leading-tight !before:[&_p:first-of-type]:content-none !after:[&_p:last-of-type]:content-none"
    />
  ),
  ImgWindow: (props: any) => {
    return (
      <Card className="p-0 relative rounded flex flex-col gap-0 not-prose mb-4">
        <div className="flex items-center justify-between bg-foreground/10 p-1 border-b select-none">
          <span className="text-xs flex flex-row items-center gap-2 font-mono truncate max-w-[70%] px-1">
            <ImageIcon className="size-3 shrink-0" />
            img
          </span>
          <div className="flex gap-1">
            <button className="hover:bg-foreground/20 p-1 rounded-sm">
              <Minus size={12} />
            </button>
            <button className="hover:bg-foreground/20 p-1 rounded-sm">
              <Square size={10} />
            </button>
            <button className="hover:bg-red-500 hover:text-white p-1 rounded-sm">
              <X size={12} />
            </button>
          </div>
        </div>
        <ImageZoom>
          <figure>
            <img src={props.src} className="bg-white w-full" />
            <figcaption className="p-2 rounded-none bg-muted/50 flex flex-row items-center gap-2 text-muted-foreground text-sm">
              <Captions className="size-4" />
              {props.cap}
            </figcaption>
          </figure>
        </ImageZoom>

        {props.children}
      </Card>
    );
  },
  // button: (props) => <Button {...props}>{props.children}</Button>
};

export function useMDXComponents(componentsOverride?: MDXComponents): MDXComponents {
  return { ...components, ...componentsOverride };
}
