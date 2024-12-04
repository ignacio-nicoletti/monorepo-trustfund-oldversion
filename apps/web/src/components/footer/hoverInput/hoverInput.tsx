"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { Input } from "@repo/ui/components/ui/input.tsx";
import arrow_right from "@/assets/arrowIcons/arrow-right.svg";

export default function HoverInput() {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  const handleHoverStart = () => {
    setIsClosing(false);
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsHovered(false);
    }, 150); // Match this duration to the `exit` animation
  };

  return (
    <motion.div
      initial={false}
      className="relative inline-block"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <form onSubmit={handleSubmit} className="flex items-center">
        <AnimatePresence>
          {isHovered || isClosing ? (
            <motion.div
              key="input"
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeIn" }}
              className="relative"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresá tu email..."
                className="p-2 rounded-full w-[102%] h-[50px] bg-white"
                required
                aria-label="Email subscription"
              />
              <Button
                type="submit"
                className="absolute right-0 top-[5px] hover:bg-primary/90 bg-maincolor border-none rounded-full p-2"
                aria-expanded={isHovered}
              >
                <img alt="arrow-right" src={arrow_right.src} className="cursor-pointer" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                type="button"
                className="hover:bg-primary/90 bg-maincolor border-none rounded-full p-2"
                onClick={handleHoverStart}
              >
                <img alt="arrow-right" src={arrow_right.src} className="cursor-pointer" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
