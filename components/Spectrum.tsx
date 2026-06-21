export default function Spectrum({ width = 64 }: { width?: number }) {
  return (
    <span
      style={{ display: 'inline-block', width, height: 4, borderRadius: 99 }}
      className="spectrum-bar"
    />
  );
}
