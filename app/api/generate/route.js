import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from '@google/generative-ai';
// import OpenAI from 'openai'

// Example input: write flashcards for how to present in front of a big crowd

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

        // Initialize the GoogleGenerativeAI client with your API key
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        // Get the generative model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Generate content using the model
        const result = await model.generateContent({
            contents: [
                {
                    role: 'model',
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: 'user',
                    parts: [{ text: data }]
                }
            ],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.1,
            }
        });

        // Log the raw API response to understand its structure
        // console.log("Raw API Response:", result);

        // Access the response text
        const responseText = await result.response.text();
        // console.log("Response Text:", responseText);

        // Clean up astericks 
        // Clean up asterisks and additional text
        const finalText = responseText
            .replace(/^```json/, "")  // Remove the starting ```json
            .replace(/```$/, "")      // Remove the ending ```
            .replace(/\*/g, "")
            .trim();                  // Trim any leading or trailing whitespace

        // Attempt to parse the response text
        const flashcards = JSON.parse(finalText);
        // console.log("Parsed Response:", parsedResponse);

        // Check and adjust based on the actual response structure
        if (flashcards && flashcards.flashcards) {
            // Return the flashcards as a JSON response
            return NextResponse.json(flashcards.flashcards);
        } else {
            throw new Error("Unexpected response structure");
        }

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error generating flashcards:", error);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }

    //     // Check and adjust based on the actual response structure
    //     if (parsedResponse && parsedResponse.choices && parsedResponse.choices.length > 0) {
    //         // Example structure adjustment based on actual response
    //         const choice = parsedResponse.choices[0];
    //         if (choice && choice.message && choice.message.content) {
    //             const flashcards = JSON.parse(choice.message.content);

    //             // Return the flashcards as a JSON response
    //             return NextResponse.json({ flashcards });
    //         } else {
    //             throw new Error("Message content not found in response");
    //         }
    //     } else {
    //         throw new Error("Unexpected response structure");
    //     }

    // } catch (error) {
    //     // Log the error for debugging purposes
    //     console.error("Error generating flashcards:", error);
    //     return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    // }
}

// export async function POST(req) {
//     try {
//         const data = await req.text();

//         // Log the incoming request data
//         // console.log("Request data:", data);

//         // Initialize the GoogleGenerativeAI client with your API key
//         const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//         // Get the generative model
//         const model = genAI.getGenerativeModel({
//             model: "gemini-1.5-flash",
//             generationConfig: { responseMimeType: "application/json" }
//         });

//         // // Create the messages array
//         // const messages = [
//         //     { role: 'system', content: systemPrompt },
//         //     { role: 'user', content: data }
//         // ];

//         // Log the messages to ensure they are formatted correctly
//         // console.log("Messages:", messages);

//         // Generate content using the model
//         const result = await model.generateContent({
//             contents: [
//                 {
//                     role: 'model',
//                     parts: [{text: systemPrompt}]
//                 },
//                 {
//                     role: 'user',
//                     parts: [{text: data}]
//                 }
//             ]
//         })

//         // Log the raw API response
//         console.log("Raw API Response:", result);

//         // Check if the response contains the expected structure
//         if (result.choices && result.choices.length > 0 && result.choices[0].message) {
//             // Parse the content of the response
//             const flashcards = JSON.parse(result.choices[0].message.content);

//             // Return the flashcards as a JSON response
//             return NextResponse.json({ flashcards });
//         } else {
//             // Handle the case where the expected data is not present
//             throw new Error("Unexpected response structure");
//         }

//     } catch (error) {
//         // Log the error for debugging purposes
//         console.error("Error generating flashcards:", error);
//         return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
//     }
// }


// export async function POST(req) {
//     try {
//         const data = await req.text();

//         // Log the data to see what is being passed
//         console.log("Request data:", data);

//         // Initialize the GoogleGenerativeAI client with your API key
//         const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//         // Get the model
//         const model = genAI.getGenerativeModel({
//             model: "gemini-1.5-flash",
//             generationConfig: { responseMimeType: "application/json" }
//         });

//         // Create the messages array
//         const messages = [
//             { role: 'system', content: systemPrompt },
//             { role: 'user', content: data }
//         ];

//         // Log the messages to see if they are correct
//         console.log("Messages:", messages);

//         // Generate content using the model
//         const result = await model.generateContent({
//             messages: messages
//         });

//         // Parse the result correctly
//         const flashcards = JSON.parse(result.choices[0].message.content);

//         // Return the flashcards as a JSON response
//         return NextResponse.json({ flashcards });

//     } catch (error) {
//         console.error("Error generating flashcards:", error);
//         return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
//     }
// }

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