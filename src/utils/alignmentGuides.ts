import {
  PageElement,
  BoundingBox,
  SnapTarget,
  AlignmentGuide,
  SpacingIndicator,
  SnapResult,
  SNAP_THRESHOLD_SCREEN_PX,
} from '../types/editor';

// ── Bounding Box ────────────────────────────────────────────────────────────

export function getElementBounds(element: PageElement): BoundingBox {
  const { x, y, width, height, rotation } = element;

  if (rotation === 0 || rotation == null) {
    return {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
      centerX: x + width / 2,
      centerY: y + height / 2,
    };
  }

  // Rotated: compute AABB from 4 corners
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const cx = x + width / 2;
  const cy = y + height / 2;
  const hw = width / 2;
  const hh = height / 2;

  const corners = [
    { x: cx - hw * cos + hh * sin, y: cy - hw * sin - hh * cos },
    { x: cx + hw * cos + hh * sin, y: cy + hw * sin - hh * cos },
    { x: cx + hw * cos - hh * sin, y: cy + hw * sin + hh * cos },
    { x: cx - hw * cos - hh * sin, y: cy - hw * sin + hh * cos },
  ];

  const xs = corners.map((c) => c.x);
  const ys = corners.map((c) => c.y);

  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
    centerX: cx,
    centerY: cy,
  };
}

// ── Snap Target Collection ──────────────────────────────────────────────────

export function getAllSnapTargets(
  elements: PageElement[],
  excludeIds: string[],
  pageWidth: number,
  pageHeight: number,
): SnapTarget[] {
  const targets: SnapTarget[] = [];

  // Page targets
  // Edge targets
  targets.push({ value: 0, type: 'left', source: 'page' });
  targets.push({ value: pageWidth, type: 'right', source: 'page' });
  targets.push({ value: 0, type: 'top', source: 'page' });
  targets.push({ value: pageHeight, type: 'bottom', source: 'page' });

  // Page center targets
  targets.push({ value: pageWidth / 2, type: 'center', source: 'page' });
  targets.push({ value: pageHeight / 2, type: 'middle', source: 'page' });

  // Margin targets (20px from edges)
  targets.push({ value: 20, type: 'left', source: 'page' });
  targets.push({ value: pageWidth - 20, type: 'right', source: 'page' });
  targets.push({ value: 20, type: 'top', source: 'page' });
  targets.push({ value: pageHeight - 20, type: 'bottom', source: 'page' });

  // Element targets
  const excludeSet = new Set(excludeIds);
  for (const el of elements) {
    if (excludeSet.has(el.id)) continue;
    if (!el.visible || el.locked) continue;

    const bounds = getElementBounds(el);

    targets.push({ value: bounds.left, type: 'left', source: 'element', elementId: el.id });
    targets.push({ value: bounds.centerX, type: 'center', source: 'element', elementId: el.id });
    targets.push({ value: bounds.right, type: 'right', source: 'element', elementId: el.id });
    targets.push({ value: bounds.top, type: 'top', source: 'element', elementId: el.id });
    targets.push({ value: bounds.centerY, type: 'middle', source: 'element', elementId: el.id });
    targets.push({ value: bounds.bottom, type: 'bottom', source: 'element', elementId: el.id });
  }

  return targets;
}

// ── Snap Matching ───────────────────────────────────────────────────────────

interface DragSnapPoint {
  value: number;
  type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
}

/**
 * Priority score for snap resolution. Lower = higher priority.
 * center-to-center = 0, edge-to-edge = 1, center-to-edge = 2, page = 3
 */
function snapPriority(dragType: string, targetType: string, targetSource: string): number {
  // center-to-center is best
  if (
    (dragType === 'center' || dragType === 'middle') &&
    (targetType === 'center' || targetType === 'middle')
  ) return 0;
  // edge-to-edge of same type
  if (dragType === targetType) return 1;
  // center-to-edge
  if (
    (dragType === 'center' || dragType === 'middle') &&
    (targetType !== 'center' && targetType !== 'middle')
  ) return 2;
  // page targets have slightly lower priority
  if (targetSource === 'page') return 3;
  return 2;
}

export function computeSnap(
  dragBounds: BoundingBox,
  targets: SnapTarget[],
  threshold: number,
  allElements: PageElement[],
  excludeIds: string[],
): SnapResult {
  let snappedX = dragBounds.left;
  let snappedY = dragBounds.top;
  const guides: AlignmentGuide[] = [];

  // Drag key points
  const dragPointsX: DragSnapPoint[] = [
    { value: dragBounds.left, type: 'left' },
    { value: dragBounds.centerX, type: 'center' },
    { value: dragBounds.right, type: 'right' },
  ];
  const dragPointsY: DragSnapPoint[] = [
    { value: dragBounds.top, type: 'top' },
    { value: dragBounds.centerY, type: 'middle' },
    { value: dragBounds.bottom, type: 'bottom' },
  ];

  // Vertical snap (X axis)
  const vertTargets = targets.filter(
    (t) => t.type === 'left' || t.type === 'center' || t.type === 'right',
  );

  let bestVertDist = Infinity;
  let bestVertPriority = 999;
  let matchedDragX: DragSnapPoint | null = null;
  let matchedVertTarget: SnapTarget | null = null;

  for (const dp of dragPointsX) {
    for (const t of vertTargets) {
      const dist = Math.abs(dp.value - t.value);
      if (dist < threshold) {
        const priority = snapPriority(dp.type, t.type, t.source);
        if (priority < bestVertPriority || (priority === bestVertPriority && dist < bestVertDist)) {
          bestVertDist = dist;
          bestVertPriority = priority;
          matchedDragX = dp;
          matchedVertTarget = t;
        }
      }
    }
  }

  if (matchedDragX && matchedVertTarget !== null) {
    const offset = matchedVertTarget.value - matchedDragX.value;
    snappedX = dragBounds.left + offset;

    // Determine guide line extent
    const relevantElements = allElements.filter(
      (el) => !excludeIds.includes(el.id) && el.visible,
    );
    const allBounds = [dragBounds, ...relevantElements.map((el) => getElementBounds(el))];
    const minY = Math.min(...allBounds.map((b) => b.top));
    const maxY = Math.max(...allBounds.map((b) => b.bottom));

    const guideType =
      matchedVertTarget.type === 'center'
        ? 'center'
        : matchedVertTarget.source === 'page'
          ? 'page-edge'
          : 'edge';

    guides.push({
      orientation: 'vertical',
      position: matchedVertTarget.value,
      start: minY,
      end: maxY,
      type: guideType as AlignmentGuide['type'],
    });
  }

  // Horizontal snap (Y axis)
  const horizTargets = targets.filter(
    (t) => t.type === 'top' || t.type === 'middle' || t.type === 'bottom',
  );

  let bestHorizDist = Infinity;
  let bestHorizPriority = 999;
  let matchedDragY: DragSnapPoint | null = null;
  let matchedHorizTarget: SnapTarget | null = null;

  for (const dp of dragPointsY) {
    for (const t of horizTargets) {
      const dist = Math.abs(dp.value - t.value);
      if (dist < threshold) {
        const priority = snapPriority(dp.type, t.type, t.source);
        if (priority < bestHorizPriority || (priority === bestHorizPriority && dist < bestHorizDist)) {
          bestHorizDist = dist;
          bestHorizPriority = priority;
          matchedDragY = dp;
          matchedHorizTarget = t;
        }
      }
    }
  }

  if (matchedDragY && matchedHorizTarget !== null) {
    const offset = matchedHorizTarget.value - matchedDragY.value;
    snappedY = dragBounds.top + offset;

    const relevantElements = allElements.filter(
      (el) => !excludeIds.includes(el.id) && el.visible,
    );
    const allBounds = [dragBounds, ...relevantElements.map((el) => getElementBounds(el))];
    const minX = Math.min(...allBounds.map((b) => b.left));
    const maxX = Math.max(...allBounds.map((b) => b.right));

    const guideType =
      matchedHorizTarget.type === 'middle'
        ? 'center'
        : matchedHorizTarget.source === 'page'
          ? 'page-edge'
          : 'edge';

    guides.push({
      orientation: 'horizontal',
      position: matchedHorizTarget.value,
      start: minX,
      end: maxX,
      type: guideType as AlignmentGuide['type'],
    });
  }

  // Detect equal spacing
  const spacingIndicators = detectEqualSpacing(
    allElements,
    excludeIds,
    { ...dragBounds, left: snappedX, top: snappedY },
    threshold,
  );

  return { snappedX, snappedY, guides, spacingIndicators };
}

// ── Equal Spacing Detection ─────────────────────────────────────────────────

export function detectEqualSpacing(
  elements: PageElement[],
  excludeIds: string[],
  dragBounds: BoundingBox,
  threshold: number,
): SpacingIndicator[] {
  const indicators: SpacingIndicator[] = [];
  const excludeSet = new Set(excludeIds);

  const otherElements = elements.filter(
    (el) => !excludeSet.has(el.id) && el.visible && !el.locked,
  );
  if (otherElements.length < 2) return indicators; // need 3+ total (drag + 2 others)

  // Combine: treat dragBounds as a virtual element
  const allBounds = [
    dragBounds,
    ...otherElements.map((el) => getElementBounds(el)),
  ];

  // ── Horizontal equal spacing (sorted by centerX) ──
  const sortedByX = [...allBounds].sort((a, b) => a.centerX - b.centerX);
  if (sortedByX.length >= 3) {
    // Check if elements are roughly on the same horizontal line
    const yCenters = sortedByX.map((b) => b.centerY);
    const ySpread = Math.max(...yCenters) - Math.min(...yCenters);
    const avgHeight =
      sortedByX.reduce((s, b) => s + (b.bottom - b.top), 0) / sortedByX.length;

    if (ySpread < avgHeight * 1.5) {
      // They're in a row. Check equal gaps between consecutive elements.
      const gaps: number[] = [];
      for (let i = 1; i < sortedByX.length; i++) {
        gaps.push(sortedByX[i].left - sortedByX[i - 1].right);
      }
      if (gaps.length >= 2) {
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const allEqual = gaps.every((g) => Math.abs(g - avgGap) < threshold * 2);
        if (allEqual && avgGap > 0) {
          indicators.push({
            direction: 'horizontal',
            positions: sortedByX.map((b) => b.left),
            gap: Math.round(avgGap),
            start: sortedByX[0].left,
            end: sortedByX[sortedByX.length - 1].right,
            midY: yCenters.reduce((a, b) => a + b, 0) / yCenters.length,
          });
        }
      }
    }
  }

  // ── Vertical equal spacing (sorted by centerY) ──
  const sortedByY = [...allBounds].sort((a, b) => a.centerY - b.centerY);
  if (sortedByY.length >= 3) {
    const xCenters = sortedByY.map((b) => b.centerX);
    const xSpread = Math.max(...xCenters) - Math.min(...xCenters);
    const avgWidth =
      sortedByY.reduce((s, b) => s + (b.right - b.left), 0) / sortedByY.length;

    if (xSpread < avgWidth * 1.5) {
      const gaps: number[] = [];
      for (let i = 1; i < sortedByY.length; i++) {
        gaps.push(sortedByY[i].top - sortedByY[i - 1].bottom);
      }
      if (gaps.length >= 2) {
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const allEqual = gaps.every((g) => Math.abs(g - avgGap) < threshold * 2);
        if (allEqual && avgGap > 0) {
          indicators.push({
            direction: 'vertical',
            positions: sortedByY.map((b) => b.top),
            gap: Math.round(avgGap),
            start: sortedByY[0].top,
            end: sortedByY[sortedByY.length - 1].bottom,
            midX: xCenters.reduce((a, b) => a + b, 0) / xCenters.length,
          });
        }
      }
    }
  }

  return indicators;
}

// ── Multi-Element Bounds ────────────────────────────────────────────────────

export function computeMultiElementBounds(
  elements: PageElement[],
  selectedIds: string[],
): BoundingBox | null {
  const selected = elements.filter((el) => selectedIds.includes(el.id));
  if (selected.length === 0) return null;

  const bounds = selected.map((el) => getElementBounds(el));
  return {
    left: Math.min(...bounds.map((b) => b.left)),
    right: Math.max(...bounds.map((b) => b.right)),
    top: Math.min(...bounds.map((b) => b.top)),
    bottom: Math.max(...bounds.map((b) => b.bottom)),
    centerX:
      (Math.min(...bounds.map((b) => b.left)) + Math.max(...bounds.map((b) => b.right))) / 2,
    centerY:
      (Math.min(...bounds.map((b) => b.top)) + Math.max(...bounds.map((b) => b.bottom))) / 2,
  };
}

// ── Convenience: page-coordinate threshold from screen pixels ───────────────

export function getPageThreshold(zoom: number): number {
  return SNAP_THRESHOLD_SCREEN_PX / zoom;
}
