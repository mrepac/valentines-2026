# valentines-2026

# Valentine Memory Game ❤️

Ljubka spletna aplikacija za Valentinovo - igra spomina z ljubkimi srčki.

## Funkcionalnosti

- 🕐 Števec časa skupaj od 11.5.2024 (dnevi, ure, minute, sekunde)
- 🎮 Interaktivna igra spomina z izbiro težavnosti
- 💖 Ljubki dizajn v belo-rdeče-roza barvah
- ✨ Animacije obrnitve kart
- 📱 Responsive dizajn

## Lokalni razvoj

```bash
# Namesti odvisnosti
npm install

# Zaženi razvojni strežnik
npm run dev
```

Odpri [http://localhost:3000](http://localhost:3000) v brskalniku.

## Deployment na Vercel

1. Pushaj projekt na GitHub
2. Poveži repozitorij z Vercel
3. Vercel bo samodejno zaznal Next.js in deployal aplikacijo

## Struktura

- `/app/page.tsx` - Landing stran s števcem
- `/app/game/page.tsx` - Stran z igro spomina
- `/app/globals.css` - Globalni stil in animacije
- `/app/api/images/route.ts` - API route za branje slik
- `/public/images/` - Mapa za slike (naloži svoje slike tukaj)

## Dodajanje slik

1. Naloži svoje slike v mapo `/public/images/`
2. Podprte formate: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
3. Za HEIC slike: Zaženi `npm run convert-heic` za pretvorbo v PNG
4. Aplikacija uporablja 4x4 mrežo (8 parov)
5. Pri vsaki novi igri se slike naključno zmešajo
6. Če ni slik, se uporabijo emojiji kot fallback
# valentines-2026
