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
  // Normalize and split ingredients
  // Improved splitting to handle nested lists, colons, and common OCR noise
  const rawList = text
    .split(/[,.;\n]|\band\b|[:()\[\]]/i)
    .map(i => i.trim())
    .filter(i => i.length > 1 && !/^(ingredients|agredients|contains|may contain|label|nutrition|facts)$/i.test(i));

  const cleanKeywords = [
    "oat", "almond", "blueberry", "water", "honey", "spinach", "kale", "apple", "banana", "chicken", "beef", "fish",
    "salmon", "egg", "rice", "quinoa", "olive oil", "coconut oil", "broccoli", "carrot", "walnut", "pecan", "sea salt",
    "salt", "pepper", "garlic", "onion", "lemon", "lime", "orange", "strawberry", "raspberry", "avocado", "tomato", "potato",
    "sweet potato", "black bean", "lentil", "chickpea", "milk", "yogurt", "butter", "wheat", "flour", "cocoa", "vanilla",
    "cinnamon", "nutmeg", "ginger", "turmeric", "broccoli", "cauliflower", "asparagus", "corn"
  ];

  const processedKeywords = [
    "maltodextrin", "soy lecithin", "xanthan gum", "carrageenan", "guar gum", "natural flavor", "artificial flavor",
    "canola oil", "soybean oil", "sunflower oil", "corn oil", "palm oil", "vegetable oil", "sugar", "dextrose", "sucrose",
    "modified food starch", "yeast extract", "msg", "monosodium glutamate", "corn syrup", "fructose", "lecithin",
    "cellulose gum", "pectin", "citric acid", "ascorbic acid"
  ];

  const flaggedKeywords = [
    "aspartame", "e951", "high fructose corn syrup", "hfcs", "red 40", "e129", "sodium nitrite", "e250",
    "sodium nitrate", "e251", "bha", "bht", "potassium bromate", "yellow 5", "yellow 6", "blue 1", "hydrogenated",
    "partially hydrogenated", "acesulfame potassium", "sucralose", "saccharin"
  ];

  const ingredients = rawList.map(ing => {
    const lowerIng = ing.toLowerCase();

    // FLAGGED CHECK
    for (const k of flaggedKeywords) {
      if (lowerIng.includes(k)) {
        return {
          name: ing,
          classification: "flagged",
          body: "Some studies have examined possible associations between certain artificial additives and inflammatory responses in some individuals.",
          health: "Nutritional literature has associated long-term consumption of various synthetic additives with areas of ongoing research regarding metabolic health.",
          mind: "Some researchers are exploring how certain artificial compounds might interact with neurological focus and mood patterns."
        };
      }
    }

    // PROCESSED CHECK
    for (const k of processedKeywords) {
      if (lowerIng.includes(k)) {
        return {
          name: ing,
          classification: "processed",
          body: "This ingredient is often used as a stabilizer, sweetener, or refined oil. Some research suggests monitoring the intake of highly refined items for optimal digestive balance.",
          health: "Certain studies have examined possible associations between highly processed ingredients and gut microbiome health.",
          mind: "Some individuals report experiencing energy fluctuations after consuming high-glycemic or refined additives."
        };
      }
    }

    // CLEAN CHECK
    for (const k of cleanKeywords) {
      if (lowerIng.includes(k)) {
        return {
          name: ing,
          classification: "clean",
          body: "Recognized in nutritional research for providing essential nutrients or fiber that support digestive health.",
          health: "Multiple studies have associated whole food ingredients with supportive roles in cardiovascular and immune function.",
          mind: "Associated in nutritional literature with providing stable energy release, which some researchers link to sustained focus."
        };
      }
    }

    // DEFAULT (Unclassified/Neutral)
    return {
      name: ing,
      classification: "pending",
      body: "Further verification of this specific ingredient's source is needed for a precise classification. Generally, whole-food sources are preferred.",
      health: "The impact of this ingredient depends on its concentration and processing level. Research on minor additives is ongoing.",
      mind: "Nutritional researchers generally suggest that a diet focused on verified whole foods may support cognitive wellness."
    };
  });

  const clean_count = ingredients.filter(f => f.classification === "clean").length;
  const processed_count = ingredients.filter(f => f.classification === "processed").length;
  const flagged_count = ingredients.filter(f => f.classification === "flagged").length;
  const pending_count = ingredients.filter(f => f.classification === "pending").length;

  let grade = "C";
  let grade_reason = "This product contains a mix of ingredients. Moderation and focus on whole foods are generally suggested by nutritional researchers.";

  if (flagged_count === 0 && processed_count === 0 && clean_count > 0) {
    grade = "A";
    grade_reason = "This product appears to have a very clean, whole-food profile based on available research.";
  } else if (flagged_count === 0 && processed_count <= 2) {
    grade = "B";
    grade_reason = "This product has a largely clean profile with minimal processed items that some research suggests monitoring.";
  } else if (flagged_count > 2 || (flagged_count > 0 && processed_count > 5)) {
    grade = "F";
    grade_reason = "This product's ingredient profile contains multiple additives that nutritional researchers generally recommend limiting.";
  } else if (flagged_count > 0) {
    grade = "D";
    grade_reason = "This product's ingredient profile contains certain additives that ongoing research continues to examine closely.";
  }

  return {
    product_name: "Analyzed Product",
    grade,
    grade_reason,
    vitality_summary: `Analysis: ${clean_count} Clean, ${processed_count} Processed, ${flagged_count} Flagged, and ${pending_count} Pending Verification.`,
    clean_count,
    processed_count,
    flagged_count,
    pending_count,
    advice: "Consider focusing on whole, minimally processed foods to support long-term wellness. Consider consulting a healthcare professional for personalized dietary guidance.",
    ingredients
  };
}
