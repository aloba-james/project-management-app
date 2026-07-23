import { NextRequest } from "next/server";
import { requireAppUser } from "@/lib/workspace-auth";
import { buildAiSuggestions } from "@/lib/ai-suggestions";
import { jsonError, jsonOk } from "@/lib/api-response";
import { aiSuggestionsSchema } from "@/validators/workspace.schema";

export async function POST(request: NextRequest) {
  try {
    await requireAppUser();
    const body = aiSuggestionsSchema.parse(await request.json());
    const suggestions = buildAiSuggestions(body);
    return jsonOk({ suggestions });
  } catch (error) {
    return jsonError(error);
  }
}
