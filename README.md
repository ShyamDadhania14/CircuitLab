<div align="center">

# ⚡ CircuitLab

### the virtual breadboard that hits different

*wire it here first, flex it on real hardware later*

[![Deploy to Render](https://img.shields.io/badge/deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/deploy)
![Vanilla JS](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![No Build Step](https://img.shields.io/badge/build%20step-none%20needed-success?style=for-the-badge)
![100+ Parts](https://img.shields.io/badge/components-100%2B-blueviolet?style=for-the-badge)

</div>

---

## 🫡 ok but what even is this

You know that feeling when you wanna build a circuit but you're scared to fry your Arduino? Say less.

**CircuitLab** is a full-blown, drag-and-drop, in-browser circuit simulator. Drop parts on a breadboard-textured canvas, wire them up pin-to-pin, hit **Simulate**, and watch LEDs glow, motors spin, buzzers actually beep, and 7-segment displays light up — all *before* you touch a single real wire. Get your whole build perfect in here, then go replicate it IRL with zero guesswork. No cap.

Built with plain HTML/CSS/JS. No frameworks, no build step, no `node_modules` black hole. Just open it and go.

---

## ✨ the features (there are a LOT)

- 🧩 **100+ real components**, auto-sorted into folders by family (Resistors, Capacitors, Diodes, ICs, Sensors, you name it) — Arduino Uno/Nano/Mega, ESP8266/ESP32, three flavors of Raspberry Pi, transistors that actually switch, op-amps, a multimeter that *works*, and even a water tank with a float switch
- 🔌 **Real pin-to-pin wiring** — click a pin, click another pin, boom, wire. Pick your wire color first if you're feeling fancy
- ⚡ **A real simulation engine** — not just vibes. It's an actual electrical graph solver (union-find, for the nerds) that understands breadboard rails, transistor switching, voltage regulators, bridge rectifiers, the whole deal
- 🔊 **Buzzers that genuinely make noise** via Web Audio, motors that spin, servos that sweep, relays that click
- 💻 **Write real code for your boards** — Arduino-style JS sketches with `digitalWrite`/`delay`/`loop()`, or literal real Python (via Pyodide) for the Raspberry Pi boards, complete with an `RPi.GPIO` shim
- 🩺 **A multimeter you can actually probe things with** — shows voltage, continuity, reversed polarity, even `OL` for no continuity, just like the real thing
- ↩️ **Full undo/redo** — every move, wire, click, and edit is on the history stack. `Ctrl+Z` / `Ctrl+Shift+Z` (or the buttons) and you're covered
- 💾 **Autosave** to your browser + JSON export/import so you can save, share, or reload your builds
- 🎨 **A whole visual identity** — dark PCB-green theme, copper traces, glowing solder-pad pins, because ugly tools make bad circuits (probably)

---

## 🚀 running it locally

Zero setup. That's the whole pitch.

```bash
git clone https://github.com/YOUR-USERNAME/circuitlab.git
cd circuitlab
```

Then just... open `index.html` in a browser. Or if you want a local server (recommended so nothing weird happens with file paths):

```bash
python3 -m http.server 8000
# or
npx serve .
```

Go to `http://localhost:8000` and start wiring.

---

## 🌐 deploying to Render (the whole reason this README exists)

This is a **static site** — no server, no backend, no database. Render makes this stupid easy:

1. Push this repo to GitHub.
2. On [Render](https://dashboard.render.com), click **New +** → **Static Site**.
3. Connect your GitHub repo.
4. Fill in:
   - **Build Command:** *(leave it empty — there's nothing to build)*
   - **Publish Directory:** `.` *(root of the repo)*
5. Click **Create Static Site**.
6. Wait like 60 seconds. Sip water. It's live.

That's it. No `package.json`, no build pipeline, no drama. Render just serves the files as-is.

---

## 🗂️ what's in the repo

```
circuitlab/
├── index.html      → page structure, toolbar, panels
├── style.css        → the entire dark PCB aesthetic
├── script.js        → component library + wiring engine + simulation + everything else
└── README.md        → you are here
```

Everything runs client-side. Your circuits live in `localStorage` on your own machine — nothing gets sent anywhere.

---

## 🎮 how to actually use it

| Action | How |
|---|---|
| Add a part | Drag it from the left sidebar onto the board |
| Wire two pins | Click pin A, then click pin B |
| Change wire color | Pick a color from the bottom bar *before* wiring |
| Move / select a part | Click and drag it |
| Rotate / delete a part | Click it, use the buttons that appear above it |
| See full pinout | Click any part — the right panel shows every pin |
| Power it on | Hit **Simulate** up top |
| Toggle an Arduino/Pi pin | Click the pin while Simulate is on |
| Write code for a board | Select it, scroll the inspector, there's an editor |
| Measure something | Drop a Multimeter, wire its two probes in |
| Undo / Redo | `Ctrl+Z` / `Ctrl+Shift+Z`, or the toolbar buttons |
| Save your build | Auto-saves, or hit **Export** for a `.json` file |

---

## 🛠️ built with

Literally just HTML, CSS, and JavaScript. No React, no bundler, no dependencies to `npm install`. The Raspberry Pi Python execution runs on [Pyodide](https://pyodide.org/), loaded on-demand straight from a CDN — the only thing here that touches the network.

---

## 🤝 contributing

Found a bug? Want to add a component? PRs are welcome — the component library is just a big object in `script.js`, so adding a new part is mostly copy-paste-and-vibe.

---

## 📄 license

MIT. Do whatever you want with it, just don't blame us if you wire your real Arduino wrong anyway.

<div align="center">

**made for builders who'd rather simulate twice than desolder once** 🔧

</div>
