import ReactMarkdown from "react-markdown";
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';


type Props = {
    content: string;
}

export default function ShowMarkdown({ content }: Props) {

    function isSafeUrl(url: string | URL | undefined) {
        try {
            const parsed = new URL(url ?? "", window.location.origin);

            // autorise :
            // - URLs relatives (/image.jpg)
            // - même domaine
            return parsed.origin === window.location.origin;
        } catch {
            return false;
        }
    }

    const fixedContent = String(content)
        // force newline after ```
        .replace(/```([^\n]*)[ \t]+/g, "```$1\n\n")
        // Prevent triples line feed
        .replace(/\n{3,}/g, "\n\n")
        // Normalize lists
        .replace(/^(\d+)[\)\-]\s+/gm, "$1. ");

    return (
        <div className="prose lg:prose-xl [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 text-left">
            <ReactMarkdown
                children={fixedContent}
                remarkPlugins={[remarkGfm, remarkBreaks]}

                components={{
                    table: ({ children }) => (
                        <table className="min-w-full border-collapse border border-slate-700">
                            {children}
                        </table>
                    ),
                    th: ({ children }) => (
                        <th className="border border-slate-700 bg-slate-900 px-3 py-2 text-left">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-slate-700 px-3 py-2">
                            {children}
                        </td>
                    ),
                    pre({ children }) {
                        return <>{children}</>
                    },
                    h1: ({ children }) => <div className="text-4xl font-extrabold tracking-tight text-zinc-300 mt-10 mb-5">{children}</div>,
                    h2: ({ children }) => <div className="text-3xl font-bold tracking-tight text-zinc-300 mt-8 mb-4">{children}</div>,
                    h3: ({ children }) => <div className="text-2xl font-semibold text-zinc-300 mt-7 mb-3">{children}</div>,
                    h4: ({ children }) => <div className="text-xl font-semibold text-zinc-300 mt-6 mb-3">{children}</div>,
                    h5: ({ children }) => <div className="text-lg font-medium text-zinc-300 mt-5 mb-2">{children}</div>,
                    h6: ({ children }) => <div className="text-xs font-medium text-zinc-300 tracking-wide mt-4 mb-2">{children}</div>,
                    a: ({ href, children }) => {
                        if (!isSafeUrl(href)) return <span className="text-gray-400">{children}</span>;

                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {children}
                            </a>
                        );
                    },
                    blockquote: ({ children }) => {
                        return <blockquote className="ml-4 pl-2 py-2 my-2 border-l-3 border-gray-500">{children}</blockquote>
                    },
                    img: ({ src, alt }) => {
                        if (!isSafeUrl(src)) return <span className="bg-gray-600 border border-gray-400 text-xs p-2 inline-block rounded">Image externe bloquée</span>;

                        return (
                            <img
                                src={src}
                                alt={alt}
                                className="rounded max-w-full"
                            />
                        );
                    },
                    code(props) {
                        const { children, className, node, ...rest } = props
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : "plaintext";

                        return (
                            <SyntaxHighlighter
                                className="border border-emerald-800 bg-emerald-950"
                                {...rest}
                                language={language}
                                style={dracula}
                                customStyle={{
                                    padding: "0",
                                    marginLeft: "0.5rem"
                                }}
                                codeTagProps={{
                                    style: {
                                        backgroundColor: "var(--color-emerald-950)",
                                        width: "100%",
                                        padding: "0.5rem",
                                        display: "inline-block",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word"
                                    }
                                }}>
                                {String(children ?? "").replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        )
                    }
                }}
            />
        </div>
    );
}
