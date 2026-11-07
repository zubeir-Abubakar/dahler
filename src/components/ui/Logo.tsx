interface LogoProps {
  className?: string;
  alt?: string;
}

/**
 * The company logo lockup: winged pineapple mark plus the "dähler-früchte"
 * wordmark, taken from the supplied artwork (425×122, transparent). Width is
 * left to `auto` against a fixed height so the lockup keeps its intrinsic ratio
 * at every breakpoint.
 */
export default function Logo({ className = "h-9", alt = "" }: LogoProps) {
  return (
    <img
      src="/images/logo/logo.png"
      width={425}
      height={122}
      alt={alt}
      decoding="async"
      className={`w-auto max-w-full shrink-0 ${className}`}
    />
  );
}
