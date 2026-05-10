# 🎬 Animation Reference - Preview 3D Premium

## 📐 Animation Timings

### Standard Durations
```css
Fast: 150ms - 200ms    → Micro-interactions
Normal: 300ms - 400ms  → Standard transitions  
Slow: 500ms - 700ms    → Major scene changes
```

### Easing Functions
```css
ease-out     → Starts fast, ends slow (default cho exits)
ease-in      → Starts slow, ends fast (default cho entrances)
ease-in-out  → Smooth both ends (default cho transforms)
```

---

## 🎨 Implemented Animations

### 1️⃣ **Camera Scene Transitions** (View Mode Changes)

**Showcase → Flip → Read**

```tsx
// Animation config
duration: 300-500ms
easing: ease-out
properties: camera position, fov

// Implementation
useEffect(() => {
  const config = cameraConfigs[viewMode];
  setCameraPosition(config.position);
  setCameraTarget(config.target);
}, [viewMode]);
```

**Visual Effect**:
- Camera glides smoothly to new position
- FOV adjusts gradually
- No jarring jumps

---

### 2️⃣ **Page Flip Animation**

**3 States**:
```
Before flip  →  Mid flip  →  After flip
   (flat)      (rotating)     (new page)
```

**Implementation**:
```tsx
// Smooth interpolation
useFrame(() => {
  if (pageRef.current) {
    const currentRotation = pageRef.current.rotation.y;
    const rotationDiff = targetRotation - currentRotation;
    pageRef.current.rotation.y += rotationDiff * 0.1; // Smooth!
  }
});
```

**Properties Animated**:
- `rotation.y`: 0 → -Math.PI * 0.99
- `position.x`: 0 → -width
- Shadow intensity follows rotation

---

### 3️⃣ **Zoom Animation**

**Levels**: 100% → 125% → 150%

```tsx
// CSS Transform
<div style={{ 
  transform: `scale(${zoomLevel / 100})`,
  transition: 'transform 500ms ease-out'
}}>
```

**Badge Animation**:
```tsx
{zoomLevel !== 100 && (
  <div className="animate-fade-in">
    <p>{zoomLevel}%</p>
  </div>
)}
```

---

### 4️⃣ **Button Hover Effects**

**Scale + Shadow**:
```tsx
className="
  hover:scale-105      // Slightly bigger
  active:scale-95      // Press down effect
  hover:shadow-xl      // Deeper shadow
  transition-all       // Animate everything
  duration-300         // Smooth timing
"
```

**Icon Animations**:
```tsx
// Rotate
<RotateCcw className="group-hover:rotate-180 transition-transform duration-500" />

// Translate
<ChevronLeft className="group-hover:-translate-x-1 transition-transform" />

// Bounce
<ShoppingCart className="group-hover:rotate-12 transition-transform" />
```

---

### 5️⃣ **Toast Notifications**

**Entrance**: Slide up + Fade in
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Duration**: 
- Entrance: 300ms
- Display: 2000ms
- Exit: 300ms

---

### 6️⃣ **Progress Bar**

**Smooth Fill**:
```tsx
<div 
  className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-500"
  style={{ width: `${progress}%` }}
/>
```

**Effect**: Bar grows smoothly as pages flip

---

### 7️⃣ **Loading Animations**

**Book Icon**:
```tsx
animate-bounce       // Bouncing motion
animate-pulse        // Breathing effect (glow)
animate-spin         // For spinners
```

**Staggered Dots**:
```tsx
<div className="animate-bounce" style={{ animationDelay: '0ms' }} />
<div className="animate-bounce" style={{ animationDelay: '150ms' }} />
<div className="animate-bounce" style={{ animationDelay: '300ms' }} />
<div className="animate-bounce" style={{ animationDelay: '450ms' }} />
```

**Floating Particles**:
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-20px);
    opacity: 1;
  }
}
```

---

### 8️⃣ **Segmented Control**

**Tab Switch**:
```tsx
// Active tab slides in
transition-all duration-300

// Visual states
active:   bg-white shadow-md text-rose-600
inactive: text-gray-600 hover:bg-white/50
```

---

### 9️⃣ **Auto-Rotate Toggle**

**Switch Animation**:
```css
peer-checked:after:translate-x-full  // Slide knob
after:transition-all                  // Smooth movement
peer-checked:bg-gradient-to-r        // Color change
```

**Background**:
- Unchecked: `bg-gray-300`
- Checked: `gradient from-rose-500 to-pink-600`

---

### 🔟 **Card Hover Effects**

**Lift & Shadow**:
```tsx
className="
  hover:shadow-2xl         // Deeper shadow
  transition-all           // Smooth
  duration-300            // Medium speed
  hover:-translate-y-1    // Slight lift (optional)
"
```

---

## 🎯 Micro-interactions Detail

### **1. Button Press**
```
Hover:   scale(1.05) + shadow-xl
Active:  scale(0.95)
Default: scale(1)
```

### **2. Icon Transforms**
```tsx
// Rotation
rotate-12    // Shopping cart
rotate-180   // Reset icon

// Translation  
-translate-x-1   // Arrow left
translate-x-1    // Arrow right
-translate-y-1   // Lift up
```

### **3. Opacity Transitions**
```tsx
// Fade in
opacity-0 → opacity-100

// Pulse
animate-pulse (opacity 100% → 50% → 100%)
```

### **4. Background Glow**
```tsx
// Before (glow layer)
<div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 blur-2xl opacity-30 animate-pulse" />

// Main element on top
<div className="relative bg-gradient-to-br from-rose-500 to-purple-600" />
```

---

## 📱 Mobile-Specific Animations

### **Slide-up Panel**
```css
@keyframes slide-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

animation: slide-up 0.3s ease-out;
```

### **Touch Ripple** (Future)
```css
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

---

## 🎨 Tailwind Animation Classes Used

### **Standard Animations**
```css
animate-bounce    // Y-axis bounce
animate-pulse     // Opacity pulse
animate-spin      // 360° rotation
animate-ping      // Scale + fade out
```

### **Custom Animations**
```css
animate-fade-in   // Custom fade in
animate-float     // Floating effect
animate-slide-up  // Mobile panel
```

---

## ⚡ Performance Tips

### **1. Use `will-change` for Heavy Animations**
```css
will-change: transform, opacity;
```

### **2. Prefer Transform over Position**
```css
✅ transform: translateX(10px)
❌ left: 10px
```

### **3. Use `requestAnimationFrame`**
```tsx
// Three.js animations
useFrame(() => {
  // Runs at 60fps
});
```

### **4. Debounce Rapid Changes**
```tsx
// For scroll, resize events
const debounced = debounce(handler, 100);
```

---

## 🎬 Animation Orchestration

### **Sequence Example** (View Mode Change)
```
1. User clicks "Flip" tab
   ↓ (0ms)
2. Tab highlights (instant)
   ↓ (50ms)
3. Camera starts moving
   ↓ (300-500ms animation)
4. Camera reaches target position
   ↓ (0ms)
5. Toast shows "📖 Flip View"
   ↓ (2000ms)
6. Toast fades out
```

### **Parallel Example** (Page Flip)
```
Simultaneously:
- Page rotation.y changes
- Page position.x changes  
- Shadow adjusts
- Cover opens (if first page)
```

---

## 📊 Animation Budget

### **Critical Path** (Must be smooth)
- Camera movements: 60fps
- Page flips: 60fps
- Scrolling/dragging: 60fps

### **Secondary** (Can be 30fps)
- Progress bars
- Toast notifications
- Background effects

### **Low Priority** (Can skip frames)
- Particle effects
- Glow animations
- Auto-rotate

---

## 🛠️ Debug Tips

### **Check Frame Rate**
```tsx
useFrame((state) => {
  console.log('FPS:', state.clock.fps);
});
```

### **Monitor Animation Performance**
```tsx
// Chrome DevTools → Performance tab
// Look for long tasks (> 16ms)
```

### **Test on Low-End Devices**
```tsx
// Reduce particle count
// Lower shadow quality
// Disable auto-rotate on mobile
```

---

## ✅ Best Practices Checklist

- [ ] All animations have fallbacks
- [ ] Respects `prefers-reduced-motion`
- [ ] No layout shifts (use transforms)
- [ ] Smooth 60fps on desktop
- [ ] Acceptable 30fps on mobile
- [ ] Loading states for async ops
- [ ] Graceful degradation

---

## 🎉 Result

**All animations are:**
- ✅ Smooth (60fps target)
- ✅ Purposeful (enhance UX)
- ✅ Consistent (same timing/easing)
- ✅ Delightful (micro-interactions)
- ✅ Performant (optimized)

**Preview 3D bây giờ là một trải nghiệm animation tuyệt vời!** ✨
