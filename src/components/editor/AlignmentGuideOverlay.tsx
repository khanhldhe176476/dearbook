import React from 'react';
import { AlignmentGuide, SpacingIndicator } from '../../types/editor';

interface AlignmentGuideOverlayProps {
  guides: AlignmentGuide[];
  spacingIndicators: SpacingIndicator[];
  zoom: number;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Renders smart alignment guide lines and equal-spacing indicators
 * as an SVG overlay on the editor canvas.
 * pointer-events: none ensures it never blocks mouse interactions.
 */
export const AlignmentGuideOverlay: React.FC<AlignmentGuideOverlayProps> = React.memo(
  ({ guides, spacingIndicators, zoom, pageWidth, pageHeight }) => {
    const hasGuides = guides.length > 0;
    const hasSpacing = spacingIndicators.length > 0;

    if (!hasGuides && !hasSpacing) return null;

    const canvasW = pageWidth * zoom;
    const canvasH = pageHeight * zoom;

    // Guide line colors
    const edgeColor = '#4A90D9';       // blue — element-to-element edges
    const centerColor = '#E85D75';     // red/pink — center alignment
    const pageColor = '#9B59B6';       // purple — page center/edges
    const spacingColor = '#2ECC71';    // green — equal spacing

    const getGuideColor = (type: string): string => {
      switch (type) {
        case 'center':
          return centerColor;
        case 'page-center':
        case 'page-edge':
          return pageColor;
        case 'spacing':
          return spacingColor;
        default:
          return edgeColor;
      }
    };

    const lineWidth = 1; // 1px on screen, independent of zoom

    return (
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: canvasW,
          height: canvasH,
          pointerEvents: 'none',
          zIndex: 9998,
          overflow: 'visible',
        }}
        width={canvasW}
        height={canvasH}
        viewBox={`0 0 ${canvasW} ${canvasH}`}
      >
        {/* Guide lines */}
        {guides.map((guide, i) => {
          const color = getGuideColor(guide.type);
          const pos = guide.position * zoom;
          const s = guide.start * zoom;
          const e = guide.end * zoom;

          if (guide.orientation === 'vertical') {
            return (
              <line
                key={`guide-v-${i}`}
                x1={pos}
                y1={s}
                x2={pos}
                y2={e}
                stroke={color}
                strokeWidth={lineWidth}
                strokeDasharray={guide.type === 'page-center' ? '6,4' : 'none'}
                opacity={0.7}
              />
            );
          }
          return (
            <line
              key={`guide-h-${i}`}
              x1={s}
              y1={pos}
              x2={e}
              y2={pos}
              stroke={color}
              strokeWidth={lineWidth}
              strokeDasharray={guide.type === 'page-center' ? '6,4' : 'none'}
              opacity={0.7}
            />
          );
        })}

        {/* Spacing indicators */}
        {spacingIndicators.map((ind, i) => {
          if (ind.direction === 'horizontal') {
            const y = (ind.midY || (pageHeight / 2)) * zoom;
            const textX = ((ind.start + ind.end) / 2) * zoom;

            return (
              <g key={`spacing-h-${i}`}>
                {/* Dashed line between first and last element */}
                <line
                  x1={ind.start * zoom + 10}
                  y1={y}
                  x2={ind.end * zoom - 10}
                  y2={y}
                  stroke={spacingColor}
                  strokeWidth={lineWidth}
                  strokeDasharray="4,3"
                  opacity={0.6}
                />
                {/* Left arrowhead */}
                <polygon
                  points={`${ind.start * zoom + 10},${y} ${ind.start * zoom + 16},${y - 4} ${ind.start * zoom + 16},${y + 4}`}
                  fill={spacingColor}
                  opacity={0.7}
                />
                {/* Right arrowhead */}
                <polygon
                  points={`${ind.end * zoom - 10},${y} ${ind.end * zoom - 16},${y - 4} ${ind.end * zoom - 16},${y + 4}`}
                  fill={spacingColor}
                  opacity={0.7}
                />
                {/* Gap label */}
                <rect
                  x={textX - 22}
                  y={y - 12}
                  width={44}
                  height={18}
                  rx={4}
                  fill={spacingColor}
                  opacity={0.85}
                />
                <text
                  x={textX}
                  y={y + 2}
                  textAnchor="middle"
                  fill="white"
                  fontSize={10}
                  fontWeight="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {ind.gap}px
                </text>
                {/* Small gap markers between each adjacent pair */}
                {ind.positions.slice(1).map((pos, j) => {
                  const prevPos = ind.positions[j];
                  const gapCenterX = (prevPos + pos) / 2 * zoom;
                  // Find the right edge of the previous element
                  // We approximate: prev right edge ~ prev position + element width
                  // For simplicity just mark the gap
                  return (
                    <line
                      key={`gap-h-${i}-${j}`}
                      x1={gapCenterX}
                      y1={y - 6}
                      x2={gapCenterX}
                      y2={y + 6}
                      stroke={spacingColor}
                      strokeWidth={lineWidth}
                      opacity={0.5}
                    />
                  );
                })}
              </g>
            );
          }
          // Vertical spacing indicators
          const x = (ind.midX || (pageWidth / 2)) * zoom;
          const textY = ((ind.start + ind.end) / 2) * zoom;

          return (
            <g key={`spacing-v-${i}`}>
              <line
                x1={x}
                y1={ind.start * zoom + 10}
                x2={x}
                y2={ind.end * zoom - 10}
                stroke={spacingColor}
                strokeWidth={lineWidth}
                strokeDasharray="4,3"
                opacity={0.6}
              />
              {/* Top arrowhead */}
              <polygon
                points={`${x},${ind.start * zoom + 10} ${x - 4},${ind.start * zoom + 16} ${x + 4},${ind.start * zoom + 16}`}
                fill={spacingColor}
                opacity={0.7}
              />
              {/* Bottom arrowhead */}
              <polygon
                points={`${x},${ind.end * zoom - 10} ${x - 4},${ind.end * zoom - 16} ${x + 4},${ind.end * zoom - 16}`}
                fill={spacingColor}
                opacity={0.7}
              />
              {/* Gap label */}
              <rect
                x={x - 22}
                y={textY - 12}
                width={44}
                height={18}
                rx={4}
                fill={spacingColor}
                opacity={0.85}
              />
              <text
                x={x}
                y={textY + 2}
                textAnchor="middle"
                fill="white"
                fontSize={10}
                fontWeight="bold"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {ind.gap}px
              </text>
            </g>
          );
        })}
      </svg>
    );
  },
);

AlignmentGuideOverlay.displayName = 'AlignmentGuideOverlay';
