export function getColors(hslMatch: string) {
    const hslValues = hslMatch.split(' ');
  
    // Extracting HSL values
    const hue = parseFloat(hslValues[0]);
    const saturation = parseFloat(hslValues[1]);
    const lightness = parseFloat(hslValues[2]);
  
    // Converting HSL to CSS format
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  
    // Determine text color based on lightness
    const textColor = lightness > 50 ? 'black' : 'white';
  
    return { backgroundColor: hslColor, color: textColor };
  }