import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { MDXComponents } from "mdx/types";
import remarkGfm from "remark-gfm";

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

let components: MDXComponents = {
  // image: RoundedImage,
  // code: (props: any) => (
  //     <code
  //         className="rounded border bg-muted px-1 py-0.5 font-mono text-xs"
  //         {...props}
  //     />
  // ),
  // a: CustomLink,
  h1: (props) => (
    <h1 {...props} className="large-text">
      {props.children}
    </h1>
  ),

  // button: (props) => {
  //     return <Button {...props} className='bg-foreground'>asd</Button>
  // }
  Button: (props) => {
    return <Button {...props}>{props.children}</Button>;
  },
};

// function CustomButton(props) {
//     return <Button {...props} className='bg-foreground'>{props.children}</Button>
// }

export default function CustomMDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
