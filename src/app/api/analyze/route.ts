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
  const rawList = text
    .split(/[,.;\n]|\band\b|[:()\[\]]/i)
    .map(i => i.trim())
    .filter(i => i.length > 1 && !/^(ingredients|agredients|contains|may contain|label|nutrition|facts)$/i.test(i));

  // OCR Correction Mapping
  const ocrCorrections: Record<string, string> = {
    "jdum": "sodium",
    "igor": "regulator",
    "eral": "regulator",
    "ators": "regulators",
    "regulator": "regulator",
  };

  const cleanKeywords = [
    { word: "oat", body: "Oats are recognized in nutritional research for providing beta-glucan fiber that support digestive health.", health: "Studies have associated whole grains with supportive roles in cardiovascular function.", mind: "Provides stable energy release which some link to sustained focus." },
    { word: "almond", body: "Almonds provide healthy fats and protein that support cell health.", health: "Nutritional literature associates nuts with cardiovascular wellness.", mind: "Source of Vitamin E which is studied for cognitive support." },
    { word: "blueberry", body: "Source of anthocyanins that support cellular defense.", health: "High in antioxidants studied for immune and heart health.", mind: "Berries are often researched for their potential roles in cognitive longevity." },
    { word: "water", body: "Essential for all biological processes and cellular hydration.", health: "Critical for maintaining blood volume and organ function.", mind: "Proper hydration is linked to maintained concentration and mood stability." },
    { word: "honey", body: "Natural sweetener that provides some trace enzymes.", health: "Studies have explored honey's role in supporting immune response.", mind: "Provides quick energy for brain function." },
    { word: "spinach", body: "Source of iron and folate for blood health.", health: "Leafy greens support overall metabolic wellness.", mind: "Contains nutrients studied for long-term brain health." },
    { word: "kale", body: "High in Vitamins K, A, and C for bone and immune support.", health: "Cruciferous vegetables are associated with longevity.", mind: "Rich in antioxidants for cognitive wellness." },
    { word: "apple", body: "Provides pectin fiber for gut health.", health: "Whole fruits are linked to heart health in literature.", mind: "Provides natural glucose for steady brain fuel." },
    { word: "banana", body: "Source of potassium for muscle and nerve function.", health: "Supports electrolyte balance and heart rhythm.", mind: "Contains B6 which is studied for neurotransmitter support." },
    { word: "chicken", body: "High-quality protein source for muscle maintenance.", health: "Provides essential amino acids for tissue repair.", mind: "Provides choline studied for memory support." },
    { word: "beef", body: "Rich source of heme iron and B12.", health: "Supports oxygen transport and energy metabolism.", mind: "B12 is critical for nervous system health." },
    { word: "fish", body: "Source of lean protein.", health: "Fish consumption is generally linked to heart wellness.", mind: "Nutrients in fish support general brain health." },
    { word: "salmon", body: "High in Omega-3 fatty acids.", health: "Omega-3s are heavily studied for cardiovascular support.", mind: "DHA in salmon is a primary structural component of the brain." },
    { word: "egg", body: "Complete protein source with high bioavailability.", health: "Contains lutein and zeaxanthin for cellular health.", mind: "Leading source of choline for brain function." },
    { word: "rice", body: "Primary energy source through complex carbohydrates.", health: "Whole grain rice supports sustained glucose levels.", mind: "Provides steady fuel for mental tasks." },
    { word: "quinoa", body: "Complete plant-based protein with fiber.", health: "Supports metabolic balance and sustained energy.", mind: "Provides magnesium which is linked to relaxation." },
    { word: "olive oil", body: "Source of monounsaturated fats (oleic acid).", health: "The Mediterranean diet links olive oil to heart health.", mind: "Antioxidants in olive oil support brain cell protection." },
    { word: "coconut oil", body: "Source of medium-chain triglycerides (MCTs).", health: "Nutritional literature examines MCTs for quick energy.", mind: "MCTs are studied for their role in brain energy metabolism." },
    { word: "broccoli", body: "Contains sulforaphane for cellular health.", health: "Supports liver detoxification and immune function.", mind: "High in Vitamin K for cognitive support." },
    { word: "carrot", body: "Source of beta-carotene for cellular health.", health: "Antioxidants support immune and skin health.", mind: "Supports general vascular health which benefits the brain." },
    { word: "walnut", body: "Source of alpha-linolenic acid (ALA).", health: "Supports cardiovascular wellness.", mind: "Often cited as the 'brain nut' for its ALA content." },
    { word: "pecan", body: "Provides healthy fats and minerals.", health: "Supports heart health and metabolic function.", mind: "Antioxidants support long-term wellness." },
    { word: "sea salt", body: "Provides essential sodium for nerve signals.", health: "Critical for fluid balance at correct concentrations.", mind: "Sodium-potassium pump is essential for brain signaling." },
    { word: "salt", body: "Provides essential sodium for nerve signals.", health: "Critical for fluid balance at correct concentrations.", mind: "Sodium-potassium pump is essential for brain signaling." },
    { word: "pepper", body: "Contains piperine which can enhance nutrient absorption.", health: "Antioxidants support general metabolic health.", mind: "Minor role in supporting general vitality." },
    { word: "garlic", body: "Contains allicin for immune support.", health: "Studies link garlic to cardiovascular wellness.", mind: "Supports healthy blood flow." },
    { word: "onion", body: "Source of quercetin and sulfur compounds.", health: "Supports heart health and immune function.", mind: "Provides antioxidants for general wellness." },
    { word: "lemon", body: "High in Vitamin C and citrus bioflavonoids.", health: "Supports immune function and iron absorption.", mind: "Scent and nutrients associated with alertness." },
    { word: "lime", body: "Source of Vitamin C for immune support.", health: "Supports antioxidant status in the body.", mind: "Supports general vitality." },
    { word: "orange", body: "High in Vitamin C and fiber.", health: "Supports heart health and immune defense.", mind: "Provides steady natural energy." },
    { word: "strawberry", body: "Rich in Vitamin C and manganese.", health: "Antioxidants support cardiovascular health.", mind: "Berries support long-term cognitive wellness." },
    { word: "raspberry", body: "High in fiber and Vitamin C.", health: "Supports gut health and immune response.", mind: "Anthocyanins support brain health." },
    { word: "avocado", body: "Source of healthy monounsaturated fats.", health: "Supports heart health and nutrient absorption.", mind: "Lutein in avocado is studied for cognitive health." },
    { word: "tomato", body: "Source of lycopene for cellular protection.", health: "Associated with heart and skin health.", mind: "Antioxidants support general wellness." },
    { word: "potato", body: "Source of complex carbohydrates and potassium.", health: "Provides energy and supports electrolyte balance.", mind: "Provides steady glucose for the brain." },
    { word: "sweet potato", body: "Rich in beta-carotene and fiber.", health: "Supports immune function and gut health.", mind: "Provides stable energy release." },
    { word: "black bean", body: "High in fiber and plant-based protein.", health: "Supports gut health and blood sugar balance.", mind: "Source of folate for nervous system support." },
    { word: "lentil", body: "Source of fiber, protein, and iron.", health: "Supports cardiovascular and metabolic health.", mind: "Iron is critical for brain oxygenation." },
    { word: "chickpea", body: "Source of fiber and manganese.", health: "Supports digestive wellness and bone health.", mind: "Source of tryptophan for mood support." },
    { word: "milk", body: "Source of calcium and Vitamin D.", health: "Supports bone health and muscle function.", mind: "Provides nutrients for nerve signal transmission." },
    { word: "yogurt", body: "Source of probiotics for gut health.", health: "Probiotics support the immune system.", mind: "The gut-brain axis links gut health to mood." },
    { word: "butter", body: "Source of fat-soluble vitamins (A, E, K2).", health: "Fat is essential for hormone production.", mind: "Lipids are a primary component of brain structure." },
    { word: "wheat", body: "Source of energy from carbohydrates.", health: "Whole wheat provides fiber for gut health.", mind: "Provides glucose for mental tasks." },
    { word: "flour", body: "Common source of carbohydrates.", health: "Provides fuel for bodily functions.", mind: "Energy source for the brain." },
    { word: "cocoa", body: "Source of polyphenols and flavanols.", health: "Studies link cocoa to cardiovascular wellness.", mind: "Flavanols support healthy brain blood flow." },
    { word: "vanilla", body: "Aromatic flavoring.", health: "Generally recognized as safe.", mind: "Scent is studied for relaxing properties." },
    { word: "cinnamon", body: "Contains antioxidants.", health: "Some studies examine its role in glucose balance.", mind: "Flavor associated with mental alertness." },
    { word: "nutmeg", body: "Provides minerals and antioxidants.", health: "Supports general metabolic health.", mind: "Historically used for relaxation." },
    { word: "ginger", body: "Contains gingerol for digestive support.", health: "Supports immune and anti-inflammatory response.", mind: "Studied for its potential in cognitive support." },
    { word: "turmeric", body: "Contains curcumin.", health: "Heavily studied for anti-inflammatory support.", mind: "Curcumin is researched for long-term brain health." },
    { word: "cauliflower", body: "High in fiber and Vitamin C.", health: "Cruciferous vegetable supporting general health.", mind: "Antioxidants for brain wellness." },
    { word: "asparagus", body: "Source of fiber and folate.", health: "Supports gut and cardiovascular health.", mind: "Folate is critical for brain function." },
    { word: "corn", body: "Source of lutein and zeaxanthin.", health: "Provides energy and supports eye health.", mind: "Provides glucose for mental energy." },
    { word: "sodium carbonate", body: "Common mineral used as an acidity regulator.", health: "Considered safe by nutritional authorities.", mind: "Neutral impact on cognitive wellness." },
    { word: "500", body: "Mineral-based acidity regulator (Sodium carbonates).", health: "Generally recognized as safe for consumption.", mind: "Neutral impact on cognitive wellness." }
  ];

  const processedKeywords = [
    { word: "maltodextrin", body: "High-glycemic carbohydrate often used as a thickener.", health: "May contribute to rapid blood sugar spikes.", mind: "Energy fluctuations can affect focus." },
    { word: "soy lecithin", body: "Common emulsifier.", health: "Some studies examine its role in gut health.", mind: "Neutral impact on cognitive wellness." },
    { word: "xanthan gum", body: "Processed stabilizer.", health: "Fiber-like additive that may affect digestion.", mind: "General wellness considerations." },
    { word: "carrageenan", body: "Thickener derived from seaweed.", health: "Ongoing research examines its impact on inflammation.", mind: "Neutral impact." },
    { word: "guar gum", body: "Plant-derived processed thickener.", health: "May affect digestive transit time.", mind: "General wellness." },
    { word: "natural flavor", body: "Generic additive label.", health: "Impact depends on the specific unlisted source.", mind: "Research is ongoing." },
    { word: "artificial flavor", body: "Synthetically derived additive.", health: "Refined additive with no nutritional value.", mind: "Individual sensitivities vary." },
    { word: "canola oil", body: "Refined vegetable oil.", health: "High in Omega-6 which is researched for its balance with Omega-3.", mind: "General metabolic wellness." },
    { word: "soybean oil", body: "Highly refined vegetable oil.", health: "Often high in Omega-6 fats.", mind: "General health considerations." },
    { word: "sunflower oil", body: "Refined seed oil.", health: "Source of Vitamin E but often highly processed.", mind: "General wellness." },
    { word: "corn oil", body: "Refined seed oil.", health: "Common in processed foods.", mind: "General wellness." },
    { word: "palm oil", body: "Refined tropical oil.", health: "Saturated fat content is studied for heart health.", mind: "General health considerations." },
    { word: "vegetable oil", body: "Generic term for refined oils.", health: "Often a blend of highly processed seeds.", mind: "General wellness." },
    { word: "sugar", body: "Highly refined sweetener.", health: "Linked in literature to metabolic health challenges.", mind: "Fluctuations in blood sugar can affect mood." },
    { word: "dextrose", body: "Simple sugar often used in processing.", health: "Quickly absorbed glucose source.", mind: "Can lead to energy spikes and crashes." },
    { word: "sucrose", body: "Common table sugar.", health: "Impacts insulin response.", mind: "Affects sustained mental energy." },
    { word: "modified food starch", body: "Chemically altered thickener.", health: "Refined additive with no nutritional value.", mind: "General wellness." },
    { word: "yeast extract", body: "Flavor enhancer containing glutamates.", health: "Often high in sodium.", mind: "Individual sensitivities vary." },
    { word: "msg", body: "Monosodium glutamate, flavor enhancer.", health: "Individual sensitivity is well-documented.", mind: "Some report sensitivities affecting focus." },
    { word: "monosodium glutamate", body: "Flavor enhancer.", health: "Individual sensitivity is well-documented.", mind: "Some report sensitivities affecting focus." },
    { word: "corn syrup", body: "Refined liquid sweetener.", health: "High glycemic impact.", mind: "Energy fluctuations." },
    { word: "fructose", body: "Refined fruit sugar additive.", health: "Metabolized differently than glucose.", mind: "General metabolic wellness." },
    { word: "lecithin", body: "Processed emulsifier.", health: "Generally used in small quantities.", mind: "Neutral impact." },
    { word: "cellulose gum", body: "Refined stabilizer.", health: "Indigestible fiber-like additive.", mind: "General wellness." },
    { word: "pectin", body: "Processed thickener (when an additive).", health: "Generally recognized as safe.", mind: "Neutral impact." },
    { word: "citric acid", body: "Common preservative and acidulant.", health: "Naturally occurring but often manufactured.", mind: "Neutral impact." },
    { word: "ascorbic acid", body: "Synthetic Vitamin C used as preservative.", health: "Acts as an antioxidant in the product.", mind: "Neutral impact." },
    { word: "thickener", body: "Generic term for processing additives.", health: "Varies by source.", mind: "General wellness." },
    { word: "regulator", body: "Generic term for acidity control.", health: "Varies by mineral source.", mind: "General wellness." },
    { word: "501", body: "Acidity regulator (Potassium carbonates).", health: "Considered safe but refined.", mind: "Neutral impact." },
    { word: "508", body: "Gelling agent/thickener (Potassium chloride).", health: "Commonly used mineral additive.", mind: "Neutral impact." },
    { word: "stabilizer", body: "Generic term for product consistency.", health: "Indicates a processed item.", mind: "General wellness." },
    { word: "emulsifier", body: "Generic term for blending ingredients.", health: "Used to maintain product shelf life.", mind: "General wellness." }
  ];

  const flaggedKeywords = [
    { word: "aspartame", body: "Artificial sweetener.", health: "Ongoing research examines possible inflammatory responses.", mind: "Some report focus changes after consumption." },
    { word: "e951", body: "Aspartame code.", health: "Studied for metabolic impact.", mind: "Research on neurological sensitivity is ongoing." },
    { word: "high fructose corn syrup", body: "Highly refined sweetener.", health: "Literature links it to metabolic wellness considerations.", mind: "Significant energy fluctuations." },
    { word: "hfcs", body: "High fructose corn syrup.", health: "Studied for long-term health impact.", mind: "Energy fluctuations." },
    { word: "red 40", body: "Artificial dye.", health: "Approved by FDA but studied internationally.", mind: "Some studies explore behavioral patterns in children." },
    { word: "e129", body: "Red 40 code.", health: "Artificial coloring.", mind: "Research is ongoing." },
    { word: "sodium nitrite", body: "Meat preservative.", health: "Studied for long-term cardiovascular health.", mind: "General wellness considerations." },
    { word: "e250", body: "Sodium nitrite code.", health: "Preservative.", mind: "General wellness." },
    { word: "sodium nitrate", body: "Common preservative.", health: "Found in processed meats.", mind: "General wellness." },
    { word: "e251", body: "Sodium nitrate code.", health: "Preservative.", mind: "General wellness." },
    { word: "bha", body: "Synthetic antioxidant.", health: "Studied for cellular health impact.", mind: "Research is ongoing." },
    { word: "bht", body: "Synthetic preservative.", health: "Research on long-term impact is continuing.", mind: "General wellness." },
    { word: "potassium bromate", body: "Dough conditioner.", health: "Banned in some countries; studied for safety.", mind: "General health." },
    { word: "yellow 5", body: "Artificial color.", health: "Studied for sensitivity.", mind: "Focus and behavior research is ongoing." },
    { word: "yellow 6", body: "Artificial color.", health: "Studied for sensitivity.", mind: "Focus and behavior research." },
    { word: "blue 1", body: "Artificial color.", health: "Studied for sensitivity.", mind: "Focus and behavior research." },
    { word: "hydrogenated", body: "Source of trans fats.", health: "Nutritional literature links trans fats to heart health.", mind: "General health." },
    { word: "partially hydrogenated", body: "Significant source of trans fats.", health: "Strongly discouraged by health bodies.", mind: "General metabolic wellness." },
    { word: "acesulfame potassium", body: "Artificial sweetener.", health: "Studied for metabolic health impact.", mind: "Individual sensitivity varies." },
    { word: "sucralose", body: "Common artificial sweetener.", health: "Ongoing research on gut microbiome impact.", mind: "Neutral to negative impact reported." },
    { word: "saccharin", body: "Oldest artificial sweetener.", health: "Safety is well-documented but continues to be studied.", mind: "General wellness." }
  ];

  const ingredients = rawList.map(ing => {
    let normalizedIng = ing.toLowerCase();

    // Apply OCR Corrections
    Object.entries(ocrCorrections).forEach(([error, correction]) => {
      if (normalizedIng.includes(error)) {
        normalizedIng = normalizedIng.replace(error, correction);
      }
    });

    // FLAGGED CHECK
    for (const k of flaggedKeywords) {
      const regex = new RegExp(`\\b${k.word}\\b`, 'i');
      if (regex.test(normalizedIng)) {
        return {
          name: ing,
          classification: "flagged",
          body: k.body,
          health: k.health,
          mind: k.mind
        };
      }
    }

    // PROCESSED CHECK
    for (const k of processedKeywords) {
      const regex = new RegExp(`\\b${k.word}\\b`, 'i');
      if (regex.test(normalizedIng)) {
        return {
          name: ing,
          classification: "processed",
          body: k.body,
          health: k.health,
          mind: k.mind
        };
      }
    }

    // CLEAN CHECK
    for (const k of cleanKeywords) {
      const regex = new RegExp(`\\b${k.word}\\b`, 'i');
      if (regex.test(normalizedIng)) {
        return {
          name: ing,
          classification: "clean",
          body: k.body,
          health: k.health,
          mind: k.mind
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

  const DISCLAIMER = " This analysis is for educational purposes only and does not constitute medical or dietary advice.";

  return {
    product_name: "Analyzed Product",
    grade,
    grade_reason,
    vitality_summary: `Analysis: ${clean_count} Clean, ${processed_count} Processed, and ${flagged_count} Flagged ingredients.${DISCLAIMER}`,
    clean_count,
    processed_count,
    flagged_count,
    advice: "Consider focusing on whole, minimally processed foods to support long-term wellness. Consider consulting a healthcare professional for personalized dietary guidance.",
    ingredients
  };
}
