import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from '@google/generative-ai';
// import OpenAI from 'openai'

const systemPrompt = `You are a flashcard creator designed to help users study and memorize information effectively. Your task is to generate clear, concise, and accurate flashcards based on the provided content. 
1. Ensure that both the question and answer are easy to understand.
2. Avoid complex language or jargon unless the flashcard is intended for advanced learners.
3. Keep the information on each flashcard concise.
4. Break down complex topics into multiple cards if needed.
5. Each flashcard should focus on a single concept or question.
6. If a topic is broad, create multiple cards to cover different aspects.
7.Tailor the flashcards to the specific needs or goals of the user, based on the provided content or study material.
8. Adapt the content, style, or difficulty level based on the user's feedback or preferences.
9. Maintain a uniform format for all flashcards, ensuring that each card follows the same structure and style.
10. Ensure that all information on the flashcards is factually correct and up-to-date.
11. Where appropriate, incorporate engaging elements such as examples, mnemonics, or visuals to enhance understanding and retention.
12. Only generate 10 flashcards.

Return in the following JSON format:
{
    "flashcards": [
        {
        "front": str,
        "back": str
        }
    ]
}
`

export async function POST(req) {
    try {
        const data = await req.text();

        // Log the data to see what is being passed
        console.log("Request data:", data);

        // Initialize the GoogleGenerativeAI client with your API key
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        // Get the model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Create the messages array
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data }
        ];

        // Log the messages to see if they are correct
        console.log("Messages:", messages);

        // Generate content using the model
        const result = await model.generateContent({
            messages: messages
        });

        // Parse the result correctly
        const flashcards = JSON.parse(result.choices[0].message.content);

        // Return the flashcards as a JSON response
        return NextResponse.json({ flashcards });

    } catch (error) {
        console.error("Error generating flashcards:", error);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }
}

// export async function POST(req) {
//     const data = await req.text();

//     // Initialize the GoogleGenerativeAI client with your API key
//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//     const model = genAI.getGenerativeModel({ 
//         model: "gemini-1.5-flash",
//         // Set the `responseMimeType` to output JSON
//         generationConfig: { responseMimeType: "application/json" } 
//     })
//     const result = await model.generateContent({
//         messages: [
//             {role: 'system', content: systemPrompt},
//             {role: 'user', content: data}
//         ]
//     })
//     // const response = await result.response
//     const flashcards = JSON.parse(result.choices[0].messages.content)

//     return new NextResponse.json(flashcards.flashcard)
// }