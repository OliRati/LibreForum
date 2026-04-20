import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
    content: string;
}

export default function ShowMarkdown({ content }: Props) {
    const fixedContent = String(content)
        // force newline after ```
        .replace(/```([^\n]*)[ \t]+/g, "```$1\n\n")
        // Prevent triples line feed
        .replace(/\n{3,}/g, "\n\n")
        // Normalize lists
        .replace(/^(\d+)[\)\-]\s+/gm, "$1. ");

    return (
        <div className="prose lg:prose-xl [&_ol]:list-decimal [&_ol]:pl-6 text-left">
            <ReactMarkdown
                children={fixedContent}
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    pre({ children }) {
                        return <>{children}</>
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
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        )
                    }
                }}
            />
        </div>
    );
}
