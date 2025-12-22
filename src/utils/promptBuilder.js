export function buildPrompt(role, mindset, style, device, accentColor = "#667eea") {
  // Convert hex to color name for better AI understanding
  const colorDescriptions = {
    "#667eea": "soft purple-blue",
    "#f093fb": "gentle pink-purple",
    "#4facfe": "calm sky blue",
    "#43e97b": "fresh mint green",
    "#fa709a": "warm coral pink",
    "#feca57": "soft golden yellow"
  };
  
  const colorDesc = colorDescriptions[accentColor] || "balanced neutral";
  
  const aspectRatio = device === "mobile" 
    ? "portrait 9:16 smartphone format" 
    : "landscape 16:9 desktop format";

  return `
A premium, calming wallpaper designed for a ${role}.
The image should evoke ${mindset}, creating a visually quiet and mentally relaxing atmosphere.
Use a ${style} color palette with ${colorDesc} subtle accents.
The composition is ${aspectRatio}, minimal, perfectly balanced, and completely uncluttered.
Soft gradients, gentle atmospheric lighting, and smooth color transitions.
Nothing dramatic, nothing distracting, nothing busy.
Feels modern, refined, sophisticated, and suitable for extended viewing during work or relaxation.
Absolutely no text, no symbols, no logos, no sharp contrasts, no visual noise, no clutter.
Pure aesthetic harmony and tranquility.
  `.trim();
}