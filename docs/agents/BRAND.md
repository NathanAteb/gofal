# gofal.wales — Brand System
## Direction: Cartref

Locked. This is the brand. All agents reference this file.

---

## Identity

**Brand name:** gofal
**Domain:** gofal.wales
**Tagline (Welsh):** Mae gofal yn iawn.
**Tagline (English):** Care done right.
**Soul:** Warm, human, distinctly Welsh. The emotional opposite of every English care directory.

---

## Colour Palette

| Token | Name | Hex | Use |
|-------|------|-----|-----|
| `--primary-dark` | Bramble | `#4A2F4E` | Dark headers, footers, depth |
| `--primary` | Heather | `#7B5B7E` | Primary UI, nav, links |
| `--primary-light` | Lavender | `#A68AAB` | Hover states, secondary elements |
| `--secondary` | Soft Coral | `#D4806A` | CTAs, buttons, warm highlights |
| `--secondary-light` | Blush | `#F0C2B5` | Accent backgrounds |
| `--accent` | Honey | `#E5AD3E` | Stars, ratings, Active Offer badges |
| `--accent-light` | Butter | `#F5DFA0` | Highlight backgrounds |
| `--bg` | Ivory | `#FBF7F3` | Page background |
| `--surface` | White | `#FFFFFF` | Cards, panels |
| `--surface-alt` | Linen | `#F0E8DF` | Alternating sections |
| `--text-primary` | Dusk | `#2C2430` | Body text, headings |
| `--text-secondary` | Muted Plum | `#6B5C6B` | Captions, metadata |
| `--border` | Blush Grey | `#DDD4CE` | Dividers, card borders |

## Tailwind Config

```js
colors: {
  primary: {
    DEFAULT: '#7B5B7E',
    light: '#A68AAB',
    dark: '#4A2F4E',
  },
  secondary: {
    DEFAULT: '#D4806A',
    light: '#F0C2B5',
  },
  accent: {
    DEFAULT: '#E5AD3E',
    light: '#F5DFA0',
  },
  ivory: '#FBF7F3',
  linen: '#F0E8DF',
  dusk: '#2C2430',
  'muted-plum': '#6B5C6B',
  'blush-grey': '#DDD4CE',
}
```

---

## Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headings (H1–H4) | **Poppins** | 700 / 600 | Google Fonts, letter-spacing: -0.5px |
| Body | **Nunito** | 400 / 600 | Google Fonts, rounded terminals |
| UI labels, nav | **Nunito** | 700 | |
| Captions | **Nunito** | 400 | |

**Minimum body size:** 18px / 1.125rem
**Line height:** 1.7 for body, 1.2 for headings
**Google Fonts import:**
```
https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap
```

---

## Shape & Space

**Border radius:**
- Default: `12px`
- Large: `16px`
- XL / containers: `24px`
- Buttons: `9999px` (pill shape)
- Badges: `9999px`

**Shadows:**
- Cards: `0 2px 12px rgba(44, 36, 48, 0.08)`
- Modals: `0 20px 60px rgba(44, 36, 48, 0.2)`

**Spacing:** Generous. Minimum 24px padding on all cards.

---

## Component Patterns

### Primary button
```css
background: #D4806A;
color: #fff;
border-radius: 9999px;
padding: 12px 28px;
font-family: Nunito;
font-weight: 700;
font-size: 15px;
```

### Secondary button
```css
background: transparent;
color: #7B5B7E;
border: 2px solid #7B5B7E;
border-radius: 9999px;
padding: 11px 28px;
```

### Active Offer badge (3 levels)
```css
/* Level 3 — Excellent */
background: #E5AD3E; color: #fff; border-radius: 9999px;

/* Level 2 — Good */
background: #F5DFA0; color: #7B5B7E; border-radius: 9999px;

/* Level 1 — Basic */
background: #F0E8DF; color: #6B5C6B; border-radius: 9999px;
```

### CIW rating pill
```css
background: #F5F0FF;
color: #7B5B7E;
border-radius: 9999px;
font-family: Nunito;
font-weight: 700;
font-size: 11px;
padding: 4px 12px;
```

### Care home card
```css
background: #fff;
border-radius: 16px;
border: 1px solid #DDD4CE;
overflow: hidden;
box-shadow: 0 2px 12px rgba(44, 36, 48, 0.08);
```

---

## Logo

```
gofal.wales
```
- Font: Poppins 700
- `gofal` in `#2C2430` (Dusk)
- `.cymru` in `#7B5B7E` (Heather)
- Optional: small dragon/ddraig motif at very small sizes

---

## Voice (see CONTENT_WRITER.md for full brief)

- Welsh first, English equal
- Warm but not saccharine
- Never clinical, never corporate
- Write like someone who has been through it
- *gofal* carries weight — never use it carelessly

---

## What to never do

- Never use flat white backgrounds without Ivory or Linen warmth
- Never use sharp 4px corners — always rounded
- Never use red for errors — use a muted coral instead
- Never use Inter or Roboto — always Poppins + Nunito
- Never use the CQC name — it's CIW (Care Inspectorate Wales)
- Never make Welsh feel secondary — it is always first
