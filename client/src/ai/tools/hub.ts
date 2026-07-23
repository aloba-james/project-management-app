import { runTool, listTools } from "@/brain/tools/registry";
import type { ToolContext, ToolResult } from "@/brain/types";

/**
 * Tool Hub facade — single entry for tool discovery and invocation.
 */
export const toolHub = {
  name: "tool-hub",
  list: listTools,
  async invoke(
    toolName: string,
    ctx: ToolContext,
    args?: Record<string, unknown>,
  ): Promise<ToolResult> {
    return runTool(toolName, ctx, args);
  },
  health() {
    return {
      ok: true,
      detail: `tools=${listTools().length}`,
    };
  },
};
