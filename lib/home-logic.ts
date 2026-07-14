// Pure helpers ported from the homepage DCLogic component's dotsRead() and
// learnTopicFor() methods, which read the visitor's free-text journal entry
// and route it to a canned clinical reply / a Learn topic.

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hasAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

export function dotsRead(raw: string): string {
  const t = raw.toLowerCase();
  if (hasAny(t, ["sleep", "rest", "night", "insomnia", "awake"]))
    return "Sleep that falls apart is often cortisol stuck in the on position. Testable, and it moves.";
  if (hasAny(t, ["think", "brain", "fog", "focus", "remember", "sharp", "concentrate", "word"]))
    return "Brain fog almost always has a driver underneath. Thyroid, blood sugar, inflammation, or a nutrient running low.";
  if (
    hasAny(t, [
      "crash", "afternoon", "3pm", "energy", "tired", "fatigue", "exhaust", "get through", "empty", "burnout", "burned", "wired", "drained",
    ])
  )
    return "Running on empty usually traces to blood sugar and cortisol. Wired but tired, crashing by afternoon. Hidden on basic labs, and very responsive once we see them.";
  if (hasAny(t, ["weight", "scale", "lose", "gain", "belly", "pound"]))
    return "Weight that will not move despite the effort is rarely willpower. Usually it is metabolism, thyroid, or insulin.";
  if (hasAny(t, ["mood", "anx", "irritable", "temper", "snap", "cry", "overwhelm"]))
    return "Mood and a short fuse often trace to cortisol and hormones, not character.";
  if (hasAny(t, ["gut", "bloat", "digest", "stomach", "bowel"]))
    return "The gut runs a group chat with your brain, mood, and immune system. Calm the root and the rest settles.";
  if (hasAny(t, ["hormone", "period", "cycle", "hot", "flash", "libido", "perimenopause", "menopause", "meno"]))
    return "In perimenopause and beyond, hormone shifts get waved off as just stress or just your age. We read the full panel and treat you, not the average.";
  if (
    hasAny(t, [
      "worry", "worri", "health", "scared", "afraid", "fear", "anxious about", "what is wrong", "something is wrong",
    ])
  )
    return "That low hum of worry is real, and it usually means your body is asking for answers, not for you to push it down. Once we find the why, the worry quiets on its own.";
  return "Whatever you just named, it is a clue worth following. We read the whole picture and find what is driving it.";
}

export function learnTopicFor(raw: string): string | null {
  const t = raw.toLowerCase();
  if (hasAny(t, ["sleep", "night", "anx", "calm", "perimeno", "menopause", "hormone", "hot flash"])) return "Hormones";
  if (hasAny(t, ["think", "feet", "focus", "fog", "3pm", "crash", "empty", "energy", "tired", "running"])) return "Energy";
  if (hasAny(t, ["weight", "lose", "pound", "scale"])) return "Thyroid";
  if (hasAny(t, ["eat", "bloat", "gut", "digest", "stomach"])) return "Gut";
  if (hasAny(t, ["myself", "worry", "health"])) return "Approach";
  return null;
}

export function cleanEntry(raw: string): string {
  return raw.trim().replace(/[.?!]+$/, "");
}
