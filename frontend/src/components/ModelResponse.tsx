interface ModelResponseProps {
  response: string;
}

const ModelResponse = ({ response }: ModelResponseProps) => {
  return <p className="text-foreground text-sm leading-relaxed">{response}</p>;
};

export default ModelResponse;
