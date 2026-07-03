interface LogoMarkProps {
  size: number;
}

const LogoMark = ({ size }: LogoMarkProps) => (
  <div
    className="flex items-end justify-center gap-1"
    style={{ transform: `scale(${size})` }}
  >
    <div className="w-2 h-3 rounded-full bg-brown-light" />
    <div className="w-2 h-6 rounded-full bg-brown-dark" />
    <div className="w-2 h-4 rounded-full bg-brown-medium" />
  </div>
);

export default LogoMark;
