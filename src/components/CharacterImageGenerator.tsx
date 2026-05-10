import { CharacterData } from './CharacterDesigner';

/**
 * Generates a data URL for character avatar
 * This can be used as an image source in pages
 */
export function generateCharacterDataURL(character: CharacterData, size: number = 400): string {
  const svg = `
    <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="100" cy="100" r="70" fill="#FFF5F5" opacity="0.3" />
      
      <!-- Body/Outfit -->
      <g id="body">
        ${character.outfit === 'dress-pink' ? `
          <path
            d="M70 150 Q60 170, 50 250 L150 250 Q140 170, 130 150 Z"
            fill="#FF69B4"
            stroke="#FF1493"
            stroke-width="2"
          />
          <path
            d="M70 150 Q100 160, 130 150"
            fill="#FFB6C1"
            stroke="#FF1493"
            stroke-width="1"
          />
        ` : ''}
        ${character.outfit === 'dress-purple' ? `
          <path
            d="M70 150 Q60 170, 50 250 L150 250 Q140 170, 130 150 Z"
            fill="#DDA0DD"
            stroke="#BA55D3"
            stroke-width="2"
          />
          <circle cx="100" cy="180" r="3" fill="white" opacity="0.8" />
          <circle cx="100" cy="200" r="3" fill="white" opacity="0.8" />
          <circle cx="100" cy="220" r="3" fill="white" opacity="0.8" />
        ` : ''}
        ${character.outfit === 'shirt-white' ? `
          <path
            d="M70 150 L65 250 L135 250 L130 150 Z"
            fill="#FFFFFF"
            stroke="#E0E0E0"
            stroke-width="2"
          />
          <rect x="95" y="150" width="10" height="100" fill="#F0F0F0" />
        ` : ''}
        ${character.outfit === 'hoodie-blue' ? `
          <path
            d="M70 150 L60 250 L140 250 L130 150 Z"
            fill="#87CEEB"
            stroke="#4682B4"
            stroke-width="2"
          />
          <rect x="80" y="145" width="40" height="8" rx="4" fill="#B0E0E6" />
        ` : ''}
        
        <!-- Neck -->
        <rect x="85" y="135" width="30" height="20" fill="${character.skinTone}" />
      </g>

      <!-- Head -->
      <g id="head">
        <!-- Face -->
        <ellipse cx="100" cy="100" rx="45" ry="50" fill="${character.skinTone}" />
        
        <!-- Ears -->
        <ellipse cx="60" cy="100" rx="8" ry="12" fill="${character.skinTone}" />
        <ellipse cx="140" cy="100" rx="8" ry="12" fill="${character.skinTone}" />
        
        <!-- Eyes -->
        <g id="eyes">
          ${character.eyeStyle === 'round' ? `
            <ellipse cx="80" cy="95" rx="8" ry="10" fill="white" />
            <ellipse cx="120" cy="95" rx="8" ry="10" fill="white" />
            <circle cx="80" cy="97" r="5" fill="#654321" />
            <circle cx="120" cy="97" r="5" fill="#654321" />
            <circle cx="82" cy="95" r="2" fill="white" />
            <circle cx="122" cy="95" r="2" fill="white" />
            <path d="M72 88 Q70 85, 68 88" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round" />
            <path d="M128 88 Q130 85, 132 88" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round" />
          ` : ''}
          ${character.eyeStyle === 'cat' ? `
            <path d="M70 95 Q80 90, 90 95 Q80 100, 70 95" fill="white" stroke="#000" stroke-width="1" />
            <path d="M110 95 Q120 90, 130 95 Q120 100, 110 95" fill="white" stroke="#000" stroke-width="1" />
            <circle cx="80" cy="95" r="4" fill="#654321" />
            <circle cx="120" cy="95" r="4" fill="#654321" />
            <circle cx="81" cy="94" r="1.5" fill="white" />
            <circle cx="121" cy="94" r="1.5" fill="white" />
          ` : ''}
          ${character.eyeStyle === 'anime' ? `
            <ellipse cx="80" cy="95" rx="9" ry="12" fill="white" stroke="#000" stroke-width="1.5" />
            <ellipse cx="120" cy="95" rx="9" ry="12" fill="white" stroke="#000" stroke-width="1.5" />
            <circle cx="80" cy="97" r="6" fill="#654321" />
            <circle cx="120" cy="97" r="6" fill="#654321" />
            <circle cx="78" cy="94" r="3" fill="white" />
            <circle cx="118" cy="94" r="3" fill="white" />
            <circle cx="82" cy="99" r="1" fill="white" opacity="0.7" />
            <circle cx="122" cy="99" r="1" fill="white" opacity="0.7" />
          ` : ''}
        </g>

        <!-- Eyebrows -->
        <path d="M70 85 Q80 83, 90 85" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M110 85 Q120 83, 130 85" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round" />

        <!-- Nose -->
        <ellipse cx="100" cy="105" rx="3" ry="4" fill="${character.skinTone}" stroke="${character.skinTone}" stroke-width="0.5" opacity="0.3" />

        <!-- Lips -->
        <g id="lips">
          ${character.lipStyle === 'smile' ? `
            <path d="M85 115 Q100 122, 115 115" stroke="#FF69B4" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M85 115 Q100 118, 115 115" fill="#FFB6C1" opacity="0.6" />
          ` : ''}
          ${character.lipStyle === 'natural' ? `
            <ellipse cx="100" cy="118" rx="12" ry="4" fill="#FFB6C1" opacity="0.8" />
            <path d="M88 118 L112 118" stroke="#FF69B4" stroke-width="1" />
          ` : ''}
          ${character.lipStyle === 'pouty' ? `
            <ellipse cx="100" cy="117" rx="10" ry="5" fill="#FF69B4" opacity="0.7" />
            <ellipse cx="100" cy="119" rx="10" ry="4" fill="#FFB6C1" opacity="0.6" />
          ` : ''}
        </g>

        <!-- Blush -->
        <ellipse cx="70" cy="108" rx="8" ry="5" fill="#FFB6C1" opacity="0.3" />
        <ellipse cx="130" cy="108" rx="8" ry="5" fill="#FFB6C1" opacity="0.3" />
      </g>

      <!-- Hair -->
      <g id="hair">
        ${character.hairStyle === 'long-straight' ? `
          <ellipse cx="100" cy="70" rx="50" ry="35" fill="${character.hairColor}" />
          <path d="M55 60 Q100 50, 145 60 L145 85 Q100 100, 55 85 Z" fill="${character.hairColor}" />
          <ellipse cx="60" cy="110" rx="15" ry="40" fill="${character.hairColor}" />
          <ellipse cx="140" cy="110" rx="15" ry="40" fill="${character.hairColor}" />
          <path d="M70 60 Q75 75, 80 60" fill="${character.hairColor}" />
          <path d="M90 55 Q95 70, 100 55" fill="${character.hairColor}" />
          <path d="M110 55 Q115 70, 120 60" fill="${character.hairColor}" />
        ` : ''}
        ${character.hairStyle === 'ponytail' ? `
          <ellipse cx="100" cy="70" rx="48" ry="33" fill="${character.hairColor}" />
          <path d="M55 60 Q100 50, 145 60 L145 80 Q100 95, 55 80 Z" fill="${character.hairColor}" />
          <ellipse cx="140" cy="80" rx="12" ry="35" fill="${character.hairColor}" transform="rotate(20 140 80)" />
          <path d="M70 60 Q75 72, 80 62" fill="${character.hairColor}" />
          <path d="M90 57 Q95 68, 100 57" fill="${character.hairColor}" />
          <path d="M110 57 Q115 68, 120 62" fill="${character.hairColor}" />
        ` : ''}
        ${character.hairStyle === 'bob' ? `
          <ellipse cx="100" cy="70" rx="48" ry="32" fill="${character.hairColor}" />
          <path d="M55 65 Q100 55, 145 65 L145 95 Q100 105, 55 95 Z" fill="${character.hairColor}" />
          <path d="M70 65 Q75 75, 80 68" fill="${character.hairColor}" />
          <path d="M90 60 Q95 70, 100 60" fill="${character.hairColor}" />
          <path d="M110 60 Q115 70, 120 68" fill="${character.hairColor}" />
        ` : ''}
        ${character.hairStyle === 'bun' ? `
          <ellipse cx="100" cy="70" rx="46" ry="30" fill="${character.hairColor}" />
          <circle cx="100" cy="50" r="20" fill="${character.hairColor}" />
          <circle cx="100" cy="50" r="15" fill="${character.hairColor}" opacity="0.7" />
          <path d="M60 65 Q100 58, 140 65 L140 85 Q100 95, 60 85 Z" fill="${character.hairColor}" />
        ` : ''}
        ${character.hairStyle === 'short-messy' ? `
          <ellipse cx="100" cy="75" rx="46" ry="28" fill="${character.hairColor}" />
          <path d="M60 65 Q100 55, 140 65" fill="${character.hairColor}" />
          <path d="M70 60 L75 50 L78 62" fill="${character.hairColor}" />
          <path d="M90 55 L95 45 L98 58" fill="${character.hairColor}" />
          <path d="M110 55 L115 48 L118 60" fill="${character.hairColor}" />
          <path d="M125 60 L128 52 L130 63" fill="${character.hairColor}" />
        ` : ''}
        ${character.hairStyle === 'wavy' ? `
          <ellipse cx="100" cy="70" rx="50" ry="34" fill="${character.hairColor}" />
          <path d="M55 65 Q100 55, 145 65 L145 100 Q130 110, 100 105 Q70 110, 55 100 Z" fill="${character.hairColor}" />
          <path d="M60 80 Q65 90, 70 100 Q75 110, 80 120" stroke="${character.hairColor}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8" />
          <path d="M120 100 Q125 110, 130 120" stroke="${character.hairColor}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8" />
        ` : ''}
      </g>

      <!-- Accessories -->
      <g id="accessories">
        ${character.accessories?.includes('flower') ? `
          <g transform="translate(125, 75)">
            <circle cx="0" cy="0" r="8" fill="#FF69B4" />
            <circle cx="-5" cy="-5" r="4" fill="#FFB6C1" />
            <circle cx="5" cy="-5" r="4" fill="#FFB6C1" />
            <circle cx="-5" cy="5" r="4" fill="#FFB6C1" />
            <circle cx="5" cy="5" r="4" fill="#FFB6C1" />
            <circle cx="0" cy="0" r="3" fill="#FFD700" />
          </g>
        ` : ''}
        ${character.accessories?.includes('bow') ? `
          <g transform="translate(100, 55)">
            <path d="M-15 0 Q-10 -8, 0 -5 Q10 -8, 15 0 Q10 8, 0 5 Q-10 8, -15 0" fill="#FF1493" />
            <circle cx="0" cy="0" r="3" fill="#FFB6C1" />
          </g>
        ` : ''}
        ${character.accessories?.includes('glasses') ? `
          <g>
            <ellipse cx="80" cy="95" rx="12" ry="10" fill="none" stroke="#333" stroke-width="2" />
            <ellipse cx="120" cy="95" rx="12" ry="10" fill="none" stroke="#333" stroke-width="2" />
            <line x1="92" y1="95" x2="108" y2="95" stroke="#333" stroke-width="2" />
          </g>
        ` : ''}
        ${character.accessories?.includes('earrings') ? `
          <circle cx="60" cy="105" r="4" fill="#FFD700" stroke="#DAA520" stroke-width="1" />
          <circle cx="140" cy="105" r="4" fill="#FFD700" stroke="#DAA520" stroke-width="1" />
        ` : ''}
        ${character.accessories?.includes('necklace') ? `
          <g>
            <path d="M85 135 Q100 142, 115 135" stroke="#FFD700" stroke-width="2" fill="none" />
            <circle cx="100" cy="142" r="4" fill="#FFD700" stroke="#DAA520" stroke-width="1" />
          </g>
        ` : ''}
      </g>
    </svg>
  `.trim();

  // Convert SVG to data URL
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
}
