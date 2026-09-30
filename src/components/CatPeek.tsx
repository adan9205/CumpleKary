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
    <figure className="anim-cat pointer-events-none fixed right-[max(1.25rem,var(--safe-r))] bottom-[max(8rem,calc(var(--safe-b)+7rem))] z-20 w-36 sm:w-44 lg:w-52">
      <img
        src={src}
        alt=""
        className="kintsugi h-auto w-full rounded-2xl"
      />
      <figcaption className="text-mist mt-2 text-right text-xs">
        {caption}
      </figcaption>
    </figure>
  );
}
