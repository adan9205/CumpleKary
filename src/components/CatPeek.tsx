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
    <figure className="anim-cat pointer-events-none fixed right-[max(1rem,var(--safe-r))] bottom-[max(5rem,calc(var(--safe-b)+4.5rem))] z-20 w-24 sm:w-28">
      <img
        src={src}
        alt=""
        className="kintsugi h-auto w-full rounded-2xl"
      />
      <figcaption className="text-mist mt-1 text-right text-[10px]">
        {caption}
      </figcaption>
    </figure>
  );
}
