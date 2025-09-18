"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {};

const PageTransition = ({ children }: Props) => {
  return <AnimatePresence mode="wait"></AnimatePresence>;
};

export default PageTransition;
