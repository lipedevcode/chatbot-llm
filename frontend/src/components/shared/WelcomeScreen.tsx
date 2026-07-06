import LogoMark from "./LogoMark";

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center flex-1 px-6 animate-fade-in">
    <LogoMark size={2}></LogoMark>

    <h1
      className="mt-8 text-3xl font-bold text-foreground text-center leading-snug"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      Como posso ajudar você hoje?
    </h1>

    <p className="mt-3 text-foreground-muted text-base text-center max-w-sm">
      Faça perguntas, obtenha respostas e explore ideias.
    </p>
  </div>
);

export default WelcomeScreen;
