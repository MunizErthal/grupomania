---
name: Grupo Mania D'Água
description: Gas and water depots of Estância Velha and Novo Hamburgo — stamped cylinder markings set on quiet neutral ground, with one owner-pinned accent for ordering.
colors:
  paper: "#f3f3f1"
  white: "#ffffff"
  line: "#dcdcd8"
  line-strong: "#bdbdb8"
  ink: "#16181a"
  ink-soft: "#55595c"
  ink-mute: "#7b7f82"
  steel: "#1c2022"
  steel-2: "#262b2d"
  steel-line: "#3a4043"
  steel-text: "#c3c8c9"
  accent: "#d33100"
  accent-press: "#b02900"
  accent-soft: "#fbeae4"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(3.4rem, 1.8rem + 7.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 62"
  numeral:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 2rem + 6vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 5vw, 5.25rem)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.25rem)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  subtitle:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2rem)"
    fontWeight: 850
    lineHeight: 0.95
    fontVariation: "'wdth' 62"
  lead:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum' 1"
  action:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 82"
  label:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 62"
rounded:
  mark: "3px"
  md: "10px"
  option: "14px"
  lg: "22px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
  "9": "7rem"
  gutter: "clamp(1rem, 0.6rem + 2vw, 2.5rem)"
  max: "1320px"
components:
  button-order:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 1.6rem 0 1.3rem"
    height: "3.4rem"
  button-order-hover:
    backgroundColor: "{colors.accent-press}"
    textColor: "{colors.white}"
  button-pill-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.2rem"
    height: "3rem"
  button-pill-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  button-dial:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 1.1rem 0 0.9rem"
    height: "2.9rem"
  button-dial-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "2rem"
  order-ticket:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "2rem 1.5rem 1.5rem"
  ticket-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.option}"
    padding: "0.7rem 0.9rem"
  ticket-option-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  ticket-depot-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.option}"
    padding: "0.7rem 0.8rem"
  chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.9rem"
  chip-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.7rem"
  photo:
    backgroundColor: "{colors.line}"
    rounded: "{rounded.lg}"
  admin-button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    height: "2.6rem"
---

# Design System: Grupo Mania D'Água

## Overview

**Creative North Star: "Stamped Markings, Quiet Ground"**

The system keeps the voice of what the depots deliver (the code stamped on a P13 collar, the 20 L jug label, the founding date) but sets it on calm, neutral ground. Type carries the identity. Surfaces are soft and modern. Sections alternate between warm paper (#f3f3f1) and white, and change in value only, never in hue. Three moments go dark: the yard film band, the 24h station, and the footer. One owner-pinned red-orange accent marks the order, the closing sentence of a headline, and small markings. It never covers a whole field.

Type does the heavy lifting. A single variable grotesk (Archivo) goes from ultra-condensed black for headlines and stamped codes (P13, 20 L, 24h, 03.03.2003) to normal width for reading. Tracked micro-caps stamps label real things: form steps, product codes, table heads, the footage tag. Around that type everything is gentle: white cards with a 22px radius and a soft shadow, pill buttons and chips, and photos that bleed to rounded corners with no frame.

The page reads young and plain for neighbours on a phone: 17px body, strong contrast, primary tap targets 3–3.4rem tall. Motion is short and grounded. Markings rise 18px into place as they enter the viewport, photos zoom 3.5% on hover, and the order button's icon tilts. Nothing loops or drifts.

**Key Characteristics:**
- Neutral grounds only: paper and white alternate by section, with dark steel/ink for film, the 24h station and the footer.
- One accent (#d33100), reserved for ordering, headline emphasis and small markings.
- One family, Archivo, with the width axis as the hierarchy: 62% condensed for markings, 82% semi for actions, 100% for reading.
- Soft white cards (22px radius, soft shadow), with no frames, rivets or hard borders.
- Pill-shaped buttons and chips.
- Frameless photos with a 22px radius.
- Tabular numerals everywhere: hours, phones, codes.

## Colors

The palette is quiet and neutral with a single hot accent: warm paper, white, graphite ink, dark steel, and one owner-pinned red-orange.

### Primary
- **Depot Red-Orange** (accent): the owner's pinned colour. Used on the order button (the only solid accent surface on the page), the header "Pedir", the mobile bar's gas button, the closing sentence of headlines, list-check icons, the depot fact labels, the P13 kg marking and the jug code, the matriz/24h chip, the station promo pill, 5px marking bars under the safety headline and above the testimonial, text selection and the focus ring.
- **Pressed Red-Orange** (accent-press): hover and press state of the order button.
- **Blush** (accent-soft): the selected depot tile in the order ticket and the admin's local-mode flag.

### Neutral
- **Paper** (paper): the body ground and every other section (hero, water, safety, FAQ); resting depot cards, ticket option tiles and fields.
- **White** (white): alternating sections (gas, depots, about); cards, the order ticket, chips, the mobile bar's water button.
- **Hairline** (line): dividers, table rows, soft chip rings, photo placeholder.
- **Strong Hairline** (line-strong): FAQ row rules, the stamped ribbon rule, menu and gallery button rings, outlined giant numerals on light grounds.
- **Ink** (ink): all type on light grounds, the dark selected ticket option, the depot WhatsApp dial, the outlined button's hover fill, the footer and film ground, the mobile order bar.
- **Graphite** (ink-soft): leads, secondary text, closed-status lines.
- **Muted Graphite** (ink-mute): table heads, captions, the stamped ribbon.
- **Dark Steel** (steel): the 24h station and the safety warning band.
- **Steel Plate** (steel-2): disabled primary admin button.
- **Steel Line** (steel-line): rules and outlined numerals on dark grounds.
- **Brushed Steel Text** (steel-text): secondary text on steel.

**Legacy aliases (admin only, not colours):** `--galv` → paper, `--galv-2` → #e8e8e5 (the admin sidebar shade), `--galv-line` → line-strong, `--galv-text-soft` and `--ochre-ink-soft` → ink-soft, `--ochre` → accent. They exist so older admin styles keep resolving. New work must use the neutral and accent names directly.

### Named Rules
**The One Accent Rule.** #d33100 is the only hue in the system. It marks the order, the emphasised last sentence of a headline, and small markings (icons, fact labels, 5px bars, one chip). It is never a section background, a card fill, a gradient, or a second brand colour.

**The Value-Only Rule.** Sections change ground by value (paper, white, ink/steel), never by hue. There are no ochre, gold or blue fields.

**The Solid Order Rule.** The only large solid accent surfaces are the order buttons. Every other solid pill is ink or white, so the order stays the loudest thing on screen.

## Typography

**Display Font:** Archivo variable (weight 100–900, width 62–125%), with Arial Narrow, system-ui fallback
**Body Font:** Archivo at normal width
**Label Font:** Archivo at 62% width, uppercase, tracked

**Character:** One family, squeezed into stamped markings for headlines and codes and relaxed to normal width for plain Portuguese reading. The condensed black is the brand.

### Hierarchy
- **Display** (900, 62% width, clamp 3.4–6rem, line-height 0.88, max ~11–12ch): the hero headline and the footer call line. The last sentence takes the accent.
- **Numeral** (900, 62% width, clamp 3.5–6rem, line-height 0.9): product codes (P5–P45) and the 20 L jug code. Outlined giant variants (transparent fill, 1.5–2px stroke in line-strong or steel-line) carry the station's "24h" (up to 30rem) and the founding date (up to 13rem). They are decorative and hidden from assistive tech.
- **Headline** (850, 62% width, clamp 2.75–5.25rem, line-height 0.95, max 10–14ch): section headings.
- **Title** (850, 62% width, clamp 2–3.25rem): ticket heading, depot names, safety items, gallery heading.
- **Subtitle** (850, 62% width, clamp 1.5–2rem): sub-sections and the hours caption.
- **Lead** (400, 1.25rem, line-height 1.5, 36–46ch): section introductions, in graphite.
- **Body** (400, 1.0625rem, line-height 1.55, max ~60ch): reading text. Tabular numerals are on globally.
- **Action** (750, 82% width, 1.125rem): order button text. Other buttons and nav links use 700 at 82% width.
- **Label / Stamp** (700, 62% width, 0.875rem, 0.08em tracking, uppercase): form legends, product codes, table heads, the stamped ribbon, the footage tag, chips.

### Named Rules
**The Width Axis Rule.** Hierarchy comes from Archivo's width and weight: condensed black for markings, 82% for actions, normal width for reading. Do not add a second typeface.

**The Stamp Is Not a Kicker Rule.** The uppercase stamp labels something that exists (a form step, a code, a column, the footage). It never sits above a headline as an eyebrow.

**The Closing Line Rule.** Headline emphasis is colour on the final sentence (for example "A gente leva."), never a gradient, underline or highlight box.

## Layout

A centred wrap of `min(100% − 2 × gutter, 1320px)` with a fluid gutter (1rem at phone width up to 2.5rem). Sections pad 7rem top and bottom and alternate paper and white. Divisions come from the change of ground, with no rules between sections. The film band, the station and the footer are the dark breaks. Content uses asymmetric 12-column splits (7/5, 5/7, 6/6) and steps to one column at 900–1024px.

On desktop the first viewport is a 7/5 split: headline, lead, live delivery status pills and secondary links on the left; the order ticket card on the right; a stamped ribbon under both. Below 1024px the ticket moves up directly under the lead. Under 760px a fixed ink order bar (accent gas pill and white water pill) slides up once the ticket scrolls away, respecting the safe-area inset. The yard film runs full-bleed between the hero and the gas section.

## Elevation & Depth

Soft and shallow. Depth comes from white cards lifted off paper by a two-layer soft shadow, and from the value change between sections. There are no hard offsets and no stroked frames. The order button carries a warm, accent-tinted shadow, so it reads as the one pressable thing.

### Shadow Vocabulary
- **Soft card** (`box-shadow: 0 1px 2px rgb(22 24 26 / 0.06), 0 12px 32px -12px rgb(22 24 26 / 0.18)`): the order ticket, the jug card, the safety label, and depot cards on hover (paired with a 1px inset line ring).
- **Order glow** (`box-shadow: 0 10px 24px -12px rgb(211 49 0 / 0.7)`): the order button at rest. It grows on hover (`0 14px 28px -12px`, 0.75) and tightens on press (`0 4px 10px -6px`).
- **Hairline ring** (`box-shadow: inset 0 0 0 1px var(--line)`): chips and live-status pills on light grounds, used in place of a border.
- **Cutout ground** (`filter: drop-shadow(0 22px 20px rgb(22 24 26 / 0.18))` on light; `0 30px 34px rgb(0 0 0 / 0.45)` on steel): transparent product renders.

### Named Rules
**The Soft Lift Rule.** Cards rise by shadow, never by an outline. A 1px ring is allowed only as an inset hairline on chips and hovered cards.

## Shapes

Round and friendly. Large surfaces (cards, the ticket, photos) use 22px. Ticket options and fields use 14px. Admin inputs and buttons use 10px. Every button, chip, status pill and nav toggle is a full pill (999px), and gallery arrows are circles. Small 3px radii are used only on the 5px accent marking bars.

Photos are frameless: no border and no stroke, just a 22px clip over a hairline-grey placeholder, with a slow 3.5% zoom on hover. The full-bleed film band is the one image with square edges.

## Components

### Buttons
- **Order (primary):** accent pill, white 750/82% text, 3.4rem tall, WhatsApp icon on the left, order glow shadow. Hover moves to the pressed shade, lifts 1px and tilts the icon −8°. Press drops 1px. Focus shows an ink ring. It is full width inside the order ticket. The header "Pedir" and the mobile bar pill are smaller cuts of it.
- **Outline pill (secondary):** transparent, 1.5px current-colour stroke, 3rem tall. Hover fills with ink and turns the text white (on steel it fills white with ink text). The quiet variant drops the stroke and turns the text accent on hover.
- **Depot dial:** an ink pill with a white tabular phone number. Hover turns it accent, because it places an order.
- **Admin:** white with a 1.5px ink stroke and 10px radius. Primary is solid ink; ghost uses a dashed stroke.

### Chips
- **Neutral chip:** white pill with an inset hairline ring (water brands, depot flags, live status with a green or muted clock icon).
- **Accent chip:** solid accent pill with white text, used only for the matriz/24h flag and the station promo.

### Cards / Containers
- **Corner Style:** 22px.
- **Background:** white on paper sections. Depot cards rest on paper within a white section and turn white with a soft shadow on hover.
- **Shadow Strategy:** soft card (see Elevation & Depth).
- **Border:** none.
- **Internal Padding:** 1.5–2rem.

### Inputs / Fields
- **Style:** paper fill, 1.5px hairline stroke, 14px radius (admin: white, strong hairline, 10px).
- **Focus:** the stroke turns ink and the fill turns white. Admin fields add a 3px accent halo at 20%. Elsewhere the global focus ring is 3px accent at a 3px offset (ink on the order button, a lighter orange on dark grounds).
- **Error:** admin only, brick red 650-weight text at label size.

### Navigation
- **Header bar:** sticky, paper at 86% with blur, 1px hairline bottom, 4.25rem tall. Links are 700/82% width, with a 2px accent underline that draws in from the left on hover. Then a tabular phone number and the accent "Pedir" pill.
- **Mobile (under 960px):** a white pill menu button opens a full-width paper panel of condensed 800 links on hairline dividers.
- **Admin:** a white top bar and a light grey sidebar. The current section is solid ink with white text.

### Order Ticket (signature)
A white 22px card with the soft shadow. The header has a condensed title and a live open/closed dot (green with a halo when open, a hollow ring when closed). Three stamped steps follow. First, choose Gás or Água: large condensed tiles; the selected tile turns solid ink with a light-orange code. Second, choose a depot: two-column tiles; the selected tile turns blush with an accent ring. Third, an optional address field. A dashed divider separates the italic message preview from the full-width order button.

### Warning Card
The safety section is one white card with a dark steel header band, a white headline and a short accent bar under it. Items sit below it, divided by hairlines, with a stamped footer line.

## Do's and Don'ts

### Do:
- **Do** alternate sections between paper and white, and use ink/steel only for the film, the 24h station and the footer.
- **Do** keep #d33100 for ordering, the closing sentence of a headline, and small markings.
- **Do** set headings, codes and numerals in Archivo 850–900 at 62% width, and reading text at normal width.
- **Do** show photos frameless with a 22px radius.
- **Do** make every button and chip a pill, and keep primary tap targets at least 3rem tall.
- **Do** keep tabular numerals on for hours, phones and product codes.
- **Do** let markings rise in (18px, 620ms, `cubic-bezier(0.16, 1, 0.3, 1)`) only when reduced motion is not requested.

### Don't:
- **Don't** use ochre, gold or blue grounds, or switch hue between sections.
- **Don't** add frames, rivets or hard borders to photos or cards.
- **Don't** introduce a second accent colour or use the accent as a background field.
- **Don't** put a stamped eyebrow or kicker line above a headline.
- **Don't** lead with a stock flame or water-drop hero or a stock product shot; use the real yard footage and depot photos.
- **Don't** add a second typeface.
- **Don't** stamp figures that are not true (a tare weight, a ticket serial, an invented order number).
