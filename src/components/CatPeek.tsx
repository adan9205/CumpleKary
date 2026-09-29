type Props = {
  src: string;
  visible: boolean;
  caption: string;
};

export function CatPeek({ src, visible, caption }: Props) {
  if (!visible) {
    return null;
  }
  return (
    <figure className="anim-cat pointer-events-none fixed right-[max(1rem,var(--safe-r))] bottom-[max(5rem,calc(var(--safe-b)+4.5rem))] w-24 sm:w-28">
      <img
        src={src}
        alt=""
        className="bg-night-2 ring-rose/20 h-auto w-full rounded-2xl shadow-[0_10px_24px_-8px_rgb(0_0_0/0.6)] ring-1"
      />
      <figcaption className="text-cream-2 mt-1 text-right text-[10px]">
        {caption}
      </figcaption>
    </figure>
  );
}
