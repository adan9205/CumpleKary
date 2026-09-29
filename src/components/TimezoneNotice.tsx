type Props = { timeZone: string };

export function TimezoneNotice({ timeZone }: Props) {
  return (
    <p className="text-cream-2/80 mx-auto max-w-xs text-center text-[11px] leading-relaxed">
      El contador llega a cero a medianoche en {timeZone}. Es la zona que
      reporta tu navegador; no usamos GPS.
    </p>
  );
}
