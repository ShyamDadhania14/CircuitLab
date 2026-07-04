<div align="center">

# ⚡ CircuitLab

### the virtual breadboard that hits different

*wire it here first, flex it on real hardware later*

[![Deploy to Render](https://img.shields.io/badge/deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://circuitlab-beep.onrender.com)
![Vanilla JS](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![No Build Step](https://img.shields.io/badge/build%20step-none%20needed-success?style=for-the-badge)
![100+ Parts](https://img.shields.io/badge/components-100%2B-blueviolet?style=for-the-badge)

</div>

---

## 🫡 ok but what even is this

You know that feeling when you wanna build a circuit but you're scared to fry your Arduino? Say less.

**CircuitLab** is a full-blown, drag-and-drop, in-browser circuit simulator. Drop parts on a breadboard-textured canvas, wire them up pin-to-pin, hit **Simulate**, and watch LEDs glow, motors spin, buzzers actually beep, and 7-segment displays light up — all *before* you touch a single real wire.

Get your whole build perfect in here, then go replicate it IRL with zero guesswork. No cap.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build step, and no `node_modules` black hole. Just open it and go.

---

## ✨ Features

- 🧩 **100+ real components** grouped into categories including Resistors, Capacitors, Diodes, ICs, Sensors, Arduino Uno/Nano/Mega, ESP8266, ESP32, Raspberry Pi boards, Transistors, Op-Amps, Motors, Relays, Displays, and much more.
- 🔌 **Real pin-to-pin wiring** with selectable wire colors.
- ⚡ **Actual simulation engine** using an electrical graph solver (Union-Find) supporting breadboard rails, regulators, bridge rectifiers, transistors, and more.
- 🔊 **Interactive components** including buzzers (Web Audio), motors, servos, relays, LEDs, and displays.
- 💻 **Programmable boards**
  - Arduino-style JavaScript with `setup()`, `loop()`, `digitalWrite()`, `delay()`, etc.
  - Raspberry Pi Python using **Pyodide** with an `RPi.GPIO` compatibility layer.
- 🩺 **Working digital multimeter** with voltage, continuity, polarity detection, and `OL` indication.
- ↩️ **Full Undo/Redo** support (`Ctrl + Z` / `Ctrl + Shift + Z`).
- 💾 **Auto Save**, JSON Export, and Import support.
- 🎨 **PCB-inspired interface** with glowing solder pads, copper traces, and a modern dark theme.

---

## 🚀 Running Locally

Zero setup. That's the whole point.

```bash
git clone https://github.com/ShyamDadhania14/CircuitLab.git
cd CircuitLab
```

Open `index.html` directly in your browser.

Or serve it locally (recommended):

```bash
python3 -m http.server 8000
```

or

```bash
npx serve .
```

Then visit:

```
http://localhost:8000
```

---

## 🗂️ Repository Structure

```text
CircuitLab/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── icons/
│   ├── images/
│   └── sounds/
├── README.md
└── LICENSE
```

Everything runs entirely on the client side.

Your projects are stored locally in your browser using **localStorage**. Nothing is uploaded to any server.

---

## 🎮 How to Actually Use It

| **Action** | **How** |
|:-----------|:--------|
| ➕ Add a part | Drag any component from the left sidebar onto the workspace. |
| 🔌 Wire two pins | Click the first pin, then click the second pin. |
| 🎨 Change wire color | Select a wire color from the bottom toolbar before connecting pins. |
| 🖱️ Move a component | Click and drag the component anywhere on the board. |
| 🔄 Rotate a component | Select it and click the **Rotate** button. |
| 🗑️ Delete a component | Select it and click the **Delete** button. |
| 📌 View pin information | Click a component to open its complete pinout in the inspector panel. |
| ⚡ Start simulation | Press the **Simulate** button in the top toolbar. |
| 🎛️ Toggle GPIO pins | During simulation, click Arduino or Raspberry Pi pins to change their state. |
| 💻 Write code | Select a programmable board and use the built-in editor in the inspector panel. |
| 🩺 Measure voltage or continuity | Place a **Multimeter** and connect both probes to the desired nodes. |
| ↩️ Undo / Redo | Press **Ctrl + Z** / **Ctrl + Shift + Z**, or use the toolbar buttons. |
| 💾 Save your work | Projects auto-save automatically. Use **Export** to download a `.json` project file. |
| 📂 Load a project | Click **Import** and select a previously exported JSON file. |

---

## 🛠️ Built With

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Web Audio API
- Canvas API
- Local Storage API
- Pyodide (loaded on demand from CDN for Raspberry Pi Python support)

No frameworks.

No bundlers.

No build tools.

No dependencies to install.

---

## 🤝 Contributing

Contributions are welcome!

Whether you'd like to:

- Add new electronic components
- Improve the simulator
- Fix bugs
- Improve the UI
- Optimize performance
- Improve documentation

Feel free to open an Issue or submit a Pull Request.

Adding a new component is straightforward since the component library is primarily defined in `script.js`.

---

## 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute it.

Just don't blame us if your real-life wiring lets the magic smoke out 😄

---

<div align="center">

### 🔧 Made for builders who'd rather simulate twice than desolder once.

⭐ If you found CircuitLab useful, consider giving the repository a star!

</div>