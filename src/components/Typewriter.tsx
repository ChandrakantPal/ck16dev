"use client";

import { useTypewriter } from "@/hooks/useTypewriter";

type TypewriterElement = "span" | "p" | "h1" | "h2";

interface TypewriterProps {
  text: string;
  startDelayMs?: number;
  className?: string;
  as?: TypewriterElement;
}

/**
 * The typed reveal is decoration. The complete string is always in the DOM for
 * screen readers and crawlers; only the animated copy is hidden from the
 * accessibility tree. The library this replaces exposed neither.
 */
const Typewriter = ({
  text,
  startDelayMs,
  className,
  as: Element = "span",
}: TypewriterProps) => {
  const typedText = useTypewriter({ text, startDelayMs });

  /* Once settled there is nothing to hide, so collapse to a single text node. */
  if (typedText === text) {
    return <Element className={className}>{text}</Element>;
  }

  return (
    <Element className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{typedText}</span>
    </Element>
  );
};

export default Typewriter;
