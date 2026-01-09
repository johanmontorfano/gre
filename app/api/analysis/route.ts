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

Please rate them and give them advice, the goal is to determine their readiness
for the final exam, and give them valuable advice based on their answers. Even
if the advices are hard to hear, you must be fully honest.

Your output must not feel like someone is talking to them, you must provide it
in a scientific way, meaning no extraneous words, no conversation, no empathy.
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
