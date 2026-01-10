import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function generate(
    prompt: string,
    answer: string
): Promise<string> {
    const model = "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";
    const payload = {
        model,
        messages: [
            {
                role: "system",
                content: `
Someone studying for the GRE attempted to solve this exercise: ${prompt}

You must rate them and respect the rating principles of the GRE:

The statements below describe, for each score level, the overall quality of analytical writing demonstrated. The test assesses your critical thinking and analytical writing skills (the ability to reason, assemble evidence to develop a position and communicate complex ideas) along with your control of grammar and the mechanics of writing.

 

Scores 6 and 5.5
Sustains insightful, in-depth analysis of complex ideas; develops and supports main points with logically compelling reasons and/or highly persuasive examples; is well focused and well organized; skillfully uses sentence variety and precise vocabulary to convey meaning effectively; demonstrates superior facility with sentence structure and usage, but may have minor errors that do not interfere with meaning.

 

Scores 5 and 4.5
Provides generally thoughtful analysis of complex ideas; develops and supports main points with logically sound reasons and/or well-chosen examples; is generally focused and well organized; uses sentence variety and vocabulary to convey meaning clearly; demonstrates good control of sentence structure and usage, but may have minor errors that do not interfere with meaning.

 

Scores 4 and 3.5
Provides competent analysis of ideas in addressing specific task directions; develops and supports main points with relevant reasons and/or examples; is adequately organized; conveys meaning with acceptable clarity; demonstrates satisfactory control of sentence structure and usage, but may have some errors that affect clarity.

 

Scores 3 and 2.5
Displays some competence in analytical writing and addressing specific task directions, although the writing is flawed in at least one of the following ways: limited analysis or development; weak organization; weak control of sentence structure or usage, with errors that often result in vagueness or a lack of clarity.

 

Scores 2 and 1.5
Displays serious weaknesses in analytical writing. The writing is seriously flawed in at least one of the following ways: serious lack of analysis or development; unclear in addressing specific task directions; lack of organization; frequent problems in sentence structure or usage, with errors that obscure meaning.

 

Scores 1 and 0.5
Displays fundamental deficiencies in analytical writing. The writing is fundamentally flawed in at least one of the following ways: content that is extremely confusing or mostly irrelevant to the assigned tasks; little or no development; severe and pervasive errors that result in incoherence.

 

Score 0
Your analytical writing skills cannot be evaluated because the response does not address any part of the assigned task(s), merely attempts to copy the assignments, is in a foreign language or displays only indecipherable text.

 

Score NS
You produced no text whatsoever
                `,
            },
            {
                role: "user",
                content: `Here is my answer to this exercise: ${answer}`,
            },
        ],
        temperature: 0.3,
        max_tokens: 512,
    };

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: [
                ["Authorization", `Bearer ${process.env.OPENROUTER_API_KEY!}`],
                ["Content-Type", "application/json"],
            ],
            body: JSON.stringify(payload),
        },
    );

    const content = await response.json();

    if (content.choices)
        return content.choices[0].message.content;
    return content;
}

export async function POST(req: NextRequest) {
    const { prompt, answer } = await req.json();
    const final = await generate(prompt, answer);

    return NextResponse.json({ final });
}
