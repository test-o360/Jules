import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients) {
      return NextResponse.json(
        { error: "Ingredients are required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeIngredients(ingredients);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze ingredients" },
      { status: 500 }
    );
  }
}

async function analyzeIngredients(text: string) {
  const ingredientsList = text.split(/[,.;\n]/).map(i => i.trim()).filter(Boolean);

  const findings = ingredientsList.map(ing => {
    const lowerIng = ing.toLowerCase();

    // Additives
    if (lowerIng.includes("aspartame") || lowerIng.includes("e951")) {
      return {
        name: ing,
        impact: "Harmful",
        score: "D",
        effect: "Artificial sweetener. May cause headaches, dizziness, and is linked to various health concerns in long-term studies.",
        category: "Additives"
      };
    }
    if (lowerIng.includes("high fructose corn syrup") || lowerIng.includes("hfcs")) {
      return {
        name: ing,
        impact: "Harmful",
        score: "E",
        effect: "Linked to obesity, insulin resistance, and increased risk of type 2 diabetes.",
        category: "Sugars"
      };
    }
    if (lowerIng.includes("monosodium glutamate") || lowerIng.includes("msg") || lowerIng.includes("e621")) {
      return {
        name: ing,
        impact: "Moderate",
        score: "C",
        effect: "Flavor enhancer. Some people may experience sensitivity (headaches, flushing).",
        category: "Flavor Enhancers"
      };
    }
    if (lowerIng.includes("palm oil")) {
      return {
        name: ing,
        impact: "Moderate",
        score: "C",
        effect: "High in saturated fats. Environmental concerns regarding deforestation.",
        category: "Fats"
      };
    }
    if (lowerIng.includes("sodium nitrite") || lowerIng.includes("e250")) {
      return {
        name: ing,
        impact: "Harmful",
        score: "E",
        effect: "Preservative used in processed meats. Linked to increased risk of certain cancers.",
        category: "Preservatives"
      };
    }
    if (lowerIng.includes("red 40") || lowerIng.includes("e129")) {
      return {
        name: ing,
        impact: "Harmful",
        score: "D",
        effect: "Artificial color. Linked to hyperactivity in children and potential allergic reactions.",
        category: "Colors"
      };
    }
    if (lowerIng.includes("titanium dioxide") || lowerIng.includes("e171")) {
      return {
        name: ing,
        impact: "Harmful",
        score: "D",
        effect: "Whitening agent. Banned in EU due to concerns about genotoxicity.",
        category: "Colors"
      };
    }
    if (lowerIng.includes("potassium bromate") || lowerIng.includes("e924")) {
      return {
        name: ing,
        impact: "Harmful",
        score: "E",
        effect: "Flour improver. Classified as a possible human carcinogen.",
        category: "Additives"
      };
    }
    if (lowerIng.includes("bha") || lowerIng.includes("e320") || lowerIng.includes("butylated hydroxyanisole")) {
      return {
        name: ing,
        impact: "Harmful",
        score: "D",
        effect: "Antioxidant preservative. Linked to hormone disruption and potential carcinogenicity.",
        category: "Preservatives"
      };
    }

    return {
      name: ing,
      impact: "Safe",
      score: "A",
      effect: "Information for this specific ingredient is not yet in our prioritized database. Most natural ingredients are safe, but check for personal allergies.",
      category: "Pending Verification"
    };
  });

  const harmfulCount = findings.filter(f => f.impact === "Harmful").length;
  const moderateCount = findings.filter(f => f.impact === "Moderate").length;

  let overallScore = "A";
  if (harmfulCount > 2) overallScore = "E";
  else if (harmfulCount > 0) overallScore = "D";
  else if (moderateCount > 2) overallScore = "C";
  else if (moderateCount > 0) overallScore = "B";

  return {
    score: overallScore,
    findings,
    summary: `Found ${harmfulCount} harmful and ${moderateCount} moderate ingredients.`
  };
}
