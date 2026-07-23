import type { FolderType, ProjectType } from "@/generated/prisma3";

export type BlueprintFolder = {
  name: string;
  folderType: FolderType;
  children?: BlueprintFolder[];
};

export type ProjectBlueprint = {
  id: "Software" | "Healthcare";
  projectType: ProjectType;
  folders: BlueprintFolder[];
  taskHints: string[];
  knowledgeHints: string[];
  templateHints: string[];
};

export const SOFTWARE_BLUEPRINT: ProjectBlueprint = {
  id: "Software",
  projectType: "Software",
  folders: [
    { name: "src", folderType: "Development" },
    { name: "docs", folderType: "Knowledge" },
    { name: "design", folderType: "Design" },
    { name: "api", folderType: "Development" },
    { name: "tests", folderType: "Development" },
  ],
  taskHints: [
    "Architecture",
    "Database",
    "Authentication",
    "Deployment",
  ],
  knowledgeHints: [
    "Requirements",
    "Architecture Decisions",
    "Meeting Notes",
  ],
  templateHints: ["PRD", "System Design", "API Spec", "README"],
};

export const HEALTHCARE_BLUEPRINT: ProjectBlueprint = {
  id: "Healthcare",
  projectType: "Healthcare",
  folders: [
    { name: "Contracts", folderType: "Legal" },
    { name: "Training", folderType: "Operations" },
    { name: "Deployment", folderType: "Operations" },
    { name: "Configuration", folderType: "Operations" },
    { name: "Support", folderType: "Operations" },
  ],
  taskHints: [],
  knowledgeHints: [
    "Hospital Contacts",
    "Meeting Notes",
    "Requirements",
  ],
  templateHints: [
    "Proposal",
    "Implementation Plan",
    "Go-Live Checklist",
    "Risk Register",
    "Training Manual",
  ],
};

export function getBlueprint(
  id: "Software" | "Healthcare" | "none" | undefined,
): ProjectBlueprint | null {
  if (id === "Software") return SOFTWARE_BLUEPRINT;
  if (id === "Healthcare") return HEALTHCARE_BLUEPRINT;
  return null;
}

export function inferBlueprintFromPrompt(
  prompt: string,
): ProjectBlueprint | null {
  const p = prompt.toLowerCase();
  if (/hospital|health|clinic|pharmacy|hms|ehr/.test(p)) {
    return HEALTHCARE_BLUEPRINT;
  }
  if (/software|app|saas|api|code|dev|engineering/.test(p)) {
    return SOFTWARE_BLUEPRINT;
  }
  return SOFTWARE_BLUEPRINT;
}

export function suggestFolderTree(prompt: string): BlueprintFolder[] {
  const p = prompt.toLowerCase();
  if (/market/.test(p)) {
    return [
      {
        name: "Marketing",
        folderType: "Marketing",
        children: [
          { name: "Campaigns", folderType: "Marketing" },
          { name: "Social Media", folderType: "Marketing" },
          { name: "Brand Assets", folderType: "Assets" },
          { name: "Reports", folderType: "Knowledge" },
          { name: "Budget", folderType: "Finance" },
          { name: "Research", folderType: "Research" },
        ],
      },
    ];
  }
  if (/sales/.test(p)) {
    return [
      {
        name: "Sales",
        folderType: "Sales",
        children: [
          { name: "Pipeline", folderType: "Sales" },
          { name: "Proposals", folderType: "Templates" },
          { name: "Contracts", folderType: "Legal" },
        ],
      },
    ];
  }
  if (/software|dev|eng/.test(p)) {
    return SOFTWARE_BLUEPRINT.folders;
  }
  if (/health|hospital/.test(p)) {
    return HEALTHCARE_BLUEPRINT.folders;
  }
  return [
    {
      name: "General",
      folderType: "General",
      children: [
        { name: "Documents", folderType: "Knowledge" },
        { name: "Assets", folderType: "Assets" },
      ],
    },
  ];
}
