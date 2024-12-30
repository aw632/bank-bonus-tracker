import { NextResponse } from "next/server";
import { Cerebras } from "@cerebras/cerebras_cloud_sdk";

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

const PROMPT_TEMPLATE = `You are a specialized parser that converts bank account bonus descriptions into structured JSON format. Your task is to carefully analyze the provided text and extract key information about bank bonuses.

VERY IMPORTANT: Output ONLY the raw JSON object with no explanation, no markdown formatting, no backticks, and no "json" label. The response should start with "{" and end with "}" with nothing before or after.

The JSON must conform to this schema:
{
  "type": "object",
  "required": ["bankName", "accountType", "amount", "requirements"],
  "properties": {
    "bankName": {
      "type": "string",
      "description": "Name of the bank offering the bonus"
    },
    "accountType": {
      "type": "string",
      "enum": ["Checking", "Savings", "Money Market"],
      "description": "Type of account eligible for the bonus"
    },
    "amount": {
      "type": "number",
      "description": "Bonus amount offered"
    },
    "requirements": {
      "type": "object",
      "required": ["deposits", "timeFrame"],
      "properties": {
        "deposits": {
          "type": "object",
          "required": ["type"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["total", "each", "both"],
              "description": "Type of deposit requirement - total sum, each deposit amount, or both"
            },
            "totalAmount": {
              "type": "number",
              "description": "Required total deposit amount"
            },
            "eachAmount": {
              "type": "number",
              "description": "Required amount for each deposit"
            },
            "count": {
              "type": "number",
              "description": "Number of required deposits"
            }
          },
          "allOf": [
            {
              "if": {
                "properties": { "type": { "const": "total" } }
              },
              "then": {
                "required": ["totalAmount"]
              }
            },
            {
              "if": {
                "properties": { "type": { "const": "each" } }
              },
              "then": {
                "required": ["eachAmount", "count"]
              }
            },
            {
              "if": {
                "properties": { "type": { "const": "both" } }
              },
              "then": {
                "required": ["totalAmount", "eachAmount", "count"]
              }
            }
          ]
        },
        "timeFrame": {
          "type": "number",
          "description": "Time frame in days to meet the deposit requirements"
        },
        "holdPeriod": {
          "type": "number",
          "description": "Optional period in days the funds must be held in the account"
        }
      }
    }
  }
}

Rules for parsing:
1. Deposit requirements:
   - Use "total" when only a total amount is required
   - Use "each" when individual deposit amounts are specified
   - Use "both" when both total and individual deposit requirements exist
2. Convert all time periods to days (e.g., 3 months = 90 days)
3. For multiple bonus tiers, use the highest bonus amount and its corresponding requirements
4. Remove any currency symbols from numerical values
5. Include holdPeriod only if there is a specific early termination fee period
6. All numbers should be plain numbers without quotes, commas, or currency symbols

Bank bonus description to parse:

`;

function cleanJsonResponse(response: string): string {
  // Remove markdown code blocks if present
  let cleaned = response.replace(/```(?:json)?\n?/g, "");

  // Remove any whitespace before first { and after last }
  cleaned = cleaned.trim();

  // If the response doesn't start with { and end with }, it's invalid
  if (!cleaned.startsWith("{") || !cleaned.endsWith("}")) {
    throw new Error(
      "Invalid JSON format: Response must start with { and end with }"
    );
  }

  return cleaned;
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Missing bonus text" },
        { status: 400 }
      );
    }

    // Combine the template with the input text
    const fullPrompt = `${PROMPT_TEMPLATE}${text}`;

    const completion = (await client.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.1,
      max_tokens: 1000,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

    const jsonStr = completion.choices[0].message.content;

    try {
      // Clean the response before parsing
      const cleanedJsonStr = cleanJsonResponse(jsonStr);
      const parsedBonus = JSON.parse(cleanedJsonStr);
      return NextResponse.json(parsedBonus);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw LLM Response:", jsonStr);
      console.error("Cleaned Response:", cleanJsonResponse(jsonStr));
      return NextResponse.json(
        {
          error: "Invalid JSON returned from LLM",
          rawResponse: jsonStr,
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("Error parsing bonus:", error);
    return NextResponse.json(
      { error: "Failed to parse bonus text" },
      { status: 400 }
    );
  }
}
