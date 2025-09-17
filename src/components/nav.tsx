"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import GithubAvatar from "./github-avatar";
import TabsNavigation from "./tabs-nav";

import React from 'react'
import { useCommand } from "@/providers/command-provider";

type Props = {}

const Nav = (props: Props) => {
    return (
        <div className="flex flex-row items-stretch gap-2 w-full pointer-events-auto z-50">
            <Link href={'/'}>
                <Button variant="outline" className="h-full !bg-background p-0 aspect-square rounded-full cursor-pointer shrink-0 size-9 inset-shadow-xs inset-shadow-foreground">
                    <GithubAvatar className="size-7" />
                </Button>
            </Link>
            <div className="flex grow items-center text-sm">
                <TabsNavigation />
            </div>
        </div>
    )
}

export default Nav
