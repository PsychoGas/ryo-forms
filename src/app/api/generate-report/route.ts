import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { marked } from "marked";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanMarkdown(content: string): string {
  return content.replace(/^```markdown\n?|\n?```$/g, "").trim();
}

function markdownToDocx(markdown: string): Document {
  const tokens = marked.lexer(markdown);
  const docElements: Paragraph[] = [];

  function createTextRun(text: string, options: any = {}): TextRun {
    return new TextRun({
      text,
      bold: options.bold || false,
      italics: options.italics || false,
      underline: options.underline || false,
    });
  }

  function processInlineTokens(text: string): TextRun[] {
    const inlineTokens = marked.lexer(text, { gfm: true });
    return inlineTokens.map((token: any) => {
      switch (token.type) {
        case "strong":
          return createTextRun(token.text, { bold: true });
        case "em":
          return createTextRun(token.text, { italics: true });
        case "del":
          return createTextRun(token.text, { strike: true });
        case "text":
          // Check for underline (not standard Markdown, but often used)
          if (token.text.startsWith("__") && token.text.endsWith("__")) {
            return createTextRun(token.text.slice(2, -2), { underline: true });
          }
          return createTextRun(token.text);
        default:
          return createTextRun(token.raw);
      }
    });
  }

  tokens.forEach((token: marked.Token) => {
    switch (token.type) {
      case "heading":
        docElements.push(
          new Paragraph({
            children: processInlineTokens(token.text),
            heading: HeadingLevel[`HEADING_${token.depth}`] as HeadingLevel,
          })
        );
        break;
      case "paragraph":
        docElements.push(
          new Paragraph({ children: processInlineTokens(token.text) })
        );
        break;
      case "list":
        (token as marked.Tokens.List).items.forEach(
          (item: marked.Tokens.ListItem) => {
            docElements.push(
              new Paragraph({
                children: processInlineTokens(item.text),
                bullet: { level: 0 },
              })
            );
          }
        );
        break;
      // Add more cases for other Markdown elements as needed
    }
  });

  return new Document({
    sections: [
      {
        properties: {},
        children: docElements,
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const { responses, schema } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert data analyst tasked with generating a professional, comprehensive report based on survey responses. Your report should include:

1. An executive summary
2. Detailed analysis of key findings
3. Visual representations of data (described in Markdown, to be converted later)
4. Identification of trends and patterns
5. Actionable insights and recommendations
6. A conclusion summarizing the main points

Format the report using proper Markdown syntax, including:
- Headings (H1, H2, H3) for clear structure
- Bullet points and numbered lists where appropriate
- Bold and italic text for emphasis
- Block quotes for important statements
- Code blocks for any relevant data or calculations

Ensure the report is well-organized, easy to read, and provides valuable insights for decision-makers. Use professional language throughout.`,
        },
        {
          role: "user",
          content: `Generate a detailed report based on the following survey responses and schema:
                    
                    Schema: ${JSON.stringify(schema)}
                    
                    Responses: ${JSON.stringify(responses)}
                    
                    Respond ONLY with the Markdown formatted report, nothing else.`,
        },
      ],
    });

    const content = completion.choices[0].message.content || "";
    const cleanedContent = cleanMarkdown(content);

    const doc = markdownToDocx(cleanedContent);
    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="report.docx"`,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Error generating report" },
      { status: 500 }
    );
  }
}
