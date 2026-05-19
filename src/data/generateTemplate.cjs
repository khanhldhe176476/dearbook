const fs = require('fs');
const transpSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

function el(id, x, y, w, h, rot) {
  return {
    id, type: 'image', src: transpSrc, x, y, width: w, height: h, rotation: rot, objectFit: 'cover'
  };
}

const template = [
  {
    id: 'youth-page-1', backgroundColor: '#FAF5ED', backgroundImage: 'bg1',
    elements: [
      el('p1-camera', 130, 215, 250, 140, 4),
      el('p1-pol1', 35, 520, 175, 180, -8),
      el('p1-pol2', 210, 535, 175, 180, 10),
      el('p1-f1', 410, 200, 70, 60, -14),
      el('p1-f2', 395, 330, 70, 60, -14),
      el('p1-f3', 380, 470, 70, 60, -14),
      el('p1-f4', 365, 610, 70, 60, -14),
    ]
  },
  {
    id: 'youth-page-2', backgroundColor: '#F3EFE9', backgroundImage: 'bg2',
    elements: [
      el('p2-w1', 110, 75, 120, 145, -4),
      el('p2-w2', 235, 65, 120, 145, -4),
      el('p2-w3', 120, 230, 120, 145, -4),
      el('p2-w4', 245, 220, 120, 145, -4),
      el('p2-pol1', 40, 600, 140, 140, -10),
      el('p2-pol2', 190, 550, 140, 140, -4),
      el('p2-pol3', 340, 620, 140, 140, 4),
    ]
  },
  {
    id: 'youth-page-3', backgroundColor: '#E7EDEA', backgroundImage: 'bg3',
    elements: [
      el('p3-top', 95, 140, 320, 210, 0),
      el('p3-l1', 80, 490, 155, 155, 0),
      el('p3-l2', 90, 760, 130, 130, 0),
      el('p3-r1', 275, 380, 155, 155, 0),
      el('p3-r2', 275, 550, 155, 155, 0),
    ]
  },
  {
    id: 'youth-page-4', backgroundColor: '#F5F5F5', backgroundImage: 'bg4',
    elements: [
      el('p4-lt', 60, 180, 230, 180, 0),
      el('p4-lb', 50, 530, 160, 160, 0),
      el('p4-rt1', 330, 190, 140, 140, 0),
      el('p4-rt2', 330, 340, 140, 140, 0),
      el('p4-rb', 280, 510, 190, 190, 0),
    ]
  },
  {
    id: 'youth-page-5', backgroundColor: '#DDF0F7', backgroundImage: 'bg5',
    elements: [
      el('p5-bot', 0, 450, 500, 250, 0),
    ]
  },
  {
    id: 'youth-page-6', backgroundColor: '#F0EBE1', backgroundImage: 'bg6',
    elements: [
      el('p6-top', 0, 120, 240, 160, 8),
      el('p6-mid', 140, 380, 250, 170, 0),
      el('p6-bot', 250, 630, 250, 160, -8),
    ]
  },
  {
    id: 'youth-page-7', backgroundColor: '#D9D9D9', backgroundImage: 'bg7',
    elements: [
      el('p7-cam', 125, 260, 200, 140, -8),
      el('p7-f1', 0, 630, 140, 140, -6),
      el('p7-f2', 155, 615, 140, 140, -6),
      el('p7-f3', 310, 600, 140, 140, -6),
    ]
  },
  {
    id: 'youth-page-8', backgroundColor: '#FAF5ED', backgroundImage: 'bg8',
    elements: [
      el('p8-h', 35, 180, 150, 150, 0),
      el('p8-c', 240, 140, 160, 160, 0),
      el('p8-f1', 0, 620, 130, 130, -6),
      el('p8-f2', 140, 600, 130, 130, -6),
      el('p8-f3', 280, 580, 130, 130, -6),
    ]
  },
  {
    id: 'youth-page-9', backgroundColor: '#C5B5A1', backgroundImage: 'bg9',
    elements: [
      el('p9-1', 90, 160, 160, 110, 0),
      el('p9-2', 265, 160, 140, 110, 0),
      el('p9-3', 35, 285, 145, 105, 0),
      el('p9-4', 190, 285, 145, 105, 0),
      el('p9-5', 345, 285, 125, 105, 0),
      el('p9-6', 95, 405, 160, 115, 0),
      el('p9-7', 265, 405, 145, 115, 0),
      el('p9-8', 170, 535, 175, 85, 0),
    ]
  },
  {
    id: 'youth-page-10', backgroundColor: '#D8C3A5', backgroundImage: 'bg10',
    elements: [
      el('p10-t', 125, 180, 230, 150, -10),
      el('p10-bl', 75, 520, 170, 170, -4),
      el('p10-br', 255, 540, 170, 170, 4),
    ]
  },
  {
    id: 'youth-page-11', backgroundColor: '#EAE2D6', backgroundImage: 'bg11',
    elements: [
      el('p11-t', 150, 210, 250, 170, 0),
      el('p11-b', 130, 600, 250, 170, -2),
    ]
  }
];

let content = `import { BookPage } from '../App';
import bg1 from '../assets/youth-bg-real-1.jpg';
import bg2 from '../assets/youth-bg-real-2.jpg';
import bg3 from '../assets/youth-bg-real-3.png';
import bg4 from '../assets/youth-bg-real-4.png';
import bg5 from '../assets/youth-bg-real-5.png';
import bg6 from '../assets/youth-bg-real-6.png';
import bg7 from '../assets/youth-bg-real-7.png';
import bg8 from '../assets/youth-bg-real-8.png';
import bg9 from '../assets/youth-bg-real-9.jpg';
import bg10 from '../assets/youth-bg-real-10.png';
import bg11 from '../assets/youth-bg-real-11.png';

export const youthBg1 = bg1;

export const youthArchiveTemplate: BookPage[] = ${JSON.stringify(template, null, 2).replace(/\"backgroundImage\": \"(bg\\d+)\"/g, 'backgroundImage: $1')};
`;

fs.writeFileSync('c:/Github Clone/dearbook/src/data/youthArchiveTemplate.ts', content);
