import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ModelResponseProps {
  response: string;
}

const ModelResponse = ({ response }: ModelResponseProps) => {
  return (
    <div className="text-foreground text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
          h2: (props) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
          h3: (props) => (
            <h3 className="text-base font-semibold mt-3 mb-1" {...props} />
          ),
          p: (props) => <p className="mb-3 last:mb-0" {...props} />,
          ul: (props) => (
            <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
          ),
          li: (props) => <li className="leading-relaxed" {...props} />,
          a: (props) => (
            <a
              className="text-brown-medium underline hover:text-brown-dark"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          strong: (props) => <strong className="font-semibold" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-border pl-4 italic text-foreground-secondary my-3"
              {...props}
            />
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="bg-background-secondary text-brown-dark rounded px-1.5 py-0.5 text-[13px] font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={`${className ?? ""} font-mono text-[13px]`} {...props}>
                {children}
              </code>
            );
          },
          pre: (props) => (
            <pre
              className="bg-background-secondary rounded-lg p-3 overflow-x-auto my-3 text-[13px]"
              {...props}
            />
          ),
          table: (props) => (
            <table className="w-full border-collapse my-3 text-[13px]" {...props} />
          ),
          th: (props) => (
            <th
              className="border border-border px-3 py-1.5 bg-background-secondary text-left font-semibold"
              {...props}
            />
          ),
          td: (props) => (
            <td className="border border-border px-3 py-1.5" {...props} />
          ),
          hr: (props) => <hr className="border-border my-4" {...props} />,
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
};

export default ModelResponse;
