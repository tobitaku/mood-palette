import { NextResponse } from 'next/server';
import OpenAI from 'openai';

async function getChatCompletion(content: string) {
  const openai = new OpenAI();

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with a description of a mood, and your task is to generate the CSS code for a color that matches it. Write your output in json with a single key called "css_code".',
      },
      {
        role: 'user',
        content,
      },
    ],
    temperature: 0.6,
  });

  return chatCompletion;
}

function mapColorHexCode(
  chatCompletion: OpenAI.Chat.Completions.ChatCompletion
): string {
  const regexPattern = /(#.*?);/;
  const messageContent = chatCompletion.choices[0].message.content;
  const parsedColorObject: { css_code: string } | null = messageContent
    ? JSON.parse(messageContent)
    : null;
  const extractedColor = parsedColorObject
    ? parsedColorObject.css_code.match(regexPattern)
    : null;
  return extractedColor ? extractedColor[1] : '';
}

export async function POST(request: Request) {
  const { content } = await request.json();
  const chatCompletion = await getChatCompletion(content);
  const color = mapColorHexCode(chatCompletion);

  return NextResponse.json({
    color,
  });
}
