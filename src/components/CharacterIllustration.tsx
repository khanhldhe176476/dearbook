import { CharacterData } from '../App';

interface CharacterIllustrationProps {
  character: CharacterData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  expression?: 'happy' | 'loving' | 'excited' | 'calm';
}

export function CharacterIllustration({ character, size = 'md', className = '', expression = 'happy' }: CharacterIllustrationProps) {
  const sizeMap = {
    sm: { width: 120, height: 160 },
    md: { width: 200, height: 280 },
    lg: { width: 280, height: 380 },
    xl: { width: 360, height: 480 }
  };

  const { width, height } = sizeMap[size];

  // Hair colors
  const hairColors = {
    black: '#2D3748',
    brown: '#8B4513',
    blonde: '#F5DEB3',
    red: '#DC143C',
    gray: '#A0AEC0'
  };

  // Skin tone
  const skinColor = '#FFDAB9';
  const skinShade = '#FFB88C';

  // Outfit colors based on style
  const outfitColors = {
    casual: {
      primary: '#4299E1',
      secondary: '#63B3ED'
    },
    formal: {
      primary: '#2D3748',
      secondary: '#4A5568'
    },
    romantic: {
      primary: '#ED64A6',
      secondary: '#F687B3'
    }
  };

  const hairColor = hairColors[character.hairColor];
  const outfit = outfitColors[character.outfit];
  const isFemale = character.gender === 'female';
  const isLongHair = character.hairStyle === 'long';

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Background circle */}
        <circle cx="100" cy="140" r="95" fill="url(#bg-gradient)" opacity="0.1" />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={outfit.primary} />
            <stop offset="100%" stopColor={outfit.secondary} />
          </linearGradient>
          
          <linearGradient id="hair-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hairColor} />
            <stop offset="100%" stopColor={hairColor} stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="skin-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinColor} />
            <stop offset="100%" stopColor={skinShade} />
          </linearGradient>
        </defs>

        {/* Body - Outfit */}
        <g transform="translate(0, 150)">
          {character.outfit === 'romantic' && isFemale ? (
            /* Dress */
            <>
              <path
                d="M 60 20 L 50 80 Q 50 110 70 120 L 100 130 L 130 120 Q 150 110 150 80 L 140 20 Z"
                fill={outfit.primary}
                stroke={outfit.secondary}
                strokeWidth="2"
              />
              {/* Dress details */}
              <circle cx="100" cy="50" r="3" fill="white" opacity="0.6" />
              <circle cx="100" cy="65" r="3" fill="white" opacity="0.6" />
              <circle cx="100" cy="80" r="3" fill="white" opacity="0.6" />
            </>
          ) : character.outfit === 'formal' ? (
            /* Suit/Formal */
            <>
              <rect x="65" y="20" width="70" height="90" rx="5" fill={outfit.primary} />
              <rect x="85" y="25" width="30" height="85" fill="white" opacity="0.9" />
              <path d="M 100 25 L 100 110" stroke={outfit.secondary} strokeWidth="2" />
              {/* Collar */}
              <path d="M 85 25 L 75 35 M 115 25 L 125 35" stroke={outfit.secondary} strokeWidth="2" />
            </>
          ) : (
            /* Casual - T-shirt */
            <>
              <rect x="60" y="20" width="80" height="80" rx="8" fill={outfit.primary} />
              {/* Stripes for casual look */}
              <line x1="65" y1="40" x2="135" y2="40" stroke="white" strokeWidth="2" opacity="0.3" />
              <line x1="65" y1="60" x2="135" y2="60" stroke="white" strokeWidth="2" opacity="0.3" />
            </>
          )}
          
          {/* Arms */}
          <ellipse cx="50" cy="45" rx="12" ry="35" fill={outfit.primary} />
          <ellipse cx="150" cy="45" rx="12" ry="35" fill={outfit.primary} />
          
          {/* Hands */}
          <circle cx="50" cy="75" r="10" fill={skinColor} />
          <circle cx="150" cy="75" r="10" fill={skinColor} />
        </g>

        {/* Neck */}
        <rect x="85" y="140" width="30" height="20" rx="10" fill="url(#skin-gradient)" />

        {/* Head */}
        <ellipse cx="100" cy="110" rx="40" ry="45" fill="url(#skin-gradient)" />

        {/* Hair - Back layer */}
        <g>
          {isLongHair ? (
            <>
              {/* Long hair back */}
              <ellipse cx="100" cy="100" rx="50" ry="55" fill="url(#hair-gradient)" />
              {isFemale && (
                <>
                  <path
                    d="M 60 120 Q 55 140 60 160 L 65 155 Q 60 135 65 120 Z"
                    fill="url(#hair-gradient)"
                  />
                  <path
                    d="M 140 120 Q 145 140 140 160 L 135 155 Q 140 135 135 120 Z"
                    fill="url(#hair-gradient)"
                  />
                </>
              )}
            </>
          ) : (
            /* Short hair */
            <ellipse cx="100" cy="95" rx="45" ry="35" fill="url(#hair-gradient)" />
          )}
        </g>

        {/* Face features */}
        <g>
          {/* Eyes */}
          <ellipse cx="85" cy="105" rx="6" ry="8" fill="white" />
          <ellipse cx="115" cy="105" rx="6" ry="8" fill="white" />
          <circle cx="85" cy="107" r="4" fill="#2D3748" />
          <circle cx="115" cy="107" r="4" fill="#2D3748" />
          <circle cx="86" cy="106" r="1.5" fill="white" />
          <circle cx="116" cy="106" r="1.5" fill="white" />

          {/* Eyebrows */}
          <path
            d="M 75 97 Q 82 95 90 97"
            stroke="#2D3748"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 110 97 Q 117 95 125 97"
            stroke="#2D3748"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Nose */}
          <path d="M 100 110 Q 102 118 100 120" stroke={skinShade} strokeWidth="1.5" fill="none" />

          {/* Smile - varies by expression */}
          {expression === 'happy' && (
            <path
              d="M 85 125 Q 100 132 115 125"
              stroke="#2D3748"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {expression === 'loving' && (
            <>
              <path
                d="M 85 123 Q 100 130 115 123"
                stroke="#2D3748"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Heart eyes effect */}
              <path d="M 82 105 Q 82 102 85 102 Q 88 102 88 105 Q 88 107 85 109 Q 82 107 82 105 Z" fill="#FF69B4" opacity="0.3" />
              <path d="M 112 105 Q 112 102 115 102 Q 118 102 118 105 Q 118 107 115 109 Q 112 107 112 105 Z" fill="#FF69B4" opacity="0.3" />
            </>
          )}
          {expression === 'excited' && (
            <>
              <ellipse cx="100" cy="128" rx="8" ry="6" fill="#2D3748" />
              <path d="M 85 120 Q 90 115 95 120" stroke="#2D3748" strokeWidth="1.5" fill="none" />
              <path d="M 105 120 Q 110 115 115 120" stroke="#2D3748" strokeWidth="1.5" fill="none" />
            </>
          )}
          {expression === 'calm' && (
            <path
              d="M 88 126 Q 100 128 112 126"
              stroke="#2D3748"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Blush */}
          <ellipse cx="72" cy="115" rx="8" ry="5" fill="#FFB6C1" opacity="0.4" />
          <ellipse cx="128" cy="115" rx="8" ry="5" fill="#FFB6C1" opacity="0.4" />
        </g>

        {/* Hair - Front layer details */}
        {isLongHair && isFemale && (
          <g>
            {/* Bangs */}
            <path
              d="M 70 85 Q 75 75 80 85 Q 85 75 90 85 Q 95 75 100 85 Q 105 75 110 85 Q 115 75 120 85 Q 125 75 130 85"
              fill="url(#hair-gradient)"
            />
          </g>
        )}

        {!isLongHair && isFemale && (
          <g>
            {/* Short hair bangs */}
            <path
              d="M 75 90 Q 80 82 85 90 Q 90 82 95 90 Q 100 82 105 90 Q 110 82 115 90 Q 120 82 125 90"
              fill="url(#hair-gradient)"
            />
          </g>
        )}

        {/* Accessories based on outfit */}
        {character.outfit === 'romantic' && (
          <g>
            {isFemale ? (
              <>
                {/* Flower in hair */}
                <circle cx="130" cy="95" r="8" fill="#FFB6C1" />
                <circle cx="127" cy="92" r="3" fill="#FF69B4" />
                <circle cx="133" cy="92" r="3" fill="#FF69B4" />
                <circle cx="127" cy="98" r="3" fill="#FF69B4" />
                <circle cx="133" cy="98" r="3" fill="#FF69B4" />
                <circle cx="130" cy="95" r="2" fill="#FFD700" />
                
                {/* Necklace */}
                <ellipse cx="100" cy="142" rx="15" ry="3" fill="#FFD700" opacity="0.8" />
                <circle cx="100" cy="145" r="3" fill="#FF69B4" />
              </>
            ) : (
              <>
                {/* Rose boutonniere */}
                <circle cx="75" cy="165" r="5" fill="#DC143C" />
                <circle cx="73" cy="163" r="2" fill="#FF1493" />
                <circle cx="77" cy="163" r="2" fill="#FF1493" />
                <path d="M 75 170 L 73 178" stroke="#228B22" strokeWidth="2" />
              </>
            )}
          </g>
        )}

        {character.outfit === 'formal' && (
          <g>
            {!isFemale ? (
              <>
                {/* Tie */}
                <path
                  d="M 95 160 L 100 190 L 105 160 Z"
                  fill={outfit.secondary}
                />
                <line x1="100" y1="160" x2="100" y2="190" stroke="white" strokeWidth="1" opacity="0.3" />
              </>
            ) : (
              <>
                {/* Earrings */}
                <circle cx="65" cy="115" r="3" fill="#FFD700" />
                <circle cx="135" cy="115" r="3" fill="#FFD700" />
                <circle cx="65" cy="120" r="2" fill="#FFD700" opacity="0.7" />
                <circle cx="135" cy="120" r="2" fill="#FFD700" opacity="0.7" />
              </>
            )}
          </g>
        )}

        {character.outfit === 'casual' && (
          <g>
            {/* Casual accessories */}
            {isFemale ? (
              <>
                {/* Hair clip */}
                <rect x="125" y="90" width="8" height="3" rx="1.5" fill="#4299E1" />
                <circle cx="127" cy="91.5" r="1" fill="white" />
                <circle cx="131" cy="91.5" r="1" fill="white" />
              </>
            ) : (
              <>
                {/* Watch */}
                <rect x="45" y="73" width="10" height="8" rx="2" fill="#2D3748" />
                <circle cx="50" cy="77" r="2" fill="#4299E1" opacity="0.5" />
              </>
            )}
          </g>
        )}

        {/* Character style badge */}
        <g transform="translate(50, 250)">
          <rect x="0" y="0" width="100" height="24" rx="12" fill="white" fillOpacity="0.95" />
          <text
            x="50"
            y="16"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#4A5568"
          >
            {isFemale ? '' : ''} {' '}
            {character.hairColor === 'black' ? 'en' :
             character.hairColor === 'brown' ? 'Nu' :
             character.hairColor === 'red' ? '' :
             character.hairColor === 'blonde' ? 'Vng' : 'Xm'}
            {'  '}
            {isLongHair ? 'Di' : 'Ngn'}
          </text>
        </g>
      </svg>
    </div>
  );
}
