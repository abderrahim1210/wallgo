# Utilisation dans WallGo

## Web / React (CSS)
```css
.chat-messages {
  background-image: url('/assets/chat-bg-classic-tile.png'); /* ou .svg */
  background-size: 400px 400px;   /* ndir 200px ila bghiti doodles sghar */
  background-repeat: repeat;
}
```

## React Native
```jsx
<ImageBackground source={require('./assets/chat-bg-classic-full.png')} resizeMode="cover" style={{flex:1}}>
  {/* messages */}
</ImageBackground>
```
(Ila bghiti tiling: `resizeMode="repeat"` m3a chat-bg-*-tile.png)

## Dark mode
const bg = isDark ? 'chat-bg-dark' : 'chat-bg-classic';
