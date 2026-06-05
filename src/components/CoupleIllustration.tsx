import { CharacterDesign } from '../App';

interface CoupleIllustrationProps {
  character: CharacterDesign;
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  size?: 'md' | 'lg';
}

// Couple illustrations cho mỗi theme - hiện tại dùng reference có sẵn
const coupleIllustrations = {
  love: {
    romantic: 'figma:asset/7138e6744a2ca0f98e0042a1863471b23f4a8cfc.png', // couple với hoa
    casual: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png',
    formal: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png'
  },
  family: {
    romantic: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png',
    casual: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png',
    formal: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png'
  },
  birthday: {
    romantic: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png',
    casual: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png',
    formal: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png'
  },
  friendship: {
    romantic: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png',
    casual: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png',
    formal: 'figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png'
  }
};

export function CoupleIllustration({ character, theme, size = 'lg' }: CoupleIllustrationProps) {
  const illustration = coupleIllustrations[theme][character.outfit] || coupleIllustrations[theme].romantic;

  const sizeClasses = {
    md: 'w-64 h-80',
    lg: 'w-80 h-96'
  };

  return (
    <div className={`couple-illustration ${sizeClasses[size]}`}>
      <img
        src={illustration}
        alt="Couple illustration"
        className="w-full h-full object-contain drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.2))'
        }}
      />
    </div>
  );
}
