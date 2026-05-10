import { useState } from 'react';
import { Box } from 'lucide-react';
import { FlipBookReader } from './FlipBookReader';
import { BookData } from '../App';

export function Test3DButton() {
  const [show3D, setShow3D] = useState(false);

  const testBook: BookData = {
    id: 'test-book',
    title: 'Test 3D Book',
    theme: 'love',
    templateId: 'test',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cover: {
      id: 'cover',
      backgroundColor: '#ec4899',
      backgroundImage: 'https://images.unsplash.com/photo-1514846528774-8de9d4a07023?w=800&h=1200&fit=crop',
      elements: [
        {
          id: '1',
          type: 'text',
          content: 'Our Love Story',
          x: 50,
          y: 400,
          width: 250,
          height: 100,
          fontSize: 48,
          fontFamily: 'Dancing Script',
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          id: '2',
          type: 'text',
          content: 'A beautiful journey together',
          x: 50,
          y: 520,
          width: 250,
          height: 60,
          fontSize: 18,
          fontFamily: 'Poppins',
          color: '#ffffff',
          textAlign: 'center'
        }
      ]
    },
    pages: [
      {
        id: 'page-1',
        backgroundColor: '#fff1f2',
        backgroundImage: 'https://images.unsplash.com/photo-1759265472435-bce65ac2eb36?w=700&h=900&fit=crop',
        elements: [
          {
            id: 'p1-title',
            type: 'text',
            content: 'Chapter 1',
            x: 50,
            y: 50,
            width: 250,
            height: 80,
            fontSize: 42,
            fontFamily: 'Playfair Display',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: 'p1-text',
            type: 'text',
            content: 'The moment our eyes met, I knew my life would never be the same.',
            x: 40,
            y: 570,
            width: 270,
            height: 100,
            fontSize: 18,
            fontFamily: 'Cormorant',
            color: '#fff',
            textAlign: 'center'
          }
        ]
      },
      {
        id: 'page-2',
        backgroundColor: '#fef2f2',
        elements: [
          {
            id: 'p2-quote',
            type: 'text',
            content: '"Love is not about how many days, months, or years you have been together. It\'s all about how much you love each other every single day."',
            x: 40,
            y: 300,
            width: 270,
            height: 300,
            fontSize: 24,
            fontFamily: 'Dancing Script',
            color: '#ec4899',
            textAlign: 'center',
            fontStyle: 'italic'
          }
        ]
      },
      {
        id: 'page-3',
        backgroundColor: '#fff',
        backgroundImage: 'https://images.unsplash.com/photo-1715483282597-fb57c8b0c28f?w=700&h=900&fit=crop',
        elements: [
          {
            id: 'p3-title',
            type: 'text',
            content: 'Our Journey',
            x: 50,
            y: 700,
            width: 250,
            height: 80,
            fontSize: 38,
            fontFamily: 'Playfair Display',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 8px rgba(0,0,0,0.6)'
          }
        ]
      },
      {
        id: 'page-4',
        backgroundColor: '#ffe4e1',
        elements: [
          {
            id: 'p4-text',
            type: 'text',
            content: 'Every moment with you is a treasure. Every laugh, every tear, every adventure - they all make our story unique and beautiful.',
            x: 40,
            y: 350,
            width: 270,
            height: 200,
            fontSize: 20,
            fontFamily: 'Poppins',
            color: '#8B4513',
            textAlign: 'center'
          }
        ]
      }
    ]
  };

  return (
    <>
      <button
        onClick={() => setShow3D(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold z-40"
      >
        <Box className="w-5 h-5" />
        <span>Test 3D Book</span>
      </button>

      {show3D && (
        <FlipBookReader
          book={testBook}
          onClose={() => setShow3D(false)}
        />
      )}
    </>
  );
}
