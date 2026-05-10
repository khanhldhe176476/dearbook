# 🎵 DearBook Music Debug Guide

## Music Features

Mỗi template preview và FlipBookReader có nhạc nền ambient tự động phát theo theme sử dụng **Web Audio API**.

### Themes và Music
- **Love**: ❤️ Romantic ambient tones (soft piano-like)
- **Family**: 👨‍👩‍👧 Warm peaceful melodies  
- **Birthday**: 🎉 Happy upbeat celebration
- **Friendship**: 🤝 Cheerful bright tones

### How It Works

1. **Template Preview**: Khi click "Xem trước" template
2. **FlipBookReader**: Tự động generate nhạc ambient theo `book.theme` bằng Web Audio API
3. **Auto-play**: Nhạc tự động phát (không bị browser chặn)
4. **Controls**: Play/Pause, Mute, Volume slider
5. **Generative**: Nhạc được tạo real-time, không cần external files

### Debug Steps

Nếu không nghe thấy nhạc, kiểm tra:

#### 1. Browser Console
Mở Developer Tools (F12) → Console tab, tìm các log:

```
✅ Nhạc hoạt động:
🎵 Initializing ambient music for theme: "love"
✅ Ambient music started for theme: "love"

⏸️ Auto-play bị chặn (hiếm):
⏸️ Auto-play prevented by browser. User can click play button.
```

#### 2. Web Audio API
- Nhạc được tạo bằng **Web Audio API** (không cần download files)
- Không có network requests cho nhạc
- Hoạt động offline

#### 3. Browser Settings
- **Autoplay Policy**: Một số browser chặn autoplay
  - Chrome: Settings → Site Settings → Sound → cho phép autoplay
  - Firefox: about:config → media.autoplay.default → set to 0
- **Music Button**: Click nút 🎵 để manually play

#### 4. Theme Mapping
Verify theme được truyền đúng:

```javascript
// Trong console, khi mở preview:
📖 Opening template preview: {
  template: "Lời cảm ơn gia đình",
  theme: "family",  // ← Phải match với THEME_MUSIC keys
  templateId: "family-1"
}
```

Theme phải là một trong: `love`, `family`, `birthday`, `friendship`

### Music Generator

Nhạc được tạo bằng **Web Audio API** với các đặc điểm:
- **Love**: Sine waves, slow tempo (2000ms), soft romantic tones (C4, E4, G4, C5)
- **Family**: Sine waves, peaceful tempo (2500ms), warm tones (D4, F4, A4, D5)
- **Birthday**: Triangle waves, upbeat tempo (1500ms), happy tones (F4, G4, B4, D5)
- **Friendship**: Triangle waves, cheerful tempo (1800ms), bright tones (E4, G#4, B4, E5)

### Advantages

✅ **No external dependencies**: Không cần download files
✅ **No network errors**: Hoạt động 100% offline
✅ **No autoplay blocking**: Web Audio API không bị browser chặn như `<audio>` tag
✅ **Lightweight**: Không tốn bandwidth
✅ **Customizable**: Dễ thay đổi âm thanh theo theme

### UI States

| State | Icon | Description |
|-------|------|-------------|
| Loading | 🔄 Spinner | Đang load nhạc |
| Playing | 🎵 Animated bars | Nhạc đang phát |
| Paused | 🎵 Static icon | Nhạc bị pause |
| Error | 🎵 Gray icon | Load thất bại |

### Testing Checklist

- [ ] Mở template preview → Thấy notification "🎵 Nhạc nền đang phát"
- [ ] Hover vào music button → Thấy tooltip với tên bài nhạc
- [ ] Click Play/Pause → Nhạc phát/dừng
- [ ] Adjust volume slider → Volume thay đổi
- [ ] Click Mute → Nhạc tắt tiếng
- [ ] Test tất cả 4 themes (love, family, birthday, friendship)
- [ ] Check console không có errors

### Common Issues

**Issue**: "No music at all"
- **Solution**: Check console for errors, verify Web Audio API is supported (all modern browsers)
- **Verify**: `window.AudioContext` or `window.webkitAudioContext` exists

**Issue**: Music sounds weird or glitchy
- **Solution**: This is generative ambient music, it's intentionally minimal and atmospheric
- **Customize**: Edit `/utils/audioGenerator.ts` to change frequencies and wave types

**Issue**: Music notification không hiện
- **Solution**: Music vẫn đang phát in background, check music button có animated bars không

**Issue**: Can't control volume
- **Solution**: Make sure you're interacting with the page first (browser security requirement)
