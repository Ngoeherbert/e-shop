import { NextRequest, NextResponse } from "next/server";

interface CategoryInput {
  id: number;
  name: string;
}

function fallbackProduct(productName: string | undefined, categories: CategoryInput[] = []) {
  return {
    name: productName || "Premium Lifestyle Product",
    description: `${productName || "This product"} is a quality item selected for everyday use, strong visual appeal, and dependable value. It is ideal for shoppers who want a practical product that still feels polished and gift-ready.`,
    price: "49.99",
    originalPrice: "69.99",
    stock: "12",
    categoryId: categories[0]?.id ? String(categories[0].id) : "",
    featured: true,
    trending: false,
  };
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export async function POST(req: NextRequest) {
  const { productName, imageUrl, categories = [] } = await req.json();
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const prompt = `Scan the selected product image and return only valid JSON for an ecommerce product form. Infer a short product name, a 2-3 sentence product description, a reasonable USD price, optional originalPrice, stock quantity, whether it should be featured/trending, and the best categoryId from this category list: ${JSON.stringify(categories)}. JSON keys: name, description, price, originalPrice, stock, categoryId, featured, trending.`;

  try {
    if (geminiKey && imageUrl) {
      const parsedImage = parseDataUrl(imageUrl);
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              ...(parsedImage ? [{ inline_data: { mime_type: parsedImage.mimeType, data: parsedImage.data } }] : []),
            ],
          }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.35 },
        }),
      });
      if (!geminiRes.ok) throw new Error("Gemini error");
      const geminiData = await geminiRes.json();
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      const parsed = JSON.parse(text);
      return NextResponse.json({ product: { ...fallbackProduct(productName, categories), ...parsed } });
    }

    if (!openaiKey) {
      return NextResponse.json({ product: fallbackProduct(productName, categories) });
    }

    const messages: any[] = [
      {
        role: "user",
        content: imageUrl
          ? [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ]
          : `${prompt}\nExisting product name: ${productName || ""}`,
      },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: imageUrl ? "gpt-4o" : "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
        max_tokens: 450,
        temperature: 0.4,
      }),
    });

    if (!res.ok) throw new Error("OpenAI error");
    const data = await res.json();
    const content = data.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return NextResponse.json({ product: { ...fallbackProduct(productName, categories), ...parsed } });
  } catch {
    return NextResponse.json({ product: fallbackProduct(productName, categories) });
  }
}
