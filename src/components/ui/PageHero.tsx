import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  text,
  image,
  imageAlt,
  children,
}: PageHeroProps) {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative isolate overflow-hidden bg-forest-deep">
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,55,12,0.72)_0%,rgba(9,55,12,0.55)_45%,rgba(9,55,12,0.9)_100%)]"
      />
      <div className="container-x relative flex min-h-[27rem] flex-col justify-end pt-32 pb-14 text-cream sm:min-h-[32rem] sm:pt-40 sm:pb-20">
        <motion.p {...rise(0.05)} className="eyebrow !text-cream/70">
          {eyebrow}
        </motion.p>
        <motion.h1
          {...rise(0.12)}
          className="type-display mt-4 max-w-3xl text-cream"
        >
          {title}
        </motion.h1>
        <motion.p {...rise(0.2)} className="mt-5 max-w-xl text-base text-cream/80 sm:text-lg">
          {text}
        </motion.p>
        {children ? (
          <motion.div {...rise(0.28)} className="mt-8">
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
