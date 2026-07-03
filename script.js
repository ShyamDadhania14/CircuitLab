/* ============================================================
   CircuitLab — component library + wiring + simulation engine
   ============================================================ */

/* ---------------- small svg helper ---------------- */
function svg(w, h, inner) {
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

/* ============================================================
   COMPONENT LIBRARY
   Each definition: id, name, category, w, h, pins[{id,name,x,y}],
   optional busGroups (arrays of pin ids that are internally the
   same electrical node), optional passThrough (pairs of pin ids
   that pass current straight through, e.g. resistor legs),
   optional dynamic (drives simulation visuals), art(w,h)->svg html
   ============================================================ */
const LIB = {};

function reg(def) { LIB[def.id] = def; }

/* ---- Arduino Uno ---- */
(function () {
  const w = 300, h = 210;
  const topY = 14;
  const topPins = ["AREF","GND","D13","D12","D11~","D10~","D9~","D8","D7","D6~","D5~","D4","D3~","D2","D1/TX","D0/RX"];
  const botPins = ["NC","IOREF","RESET","3V3","5V","GND","GND","VIN"];
  const anaPins = ["A0","A1","A2","A3","A4","A5"];
  const pins = [];
  const topStartX = 46, topGap = (w - 2*46) / (topPins.length - 1);
  topPins.forEach((p,i)=> pins.push({id:"T_"+p.replace(/[^A-Z0-9]/gi,""), name:p, x: topStartX + i*topGap, y: topY}));
  const botStartX = 46, botGap = (w - 2*46) / (botPins.length - 1);
  botPins.forEach((p,i)=> pins.push({id:"B_"+p.replace(/[^A-Z0-9]/gi,"")+"_"+i, name:p, x: botStartX + i*botGap, y: h-14}));
  const anaStartY = 70, anaGap = 20;
  anaPins.forEach((p,i)=> pins.push({id:"A_"+p, name:p, x: w-12, y: anaStartY + i*anaGap}));
  reg({
    id:"arduino_uno", name:"Arduino Uno", category:"Microcontrollers", w, h, pins,
    busGroups:[ pins.filter(p=>p.name==="GND").map(p=>p.id) ],
    dynamic:"arduino",
    art:(w,h)=> svg(w,h, `
      <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="8" fill="#0d76b8"/>
      <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="8" fill="none" stroke="#095a8c" stroke-width="2"/>
      <rect x="16" y="20" width="40" height="26" rx="3" fill="#c7cdd1"/>
      <rect x="20" y="16" width="32" height="8" fill="#c7cdd1"/>
      <rect x="20" y="60" width="26" height="20" rx="2" fill="#2b2b2b"/>
      <circle cx="24" cy="80" r="4" fill="#888"/>
      <rect x="110" y="55" width="70" height="70" rx="2" fill="#1c1c1c"/>
      <text x="145" y="93" font-size="9" fill="#9aa" text-anchor="middle" font-family="monospace">ATMEGA328</text>
      <text x="${w/2}" y="${h/2+38}" font-size="13" fill="#eaf6ff" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-weight="700">ARDUINO UNO</text>
      <rect x="6" y="8" width="${w-12}" height="6" fill="#095a8c"/>
      <rect x="6" y="${h-14}" width="${w-12}" height="6" fill="#095a8c"/>
    `)
  });
})();

/* ---- Arduino Nano ---- */
(function () {
  const w = 300, h = 130;
  const topPins = ["D13","3V3","REF","A0","A1","A2","A3","A4","A5","A6","A7","5V","RST","GND","VIN"];
  const botPins = ["GND","D12","D11~","D10~","D9~","D8","D7","D6~","D5~","D4","D3~","D2","RST","D1/TX","D0/RX"];
  const pins = [];
  const startX = 20, gap = (w - 2*20) / (topPins.length - 1);
  topPins.forEach((p,i)=> pins.push({id:"NT_"+p.replace(/[^A-Z0-9]/gi,"")+"_"+i, name:p, x: startX + i*gap, y: 14}));
  botPins.forEach((p,i)=> pins.push({id:"NB_"+p.replace(/[^A-Z0-9]/gi,"")+"_"+i, name:p, x: startX + i*gap, y: h-14}));
  reg({
    id:"arduino_nano", name:"Arduino Nano", category:"Microcontrollers", w, h, pins,
    busGroups:[ pins.filter(p=>p.name==="GND").map(p=>p.id), pins.filter(p=>p.name==="RST").map(p=>p.id) ],
    dynamic:"arduino",
    art:(w,h)=> svg(w,h, `
      <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="6" fill="#0d76b8"/>
      <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="6" fill="none" stroke="#095a8c" stroke-width="2"/>
      <rect x="14" y="${h/2-10}" width="24" height="20" fill="#c7cdd1"/>
      <rect x="${w/2-16}" y="${h/2-14}" width="32" height="28" fill="#1c1c1c"/>
      <text x="${w/2}" y="${h/2+40}" font-size="12" fill="#eaf6ff" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-weight="700">ARDUINO NANO</text>
      <rect x="6" y="8" width="${w-12}" height="5" fill="#095a8c"/>
      <rect x="6" y="${h-13}" width="${w-12}" height="5" fill="#095a8c"/>
    `)
  });
})();

/* ---- Arduino Mega 2560 ---- */
(function () {
  const w = 780, h = 260;
  const PWM = new Set([2,3,4,5,6,7,8,9,10,11,12,13,44,45,46]);
  const topPins = ["AREF","GND"];
  for (let i=53;i>=0;i--) {
    if (i===1) topPins.push("D1/TX0");
    else if (i===0) topPins.push("D0/RX0");
    else topPins.push("D"+i+(PWM.has(i)?"~":""));
  }
  const botPins = ["NC","IOREF","RESET","3V3","5V","GND","GND","VIN"];
  const anaPins = []; for (let i=0;i<=15;i++) anaPins.push("A"+i);
  const pins = [];
  const topStartX = 34, topGap = (w - 2*34) / (topPins.length - 1);
  topPins.forEach((p,i)=> pins.push({id:"MT_"+p.replace(/[^A-Z0-9]/gi,"")+"_"+i, name:p, x: topStartX + i*topGap, y: 12}));
  const botStartX = 60, botGap = (w - 2*60) / (botPins.length - 1);
  botPins.forEach((p,i)=> pins.push({id:"MB_"+p.replace(/[^A-Z0-9]/gi,"")+"_"+i, name:p, x: botStartX + i*botGap, y: h-12}));
  const anaStartY = 18, anaGap = (h - 2*18) / (anaPins.length - 1);
  anaPins.forEach((p,i)=> pins.push({id:"MA_"+p, name:p, x: w-10, y: anaStartY + i*anaGap}));
  reg({
    id:"arduino_mega", name:"Arduino Mega 2560", category:"Microcontrollers", w, h, pins,
    busGroups:[ pins.filter(p=>p.name==="GND").map(p=>p.id) ],
    dynamic:"arduino",
    art:(w,h)=> svg(w,h, `
      <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="8" fill="#0d76b8"/>
      <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="8" fill="none" stroke="#095a8c" stroke-width="2"/>
      <rect x="20" y="24" width="46" height="30" rx="3" fill="#c7cdd1"/>
      <rect x="26" y="18" width="34" height="10" fill="#c7cdd1"/>
      <rect x="${w/2-60}" y="${h/2-30}" width="120" height="60" fill="#1c1c1c"/>
      <text x="${w/2}" y="${h/2+6}" font-size="9" fill="#9aa" text-anchor="middle" font-family="monospace">ATMEGA2560</text>
      <text x="${w/2}" y="${h/2+90}" font-size="15" fill="#eaf6ff" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-weight="700">ARDUINO MEGA 2560</text>
      <rect x="6" y="6" width="${w-12}" height="6" fill="#095a8c"/>
      <rect x="6" y="${h-12}" width="${w-12}" height="6" fill="#095a8c"/>
    `)
  });
})();

/* ---- Resistors (dedicated folder, real E-series color-coded values) ---- */
(function () {
  const COLORS = {
    black:"#1c1c1c", brown:"#5a3d1f", red:"#c0392b", orange:"#d4770f",
    yellow:"#e5c100", green:"#2f9e44", blue:"#2f6fb0", violet:"#8e44ad",
    grey:"#95a5a6", white:"#ecf0f1", gold:"#d4af37"
  };
  const VALUES = [
    { label:"100Ω",  ohms:100,     bands:["brown","black","brown"] },
    { label:"220Ω",  ohms:220,     bands:["red","red","brown"] },
    { label:"330Ω",  ohms:330,     bands:["orange","orange","brown"] },
    { label:"470Ω",  ohms:470,     bands:["yellow","violet","brown"] },
    { label:"1kΩ",   ohms:1000,    bands:["brown","black","red"] },
    { label:"2.2kΩ", ohms:2200,    bands:["red","red","red"] },
    { label:"4.7kΩ", ohms:4700,    bands:["yellow","violet","red"] },
    { label:"10kΩ",  ohms:10000,   bands:["brown","black","orange"] },
    { label:"47kΩ",  ohms:47000,   bands:["yellow","violet","orange"] },
    { label:"100kΩ", ohms:100000,  bands:["brown","black","yellow"] },
    { label:"1MΩ",   ohms:1000000, bands:["brown","black","green"] },
  ];
  VALUES.forEach(v=>{
    reg({
      id:"resistor_"+v.ohms, name:"Resistor "+v.label, category:"Resistors", w:84, h:26, sortKey:v.ohms,
      pins:[ {id:"l1",name:"Leg A",x:4,y:13}, {id:"l2",name:"Leg B",x:80,y:13} ],
      passThrough:[["l1","l2"]],
      art:(w,h)=> svg(w,h,`
        <line x1="4" y1="13" x2="24" y2="13" stroke="#c7cdd1" stroke-width="2"/>
        <line x1="60" y1="13" x2="80" y2="13" stroke="#c7cdd1" stroke-width="2"/>
        <rect x="24" y="4" width="36" height="18" rx="4" fill="#e3c896"/>
        <rect x="30" y="4" width="4" height="18" fill="${COLORS[v.bands[0]]}"/>
        <rect x="37" y="4" width="4" height="18" fill="${COLORS[v.bands[1]]}"/>
        <rect x="44" y="4" width="4" height="18" fill="${COLORS[v.bands[2]]}"/>
        <rect x="53" y="4" width="3" height="18" fill="${COLORS.gold}"/>
      `)
    });
  });
})();

/* ---- LED ---- */
reg({
  id:"led", name:"LED", category:"Output", w:46, h:74,
  pins:[ {id:"anode",name:"Anode (+)",x:16,y:66}, {id:"cathode",name:"Cathode (-)",x:32,y:66} ],
  dynamic:"led",
  art:(w,h)=> svg(w,h,`
    <defs><radialGradient id="ledg" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffb3b3"/><stop offset="55%" stop-color="#ff4242" class="led-body"/><stop offset="100%" stop-color="#af1414"/>
    </radialGradient></defs>
    <line x1="16" y1="46" x2="16" y2="66" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="32" y1="40" x2="32" y2="66" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="9" y="30" width="26" height="16" fill="#d8d8d8"/>
    <path class="led-dome" d="M9 30 a15 20 0 0 1 26 0 v6 h-26z" fill="url(#ledg)"/>
    <path d="M9 30 a15 20 0 0 1 26 0" fill="none" stroke="#7a1010" stroke-width="1"/>
  `)
});

/* ---- Push button ---- */
reg({
  id:"pushbutton", name:"Push Button", category:"Input", w:54, h:54,
  pins:[ {id:"p1",name:"Leg 1",x:10,y:6},{id:"p2",name:"Leg 2",x:44,y:6},
         {id:"p3",name:"Leg 3",x:10,y:48},{id:"p4",name:"Leg 4",x:44,y:48} ],
  busGroups:[["p1","p2"],["p3","p4"]],
  dynamic:"button",
  art:(w,h)=> svg(w,h,`
    <rect x="8" y="14" width="38" height="26" rx="2" fill="#2b2b2b"/>
    <circle cx="27" cy="27" r="13" fill="#3d3d3d" class="btn-cap" />
    <circle cx="27" cy="27" r="9" fill="#555" class="btn-cap-inner"/>
    <line x1="10" y1="6" x2="10" y2="16" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="44" y1="6" x2="44" y2="16" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="10" y1="38" x2="10" y2="48" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="44" y1="38" x2="44" y2="48" stroke="#c7cdd1" stroke-width="2"/>
  `)
});

/* ---- Buzzer ---- */
reg({
  id:"buzzer", name:"Buzzer", category:"Output", w:54, h:54,
  pins:[ {id:"vcc",name:"+ (VCC)",x:18,y:50}, {id:"gnd",name:"- (GND)",x:36,y:50} ],
  dynamic:"buzzer",
  art:(w,h)=> svg(w,h,`
    <line x1="18" y1="40" x2="18" y2="50" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="36" y1="40" x2="36" y2="50" stroke="#c7cdd1" stroke-width="2"/>
    <circle cx="27" cy="24" r="21" fill="#1c1c1c" class="buzzer-body"/>
    <circle cx="27" cy="24" r="21" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="27" cy="24" r="8" fill="#0a0a0a"/>
    <circle cx="19" cy="17" r="1.6" fill="#444"/><circle cx="35" cy="17" r="1.6" fill="#444"/>
    <circle cx="19" cy="31" r="1.6" fill="#444"/><circle cx="35" cy="31" r="1.6" fill="#444"/>
    <text x="27" y="12" font-size="6" fill="#888" text-anchor="middle">+</text>
  `)
});

/* ---- Servo motor ---- */
reg({
  id:"servo", name:"Servo Motor", category:"Output", w:78, h:66,
  pins:[ {id:"signal",name:"Signal",x:24,y:62},{id:"vcc",name:"VCC (+5V)",x:34,y:62},{id:"gnd",name:"GND",x:44,y:62} ],
  dynamic:"servo",
  art:(w,h)=> svg(w,h,`
    <rect x="10" y="18" width="58" height="34" rx="2" fill="#2f6fb0"/>
    <rect x="24" y="4" width="30" height="16" rx="2" fill="#e9e9e9"/>
    <g class="servo-arm" style="transform-origin:39px 12px;">
      <rect x="14" y="10" width="50" height="4" rx="2" fill="#f2f2f2"/>
      <circle cx="39" cy="12" r="5" fill="#ccc"/>
    </g>
    <line x1="24" y1="52" x2="24" y2="62" stroke="#d35400" stroke-width="2"/>
    <line x1="34" y1="52" x2="34" y2="62" stroke="#c0392b" stroke-width="2"/>
    <line x1="44" y1="52" x2="44" y2="62" stroke="#5a3d1f" stroke-width="2"/>
  `)
});

/* ---- Potentiometer ---- */
reg({
  id:"potentiometer", name:"Potentiometer", category:"Input", w:60, h:64,
  pins:[ {id:"gnd",name:"GND",x:12,y:60},{id:"wiper",name:"Wiper (signal)",x:30,y:60},{id:"vcc",name:"VCC",x:48,y:60} ],
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="6" width="48" height="40" rx="4" fill="#2b6cb0"/>
    <circle cx="30" cy="26" r="15" fill="#d0d0d0"/>
    <circle cx="30" cy="26" r="15" fill="none" stroke="#888" stroke-width="1.5"/>
    <line x1="30" y1="26" x2="30" y2="14" stroke="#333" stroke-width="2" class="pot-knob" style="transform-origin:30px 26px;"/>
    <line x1="12" y1="46" x2="12" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="30" y1="46" x2="30" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="48" y1="46" x2="48" y2="60" stroke="#c7cdd1" stroke-width="2"/>
  `)
});

/* ---- Breadboard (bus-heavy prototyping board) ---- */
(function () {
  const w = 480, h = 170;
  const pins = [];
  function railPins(prefix, y, color) {
    const xs = [40,100,160,220,300,360,420];
    xs.forEach((x,i)=> pins.push({id:prefix+i, name:prefix.includes("POS")?"Power rail +":"Power rail -", x, y}));
    return xs.map((x,i)=>prefix+i);
  }
  const railTopPos = railPins("RTP", 12);
  const railTopNeg = railPins("RTN", 26);
  const railBotPos = railPins("RBP", h-26);
  const railBotNeg = railPins("RBN", h-12);
  const colTop = [], colBot = [];
  for (let i=0;i<16;i++){
    const x = 30 + i*28;
    pins.push({id:"CT"+i, name:"Row a-e, col "+(i+1), x, y:56});
    pins.push({id:"CB"+i, name:"Row f-j, col "+(i+1), x, y:h-56});
    colTop.push("CT"+i); colBot.push("CB"+i);
  }
  reg({
    id:"breadboard", name:"Breadboard", category:"Prototyping", w, h, pins,
    busGroups:[railTopPos, railTopNeg, railBotPos, railBotNeg],
    art:(w,h)=> svg(w,h,`
      <rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="#f2f0e8"/>
      <rect x="0" y="4" width="${w}" height="14" fill="#e2453f" opacity=".55"/>
      <rect x="0" y="18" width="${w}" height="14" fill="#2f6fb0" opacity=".55"/>
      <rect x="0" y="${h-32}" width="${w}" height="14" fill="#2f6fb0" opacity=".55"/>
      <rect x="0" y="${h-18}" width="${w}" height="14" fill="#e2453f" opacity=".55"/>
      ${Array.from({length:16}).map((_,i)=>`<rect x="${28+i*28-1}" y="46" width="2" height="20" fill="#ccc"/>`).join("")}
      ${Array.from({length:16}).map((_,i)=>`<rect x="${28+i*28-1}" y="${h-66}" width="2" height="20" fill="#ccc"/>`).join("")}
      <line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="#d8d5c9" stroke-width="6"/>
    `)
  });
})();

/* ---- Battery (9V) ---- */
reg({
  id:"battery9v", name:"9V Battery", category:"Power", w:56, h:88,
  pins:[ {id:"pos",name:"+ Terminal",x:20,y:6},{id:"neg",name:"- Terminal",x:36,y:6} ],
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="16" width="44" height="68" rx="4" fill="#e07a1e"/>
    <rect x="6" y="16" width="44" height="30" fill="#333"/>
    <text x="28" y="36" font-size="8" fill="#fff" text-anchor="middle" font-family="monospace">9V</text>
    <rect x="14" y="2" width="10" height="14" rx="2" fill="#ccc"/>
    <rect x="32" y="2" width="10" height="14" rx="2" fill="#ccc"/>
    <text x="19" y="12" font-size="8" fill="#333" text-anchor="middle">+</text>
    <text x="37" y="12" font-size="8" fill="#333" text-anchor="middle">-</text>
  `)
});

/* ---- Ultrasonic HC-SR04 ---- */
reg({
  id:"hcsr04", name:"Ultrasonic Sensor (HC-SR04)", category:"Sensors", w:90, h:52,
  pins:[ {id:"vcc",name:"VCC",x:14,y:50},{id:"trig",name:"Trig",x:32,y:50},{id:"echo",name:"Echo",x:50,y:50},{id:"gnd",name:"GND",x:68,y:50} ],
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="20" width="86" height="24" rx="3" fill="#1259a3"/>
    <circle cx="26" cy="16" r="15" fill="#dcdcdc"/><circle cx="26" cy="16" r="10" fill="#9aa"/>
    <circle cx="64" cy="16" r="15" fill="#dcdcdc"/><circle cx="64" cy="16" r="10" fill="#9aa"/>
    <text x="45" y="38" font-size="7" fill="#dff" text-anchor="middle" font-family="monospace">HC-SR04</text>
  `)
});

/* ---- PIR motion sensor ---- */
reg({
  id:"pir", name:"PIR Motion Sensor", category:"Sensors", w:60, h:64,
  pins:[ {id:"gnd",name:"GND",x:16,y:60},{id:"out",name:"OUT",x:30,y:60},{id:"vcc",name:"VCC",x:44,y:60} ],
  art:(w,h)=> svg(w,h,`
    <rect x="8" y="30" width="44" height="20" fill="#2f7d4f"/>
    <path d="M10 30 a20 22 0 0 1 40 0 z" fill="#f4f4f4" opacity=".9"/>
    <path d="M10 30 a20 22 0 0 1 40 0" fill="none" stroke="#ccc" stroke-width="1"/>
    <circle cx="30" cy="20" r="3" fill="#dfe" opacity=".8"/>
  `)
});

/* ---- LCD 1602 with I2C backpack ---- */
reg({
  id:"lcd1602", name:"LCD Display (16x2, I2C)", category:"Output", w:150, h:64,
  pins:[ {id:"gnd",name:"GND",x:20,y:60},{id:"vcc",name:"VCC",x:40,y:60},{id:"sda",name:"SDA",x:60,y:60},{id:"scl",name:"SCL",x:80,y:60} ],
  dynamic:"lcd",
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="2" width="${w-4}" height="42" rx="3" fill="#0a2e1f"/>
    <rect x="10" y="8" width="${w-20}" height="28" fill="#123e2b" class="lcd-screen"/>
    <text x="18" y="26" font-size="9" fill="#39ff88" font-family="monospace" class="lcd-text">HELLO WORLD</text>
    <rect x="30" y="46" width="40" height="10" fill="#1a5fb4"/>
  `)
});

/* ---- Relay module ---- */
reg({
  id:"relay", name:"Relay Module", category:"Output", w:100, h:64,
  pins:[ {id:"vcc",name:"VCC",x:12,y:60},{id:"gnd",name:"GND",x:26,y:60},{id:"in",name:"IN (signal)",x:40,y:60},
         {id:"no",name:"NO",x:70,y:6},{id:"com",name:"COM",x:85,y:6},{id:"nc",name:"NC",x:70,y:60} ],
  dynamic:"relay",
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="4" fill="#1560bd"/>
    <rect x="10" y="14" width="40" height="30" rx="2" fill="#2b6cb0" class="relay-coil"/>
    <rect x="60" y="8" width="34" height="48" fill="#e8e8e8"/>
    <rect x="66" y="14" width="22" height="6" fill="#c0392b"/>
    <rect x="66" y="26" width="22" height="6" fill="#c0392b"/>
    <rect x="66" y="38" width="22" height="6" fill="#c0392b"/>
  `)
});

/* ---- DC motor ---- */
reg({
  id:"dcmotor", name:"DC Motor", category:"Output", w:60, h:66,
  pins:[ {id:"t1",name:"Terminal 1",x:20,y:62},{id:"t2",name:"Terminal 2",x:40,y:62} ],
  dynamic:"motor",
  art:(w,h)=> svg(w,h,`
    <circle cx="30" cy="30" r="24" fill="#d4a017" class="motor-body"/>
    <circle cx="30" cy="30" r="24" fill="none" stroke="#8a6d1a" stroke-width="2"/>
    <circle cx="30" cy="30" r="6" fill="#333" class="motor-shaft"/>
    <rect x="26" y="4" width="8" height="10" fill="#888"/>
    <line x1="20" y1="52" x2="20" y2="62" stroke="#c0392b" stroke-width="2"/>
    <line x1="40" y1="52" x2="40" y2="62" stroke="#222" stroke-width="2"/>
  `)
});

/* ---- Capacitors (dedicated folder, distinct types) ---- */
reg({
  id:"cap_ceramic", name:"Ceramic Capacitor", category:"Capacitors", w:44, h:52,
  pins:[ {id:"l1",name:"Leg A",x:14,y:48},{id:"l2",name:"Leg B",x:30,y:48} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <line x1="14" y1="30" x2="14" y2="48" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="30" y1="30" x2="30" y2="48" stroke="#c7cdd1" stroke-width="2"/>
    <ellipse cx="22" cy="20" rx="16" ry="14" fill="#2b7bb0"/>
    <ellipse cx="22" cy="20" rx="16" ry="14" fill="none" stroke="#1a4f73" stroke-width="2"/>
    <text x="22" y="24" font-size="8" fill="#dff" text-anchor="middle">104</text>
  `)
});

reg({
  id:"cap_electrolytic", name:"Electrolytic Capacitor", category:"Capacitors", w:46, h:64,
  pins:[ {id:"pos",name:"+ Leg",x:16,y:60},{id:"neg",name:"- Leg",x:32,y:60} ],
  passThrough:[["pos","neg"]],
  art:(w,h)=> svg(w,h,`
    <line x1="16" y1="46" x2="16" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="32" y1="46" x2="32" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="6" y="6" width="36" height="40" rx="6" fill="#222"/>
    <rect x="6" y="6" width="36" height="40" rx="6" fill="none" stroke="#444" stroke-width="1.5"/>
    <rect x="22" y="6" width="7" height="40" fill="#e0c34b" opacity=".85"/>
    <text x="17" y="18" font-size="9" fill="#e0c34b" text-anchor="middle">+</text>
  `)
});

reg({
  id:"cap_variable", name:"Variable Capacitor (Trimmer)", category:"Capacitors", w:46, h:44,
  pins:[ {id:"l1",name:"Leg A",x:14,y:40},{id:"l2",name:"Leg B",x:32,y:40} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <line x1="14" y1="26" x2="14" y2="40" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="32" y1="26" x2="32" y2="40" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="6" y="4" width="34" height="22" rx="3" fill="#e5c100"/>
    <rect x="6" y="4" width="34" height="22" rx="3" fill="none" stroke="#8a6d1a" stroke-width="1.5"/>
    <line x1="12" y1="20" x2="34" y2="8" stroke="#333" stroke-width="2.4" stroke-linecap="round"/>
  `)
});

/* ---- Inductors (dedicated folder, fixed and variable) ---- */
reg({
  id:"inductor_fixed", name:"Inductor (Fixed)", category:"Inductors", w:80, h:26,
  pins:[ {id:"l1",name:"Leg A",x:4,y:13},{id:"l2",name:"Leg B",x:76,y:13} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <line x1="4" y1="13" x2="18" y2="13" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="62" y1="13" x2="76" y2="13" stroke="#c7cdd1" stroke-width="2"/>
    <path d="M18 13 a6 8 0 0 1 12 0 a6 8 0 0 1 12 0 a6 8 0 0 1 12 0 a6 8 0 0 1 12 0"
          fill="none" stroke="#d4a017" stroke-width="4"/>
  `)
});

reg({
  id:"inductor_variable", name:"Inductor (Variable)", category:"Inductors", w:80, h:34,
  pins:[ {id:"l1",name:"Leg A",x:4,y:21},{id:"l2",name:"Leg B",x:76,y:21} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <line x1="4" y1="21" x2="18" y2="21" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="62" y1="21" x2="76" y2="21" stroke="#c7cdd1" stroke-width="2"/>
    <path d="M18 21 a6 8 0 0 1 12 0 a6 8 0 0 1 12 0 a6 8 0 0 1 12 0 a6 8 0 0 1 12 0"
          fill="none" stroke="#d4a017" stroke-width="4"/>
    <line x1="14" y1="12" x2="66" y2="2" stroke="#333" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M60 2 l8 -1 -3 7z" fill="#333"/>
  `)
});

/* ---- Solenoid (linear electromagnetic actuator) ---- */
reg({
  id:"solenoid", name:"Solenoid", category:"Output", w:84, h:50,
  pins:[ {id:"pos",name:"+ (VCC)",x:16,y:46},{id:"neg",name:"- (GND)",x:32,y:46} ],
  dynamic:"solenoid",
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="10" width="46" height="28" rx="4" fill="#5a5f66"/>
    <rect x="8" y="14" width="38" height="20" fill="#3a3f47"/>
    ${Array.from({length:6}).map((_,i)=>`<line x1="${12+i*6}" y1="14" x2="${12+i*6}" y2="34" stroke="#222" stroke-width="1.5"/>`).join("")}
    <rect class="solenoid-plunger" x="46" y="20" width="30" height="8" rx="2" fill="#c7cdd1" style="transform-origin:46px 24px;"/>
    <line x1="16" y1="38" x2="16" y2="46" stroke="#c0392b" stroke-width="2"/>
    <line x1="32" y1="38" x2="32" y2="46" stroke="#222" stroke-width="2"/>
  `)
});

/* ---- Coil (bare-wire air-core coil, same family as Inductors) ---- */
reg({
  id:"coil", name:"Coil (Air Core)", category:"Inductors", w:80, h:40,
  pins:[ {id:"l1",name:"Leg A",x:4,y:34},{id:"l2",name:"Leg B",x:76,y:34} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <line x1="4" y1="34" x2="16" y2="34" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="64" y1="34" x2="76" y2="34" stroke="#c7cdd1" stroke-width="2"/>
    ${Array.from({length:6}).map((_,i)=>`<ellipse cx="${20+i*8}" cy="20" rx="6" ry="16" fill="none" stroke="#d4a017" stroke-width="2.4"/>`).join("")}
  `)
});

/* ---- Transformer (isolated primary/secondary windings) ---- */
reg({
  id:"transformer", name:"Transformer", category:"Transformers", w:100, h:80,
  pins:[
    {id:"p1",name:"Primary +",x:14,y:74},{id:"p2",name:"Primary -",x:30,y:74},
    {id:"s1",name:"Secondary +",x:70,y:74},{id:"s2",name:"Secondary -",x:86,y:74}
  ],
  art:(w,h)=> svg(w,h,`
    <line x1="14" y1="60" x2="14" y2="74" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="30" y1="60" x2="30" y2="74" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="70" y1="60" x2="70" y2="74" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="86" y1="60" x2="86" y2="74" stroke="#c7cdd1" stroke-width="2"/>
    ${Array.from({length:5}).map((_,i)=>`<ellipse cx="22" cy="${16+i*9}" rx="14" ry="5" fill="none" stroke="#d4a017" stroke-width="2.2"/>`).join("")}
    ${Array.from({length:5}).map((_,i)=>`<ellipse cx="78" cy="${16+i*9}" rx="14" ry="5" fill="none" stroke="#2f6fb0" stroke-width="2.2"/>`).join("")}
    <rect x="46" y="8" width="4" height="52" fill="#8a8a8a"/>
    <rect x="52" y="8" width="4" height="52" fill="#8a8a8a"/>
  `)
});

/* ---- Diodes (dedicated folder, real diode types) ---- */
reg({
  id:"diode_rectifier", name:"Rectifier Diode", category:"Diodes", w:64, h:24,
  pins:[ {id:"anode",name:"Anode (+)",x:4,y:12},{id:"cathode",name:"Cathode (-)",x:60,y:12} ],
  passThrough:[["anode","cathode"]],
  art:(w,h)=> svg(w,h,`
    <line x1="4" y1="12" x2="18" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="46" y1="12" x2="60" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="18" y="3" width="28" height="18" rx="2" fill="#1c1c1c"/>
    <rect x="40" y="3" width="4" height="18" fill="#dcdcdc"/>
  `)
});

reg({
  id:"diode_zener", name:"Zener Diode", category:"Diodes", w:64, h:24,
  pins:[ {id:"anode",name:"Anode (+)",x:4,y:12},{id:"cathode",name:"Cathode (-)",x:60,y:12} ],
  passThrough:[["anode","cathode"]],
  art:(w,h)=> svg(w,h,`
    <line x1="4" y1="12" x2="18" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="46" y1="12" x2="60" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="18" y="3" width="28" height="18" rx="2" fill="#1c1c1c"/>
    <path d="M40 3 h4 v6 h2 v6 h-2 v6 h-4z" fill="#dcdcdc"/>
  `)
});

reg({
  id:"diode_schottky", name:"Schottky Diode", category:"Diodes", w:64, h:24,
  pins:[ {id:"anode",name:"Anode (+)",x:4,y:12},{id:"cathode",name:"Cathode (-)",x:60,y:12} ],
  passThrough:[["anode","cathode"]],
  art:(w,h)=> svg(w,h,`
    <line x1="4" y1="12" x2="18" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="46" y1="12" x2="60" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="18" y="3" width="28" height="18" rx="2" fill="#2b2b35"/>
    <rect x="38" y="3" width="3" height="18" fill="#dcdcdc"/>
    <rect x="43" y="3" width="3" height="18" fill="#dcdcdc"/>
  `)
});

reg({
  id:"photodiode", name:"Photo Diode", category:"Diodes", w:50, h:60,
  pins:[ {id:"anode",name:"Anode (+)",x:18,y:56},{id:"cathode",name:"Cathode (-)",x:32,y:56} ],
  passThrough:[["anode","cathode"]],
  art:(w,h)=> svg(w,h,`
    <line x1="18" y1="38" x2="18" y2="56" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="32" y1="34" x2="32" y2="56" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="10" y="24" width="30" height="14" fill="#cfd8dc" opacity=".5"/>
    <path class="led-dome" d="M10 24 a15 18 0 0 1 30 0 v0 h-30z" fill="#bfe3ff" opacity=".75"/>
    <path d="M10 24 a15 18 0 0 1 30 0" fill="none" stroke="#6ea8c9" stroke-width="1"/>
    <path d="M6 8 l6 6 M14 4 l5 7" stroke="#ffd76a" stroke-width="1.6" stroke-linecap="round"/>
  `)
});

reg({
  id:"laser_diode", name:"Laser Diode", category:"Diodes", w:50, h:50,
  pins:[ {id:"anode",name:"Anode (+)",x:18,y:46},{id:"cathode",name:"Cathode (-)",x:32,y:46} ],
  passThrough:[["anode","cathode"]],
  art:(w,h)=> svg(w,h,`
    <line x1="18" y1="36" x2="18" y2="46" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="32" y1="36" x2="32" y2="46" stroke="#c7cdd1" stroke-width="2"/>
    <circle cx="25" cy="20" r="18" fill="#9aa1a8"/>
    <circle cx="25" cy="20" r="18" fill="none" stroke="#666" stroke-width="1.5"/>
    <circle cx="25" cy="20" r="7" fill="#c0392b"/>
    <circle cx="25" cy="20" r="3" fill="#ffbcbc"/>
  `)
});

reg({
  id:"diode_1n4007", name:"Diode (1N4007)", category:"Diodes", w:64, h:24,
  pins:[ {id:"anode",name:"Anode (+)",x:4,y:12},{id:"cathode",name:"Cathode (-)",x:60,y:12} ],
  passThrough:[["anode","cathode"]],
  art:(w,h)=> svg(w,h,`
    <line x1="4" y1="12" x2="18" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="46" y1="12" x2="60" y2="12" stroke="#c7cdd1" stroke-width="2"/>
    <rect x="18" y="3" width="28" height="18" rx="2" fill="#1c1c1c"/>
    <rect x="40" y="3" width="4" height="18" fill="#dcdcdc"/>
    <text x="30" y="30" font-size="6" fill="#8a8" text-anchor="middle" font-family="monospace">1N4007</text>
  `)
});

/* ---- Bridge Rectifier (4-diode AC-to-DC converter block) ---- */
reg({
  id:"bridge_rectifier", name:"Bridge Rectifier (AC to DC)", category:"Diodes", w:64, h:64,
  pins:[
    {id:"ac1",name:"AC ~",x:12,y:6},{id:"ac2",name:"AC ~",x:52,y:6},
    {id:"dcpos",name:"DC + OUT",x:12,y:58},{id:"dcneg",name:"DC - OUT",x:52,y:58}
  ],
  regulators:[ {vin:"ac1", out:"dcpos"}, {vin:"ac2", out:"dcpos"} ],
  gndPass:[ {vin:"ac1", out:"dcneg"}, {vin:"ac2", out:"dcneg"} ],
  art:(w,h)=> svg(w,h,`
    <line x1="12" y1="6" x2="12" y2="16" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="52" y1="6" x2="52" y2="16" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="12" y1="48" x2="12" y2="58" stroke="#c0392b" stroke-width="2"/>
    <line x1="52" y1="48" x2="52" y2="58" stroke="#222" stroke-width="2"/>
    <rect x="8" y="16" width="48" height="32" rx="4" fill="#1c1c1c"/>
    <path d="M20 24 l8 8 -8 8 M44 24 l-8 8 8 8" fill="none" stroke="#666" stroke-width="1.6"/>
    <text x="12" y="14" font-size="7" fill="#9cf" text-anchor="middle">~</text>
    <text x="52" y="14" font-size="7" fill="#9cf" text-anchor="middle">~</text>
    <text x="12" y="45" font-size="8" fill="#e66" text-anchor="middle">+</text>
    <text x="52" y="45" font-size="8" fill="#ccc" text-anchor="middle">-</text>
  `)
});

/* ---- Transistors (dedicated folder) ---- */
reg({
  id:"bjt", name:"BJT (NPN Transistor)", category:"Transistors", w:50, h:64,
  pins:[ {id:"emitter",name:"Emitter",x:15,y:60},{id:"base",name:"Base",x:25,y:60},{id:"collector",name:"Collector",x:35,y:60} ],
  switchPins:{control:"base", a:"collector", b:"emitter"},
  dynamic:"transistor_switch",
  art:(w,h)=> svg(w,h,`
    <line x1="15" y1="46" x2="15" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="25" y1="30" x2="25" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="35" y1="46" x2="35" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <path d="M10 30 a15 16 0 0 1 30 0 v16 h-30z" fill="#1c1c1c"/>
    <rect x="8" y="34" width="4" height="10" fill="#1c1c1c"/>
    <text x="25" y="24" font-size="6" fill="#8a8" text-anchor="middle" font-family="monospace">NPN</text>
  `)
});

reg({
  id:"bc547", name:"BC547 (NPN Transistor)", category:"Transistors", w:50, h:64,
  pins:[ {id:"emitter",name:"Emitter",x:15,y:60},{id:"base",name:"Base",x:25,y:60},{id:"collector",name:"Collector",x:35,y:60} ],
  switchPins:{control:"base", a:"collector", b:"emitter"},
  dynamic:"transistor_switch",
  art:(w,h)=> svg(w,h,`
    <line x1="15" y1="46" x2="15" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="25" y1="30" x2="25" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="35" y1="46" x2="35" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <path d="M10 30 a15 16 0 0 1 30 0 v16 h-30z" fill="#1c1c1c"/>
    <rect x="8" y="34" width="4" height="10" fill="#1c1c1c"/>
    <text x="25" y="24" font-size="6" fill="#8a8" text-anchor="middle" font-family="monospace">BC547</text>
  `)
});

reg({
  id:"bc557", name:"BC557 (PNP Transistor)", category:"Transistors", w:50, h:64,
  pins:[ {id:"emitter",name:"Emitter",x:15,y:60},{id:"base",name:"Base",x:25,y:60},{id:"collector",name:"Collector",x:35,y:60} ],
  switchPins:{control:"base", a:"collector", b:"emitter", activeLow:true},
  dynamic:"transistor_switch",
  art:(w,h)=> svg(w,h,`
    <line x1="15" y1="46" x2="15" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="25" y1="30" x2="25" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="35" y1="46" x2="35" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <path d="M10 30 a15 16 0 0 1 30 0 v16 h-30z" fill="#3a2b2b"/>
    <rect x="8" y="34" width="4" height="10" fill="#3a2b2b"/>
    <text x="25" y="24" font-size="6" fill="#e9a" text-anchor="middle" font-family="monospace">BC557</text>
  `)
});

reg({
  id:"n2222", name:"2N2222 (NPN Transistor)", category:"Transistors", w:50, h:64,
  pins:[ {id:"emitter",name:"Emitter",x:15,y:60},{id:"base",name:"Base",x:25,y:60},{id:"collector",name:"Collector",x:35,y:60} ],
  switchPins:{control:"base", a:"collector", b:"emitter"},
  dynamic:"transistor_switch",
  art:(w,h)=> svg(w,h,`
    <line x1="15" y1="46" x2="15" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="25" y1="30" x2="25" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="35" y1="46" x2="35" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <path d="M10 30 a15 16 0 0 1 30 0 v16 h-30z" fill="#1c1c1c"/>
    <rect x="8" y="34" width="4" height="10" fill="#1c1c1c"/>
    <text x="25" y="24" font-size="5.5" fill="#8a8" text-anchor="middle" font-family="monospace">2N2222</text>
  `)
});

reg({
  id:"jfet", name:"JFET (N-Channel)", category:"Transistors", w:50, h:64,
  pins:[ {id:"source",name:"Source",x:15,y:60},{id:"gate",name:"Gate",x:25,y:60},{id:"drain",name:"Drain",x:35,y:60} ],
  passThrough:[["drain","source"]],
  art:(w,h)=> svg(w,h,`
    <line x1="15" y1="46" x2="15" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="25" y1="30" x2="25" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="35" y1="46" x2="35" y2="60" stroke="#c7cdd1" stroke-width="2"/>
    <path d="M10 30 a15 16 0 0 1 30 0 v16 h-30z" fill="#33363c"/>
    <rect x="8" y="34" width="4" height="10" fill="#33363c"/>
    <text x="25" y="24" font-size="6" fill="#9cf" text-anchor="middle" font-family="monospace">JFET</text>
  `)
});

reg({
  id:"mosfet", name:"MOSFET (N-Channel Power)", category:"Transistors", w:56, h:78,
  pins:[ {id:"gate",name:"Gate",x:16,y:74},{id:"drain",name:"Drain",x:28,y:74},{id:"source",name:"Source",x:40,y:74} ],
  switchPins:{control:"gate", a:"drain", b:"source"},
  dynamic:"transistor_switch",
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="6" width="44" height="52" rx="3" fill="#2b2b2b"/>
    <circle cx="28" cy="18" r="3.5" fill="none" stroke="#666" stroke-width="1.5"/>
    <rect x="12" y="58" width="32" height="10" fill="#8a8a8a"/>
    <line x1="16" y1="58" x2="16" y2="74" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="28" y1="58" x2="28" y2="74" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="40" y1="58" x2="40" y2="74" stroke="#c7cdd1" stroke-width="2"/>
    <text x="28" y="40" font-size="7" fill="#9c9" text-anchor="middle" font-family="monospace">MOSFET</text>
  `)
});

/* ---- ICs (dedicated folder, generic DIP-package chips) ---- */
function makeDipIC(opts) {
  const pins = [];
  const gapTop = (opts.w - 2*14) / Math.max(1, opts.topPins.length-1);
  opts.topPins.forEach((nm,i)=> pins.push({id:"T"+i+"_"+nm.replace(/[^A-Z0-9]/gi,""), name:nm, x:14+i*gapTop, y:8}));
  const gapBot = (opts.w - 2*14) / Math.max(1, opts.botPins.length-1);
  opts.botPins.forEach((nm,i)=> pins.push({id:"B"+i+"_"+nm.replace(/[^A-Z0-9]/gi,""), name:nm, x:14+i*gapBot, y:opts.h-8}));
  reg({
    id:opts.id, name:opts.name, category:"ICs", w:opts.w, h:opts.h, pins,
    art:(w,h)=> svg(w,h,`
      <rect x="4" y="4" width="${w-8}" height="${h-8}" rx="3" fill="#141414"/>
      <rect x="4" y="4" width="${w-8}" height="${h-8}" rx="3" fill="none" stroke="#000" stroke-width="1"/>
      <path d="M ${w/2-7} 4 a7 6 0 0 0 14 0" fill="#0a0a0a"/>
      <text x="${w/2}" y="${h/2+4}" font-size="9" fill="#8fd48a" text-anchor="middle" font-family="monospace">${opts.label}</text>
    `)
  });
}

makeDipIC({ id:"ic_microcontroller", name:"Microcontroller IC (DIP-8)", w:90, h:52, label:"ATTINY85",
  topPins:["VCC","PB5","PB4","PB3"], botPins:["GND","PB0","PB1","PB2"] });

makeDipIC({ id:"ic_microprocessor", name:"Microprocessor IC (DIP-20)", w:190, h:60, label:"CPU",
  topPins:["VCC","CLK","RESET","D0","D1","D2","D3","D4","D5","D6"],
  botPins:["GND","D7","A0","A1","A2","A3","A4","A5","A6","A7"] });

makeDipIC({ id:"ic_logic", name:"Logic IC (Quad NAND Gate)", w:150, h:52, label:"7400",
  topPins:["VCC","1A","1B","1Y","2A","2B","2Y"],
  botPins:["GND","3A","3B","3Y","4A","4B","4Y"] });

makeDipIC({ id:"ic_timer", name:"Timer IC (555)", w:90, h:52, label:"NE555",
  topPins:["VCC","DISCH","THRES","CTRL"], botPins:["GND","TRIG","OUT","RESET"] });

makeDipIC({ id:"ic_memory", name:"Memory IC (EEPROM)", w:90, h:52, label:"24LC256",
  topPins:["VCC","WP","SCL","SDA"], botPins:["GND","A0","A1","A2"] });

makeDipIC({ id:"ic_opamp", name:"Operational Amplifier", w:90, h:52, label:"LM358",
  topPins:["VCC","OUT2","IN2-","IN2+"], botPins:["GND","OUT1","IN1-","IN1+"] });

/* ---- Wires (dedicated folder: jumpers and probe leads) ---- */
reg({
  id:"jumper_mm", name:"Jumper Wire (Male-Male)", category:"Wires", w:96, h:22,
  pins:[ {id:"l1",name:"End A",x:6,y:14},{id:"l2",name:"End B",x:90,y:14} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="9" width="10" height="8" rx="1.5" fill="#1c1c1c"/>
    <line x1="0" y1="13" x2="6" y2="13" stroke="#c7cdd1" stroke-width="2.4"/>
    <line x1="12" y1="13" x2="${w-12}" y2="13" stroke="#e2453f" stroke-width="4" stroke-linecap="round"/>
    <rect x="${w-12}" y="9" width="10" height="8" rx="1.5" fill="#1c1c1c"/>
    <line x1="${w-6}" y1="13" x2="${w}" y2="13" stroke="#c7cdd1" stroke-width="2.4"/>
  `)
});

reg({
  id:"jumper_mf", name:"Jumper Wire (Male-Female)", category:"Wires", w:96, h:22,
  pins:[ {id:"l1",name:"End A (Male)",x:6,y:14},{id:"l2",name:"End B (Female)",x:90,y:14} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="9" width="10" height="8" rx="1.5" fill="#1c1c1c"/>
    <line x1="0" y1="13" x2="6" y2="13" stroke="#c7cdd1" stroke-width="2.4"/>
    <line x1="12" y1="13" x2="${w-14}" y2="13" stroke="#2f9e44" stroke-width="4" stroke-linecap="round"/>
    <rect x="${w-14}" y="6" width="14" height="14" rx="2" fill="#1c1c1c"/>
    <circle cx="${w-7}" cy="13" r="2.4" fill="#555"/>
  `)
});

reg({
  id:"jumper_ff", name:"Jumper Wire (Female-Female)", category:"Wires", w:96, h:22,
  pins:[ {id:"l1",name:"End A (Female)",x:6,y:14},{id:"l2",name:"End B (Female)",x:90,y:14} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="6" width="14" height="14" rx="2" fill="#1c1c1c"/>
    <circle cx="9" cy="13" r="2.4" fill="#555"/>
    <line x1="16" y1="13" x2="${w-16}" y2="13" stroke="#2f6fb0" stroke-width="4" stroke-linecap="round"/>
    <rect x="${w-16}" y="6" width="14" height="14" rx="2" fill="#1c1c1c"/>
    <circle cx="${w-9}" cy="13" r="2.4" fill="#555"/>
  `)
});

reg({
  id:"probe_wire", name:"Probe Wire (Test Lead)", category:"Wires", w:100, h:28,
  pins:[ {id:"l1",name:"Probe Tip",x:6,y:14},{id:"l2",name:"Banana Plug",x:94,y:14} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <path d="M2 14 l10 -5 v10z" fill="#c0392b"/>
    <line x1="12" y1="14" x2="${w-16}" y2="14" stroke="#e8c11c" stroke-width="4" stroke-linecap="round"/>
    <rect x="${w-16}" y="6" width="6" height="16" rx="2" fill="#1c1c1c"/>
    <rect x="${w-10}" y="9" width="8" height="10" rx="3" fill="#8a8a8a"/>
  `)
});

/* ---- LDR photoresistor ---- */
reg({
  id:"ldr", name:"Photoresistor (LDR)", category:"Sensors", w:42, h:44,
  pins:[ {id:"l1",name:"Leg A",x:12,y:40},{id:"l2",name:"Leg B",x:30,y:40} ],
  passThrough:[["l1","l2"]],
  art:(w,h)=> svg(w,h,`
    <line x1="12" y1="26" x2="12" y2="40" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="30" y1="26" x2="30" y2="40" stroke="#c7cdd1" stroke-width="2"/>
    <circle cx="21" cy="16" r="15" fill="#d98a3d"/>
    <path d="M8 16 q13 -12 26 0 M8 16 q13 12 26 0" fill="none" stroke="#5a3d1f" stroke-width="1.5"/>
  `)
});

/* ---- DHT11 temp/humidity ---- */
reg({
  id:"dht11", name:"Temperature Sensor (DHT11)", category:"Sensors", w:54, h:62,
  pins:[ {id:"vcc",name:"VCC",x:14,y:58},{id:"data",name:"DATA",x:27,y:58},{id:"gnd",name:"GND",x:40,y:58} ],
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="6" width="42" height="42" rx="4" fill="#2b6cb0"/>
    ${Array.from({length:4}).map((_,r)=>Array.from({length:5}).map((__,c)=>`<rect x="${12+c*7}" y="${12+r*8}" width="4" height="4" fill="#1a4f73"/>`).join("")).join("")}
  `)
});

/* ---- IR Sensor (obstacle/line-follower module) ---- */
reg({
  id:"ir_sensor", name:"IR Sensor", category:"Sensors", w:70, h:56,
  pins:[ {id:"gnd",name:"GND",x:16,y:52},{id:"vcc",name:"VCC",x:34,y:52},{id:"out",name:"OUT",x:52,y:52} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="24" width="62" height="20" fill="#2f7d4f"/>
    <circle cx="20" cy="18" r="8" fill="#5b2c8a"/>
    <circle cx="46" cy="18" r="8" fill="#3d0f0f"/>
    <text x="35" y="38" font-size="6" fill="#dff" text-anchor="middle" font-family="monospace">IR</text>
  `)
});

/* ---- Pulse Sensor (heartbeat) ---- */
reg({
  id:"pulse_sensor", name:"Pulse Sensor", category:"Sensors", w:56, h:60,
  pins:[ {id:"gnd",name:"- (GND)",x:16,y:56},{id:"vcc",name:"+ (VCC)",x:28,y:56},{id:"signal",name:"Signal",x:40,y:56} ],
  art:(w,h)=> svg(w,h,`
    <circle cx="28" cy="24" r="22" fill="#7a1f2b"/>
    <circle cx="28" cy="24" r="10" fill="#f2c94c"/>
    <path d="M10 24 h8 l3 -8 4 16 3 -10 3 6 h5" fill="none" stroke="#c0392b" stroke-width="1.6"/>
  `)
});

/* ---- Pressure Sensor (I2C barometric module) ---- */
reg({
  id:"pressure_sensor", name:"Pressure Sensor", category:"Sensors", w:56, h:60,
  pins:[ {id:"vcc",name:"VCC",x:12,y:56},{id:"gnd",name:"GND",x:26,y:56},{id:"scl",name:"SCL",x:40,y:56},{id:"sda",name:"SDA",x:54,y:56} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="6" width="48" height="40" rx="3" fill="#1560bd"/>
    <rect x="16" y="16" width="24" height="20" rx="2" fill="#0a0a0a"/>
    <text x="28" y="29" font-size="6" fill="#9ff" text-anchor="middle" font-family="monospace">BMP</text>
  `)
});

/* ---- Gas Sensor (MQ-series module) ---- */
reg({
  id:"gas_sensor", name:"Gas Sensor", category:"Sensors", w:70, h:64,
  pins:[ {id:"vcc",name:"VCC",x:14,y:60},{id:"gnd",name:"GND",x:30,y:60},{id:"dout",name:"DOUT",x:46,y:60},{id:"aout",name:"AOUT",x:60,y:60} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="16" width="62" height="30" rx="3" fill="#2f7d4f"/>
    <circle cx="35" cy="18" r="16" fill="#c7cdd1"/>
    <circle cx="35" cy="18" r="11" fill="#9aa"/>
    <circle cx="35" cy="18" r="5" fill="#555"/>
    <text x="35" y="40" font-size="6" fill="#dfd" text-anchor="middle" font-family="monospace">MQ-2</text>
  `)
});

/* ---- Light Sensor (digital module) ---- */
reg({
  id:"light_sensor", name:"Light Sensor", category:"Sensors", w:56, h:56,
  pins:[ {id:"gnd",name:"GND",x:14,y:52},{id:"vcc",name:"VCC",x:28,y:52},{id:"dout",name:"DOUT",x:42,y:52} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="24" width="48" height="18" fill="#2f7d4f"/>
    <circle cx="28" cy="18" r="12" fill="#f5e79e"/>
    <path d="M28 2 v6 M12 8 l4 4 M44 8 l-4 4" stroke="#e2c14a" stroke-width="2" stroke-linecap="round"/>
  `)
});

/* ---- Hall-effect Sensor ---- */
reg({
  id:"hall_sensor", name:"Hall-effect Sensor", category:"Sensors", w:50, h:58,
  pins:[ {id:"gnd",name:"GND",x:14,y:54},{id:"vcc",name:"VCC",x:26,y:54},{id:"out",name:"OUT",x:38,y:54} ],
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="10" width="38" height="34" rx="2" fill="#1c1c1c"/>
    <rect x="14" y="16" width="22" height="22" fill="#333"/>
    <text x="25" y="30" font-size="6" fill="#9c9" text-anchor="middle" font-family="monospace">HALL</text>
  `)
});

/* ---- Gyroscope Sensor (I2C) ---- */
reg({
  id:"gyro_sensor", name:"Gyroscope Sensor", category:"Sensors", w:54, h:54,
  pins:[ {id:"vcc",name:"VCC",x:12,y:50},{id:"gnd",name:"GND",x:24,y:50},{id:"scl",name:"SCL",x:36,y:50},{id:"sda",name:"SDA",x:48,y:50} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="4" width="46" height="36" rx="3" fill="#1560bd"/>
    <circle cx="27" cy="22" r="13" fill="none" stroke="#9ff" stroke-width="1.6"/>
    <circle cx="27" cy="22" r="7" fill="none" stroke="#9ff" stroke-width="1.2" transform="rotate(45 27 22)"/>
    <circle cx="27" cy="22" r="2" fill="#9ff"/>
  `)
});

/* ---- Humidity Sensor ---- */
reg({
  id:"humidity_sensor", name:"Humidity Sensor", category:"Sensors", w:54, h:60,
  pins:[ {id:"vcc",name:"VCC",x:14,y:56},{id:"gnd",name:"GND",x:27,y:56},{id:"out",name:"OUT",x:40,y:56} ],
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="6" width="42" height="40" rx="4" fill="#2b6cb0"/>
    <path d="M27 14 c8 10 8 16 0 20 c-8 -4 -8 -10 0 -20 z" fill="#bfe8ff"/>
  `)
});

/* ---- Proximity Sensor ---- */
reg({
  id:"proximity_sensor", name:"Proximity Sensor", category:"Sensors", w:64, h:56,
  pins:[ {id:"vcc",name:"VCC",x:16,y:52},{id:"gnd",name:"GND",x:32,y:52},{id:"out",name:"OUT",x:48,y:52} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="20" width="56" height="20" fill="#2b2b2b"/>
    <circle cx="32" cy="18" r="14" fill="#444"/>
    <circle cx="32" cy="18" r="8" fill="#111"/>
    <path d="M14 18 a18 18 0 0 1 36 0" fill="none" stroke="#39ff88" stroke-width="1.4" stroke-dasharray="2 3"/>
  `)
});

/* ---- Accelerometer Sensor (I2C) ---- */
reg({
  id:"accel_sensor", name:"Accelerometer Sensor", category:"Sensors", w:54, h:54,
  pins:[ {id:"vcc",name:"VCC",x:12,y:50},{id:"gnd",name:"GND",x:24,y:50},{id:"scl",name:"SCL",x:36,y:50},{id:"sda",name:"SDA",x:48,y:50} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="4" width="46" height="36" rx="3" fill="#1560bd"/>
    <g stroke="#9ff" stroke-width="1.6">
      <line x1="27" y1="10" x2="27" y2="34"/><line x1="15" y1="22" x2="39" y2="22"/>
      <line x1="18" y1="14" x2="36" y2="30"/>
    </g>
    <circle cx="27" cy="22" r="3" fill="#9ff"/>
  `)
});

/* ---- Seven Segment Display ---- */
(function () {
  const w = 74, h = 96;
  const order = ["com","a","b","c","d","e","f","g","dp"];
  const names = {com:"COM (common cathode)",a:"Segment A",b:"Segment B",c:"Segment C",d:"Segment D",e:"Segment E",f:"Segment F",g:"Segment G",dp:"Decimal Point"};
  const gap = (w - 2*8) / (order.length - 1);
  const pins = order.map((id,i)=> ({id, name:names[id], x: 8 + i*gap, y: h-6 }));
  reg({
    id:"sevenseg", name:"Seven Segment Display", category:"Output", w, h, pins,
    dynamic:"sevenseg",
    art:(w,h)=> svg(w,h,`
      <rect x="0" y="0" width="${w}" height="${h-8}" rx="4" fill="#1c1c1c"/>
      <rect class="seg seg-a"  x="16" y="8"  width="32" height="7" fill="#4a1414"/>
      <rect class="seg seg-f"  x="9"  y="15" width="7" height="28" fill="#4a1414"/>
      <rect class="seg seg-b"  x="48" y="15" width="7" height="28" fill="#4a1414"/>
      <rect class="seg seg-g"  x="16" y="42" width="32" height="7" fill="#4a1414"/>
      <rect class="seg seg-e"  x="9"  y="49" width="7" height="28" fill="#4a1414"/>
      <rect class="seg seg-c"  x="48" y="49" width="7" height="28" fill="#4a1414"/>
      <rect class="seg seg-d"  x="16" y="77" width="32" height="7" fill="#4a1414"/>
      <circle class="seg seg-dp" cx="60" cy="80" r="4" fill="#4a1414"/>
    `)
  });
})();

/* ---- OLED Display (I2C, 128x64 style) ---- */
reg({
  id:"oled_display", name:"OLED Display (I2C)", category:"Output", w:112, h:56,
  pins:[ {id:"gnd",name:"GND",x:16,y:52},{id:"vcc",name:"VCC",x:36,y:52},{id:"sda",name:"SDA",x:56,y:52},{id:"scl",name:"SCL",x:76,y:52} ],
  dynamic:"oled",
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="2" width="${w-4}" height="40" rx="3" fill="#0a0a0a"/>
    <rect class="oled-screen" x="8" y="8" width="${w-16}" height="28" fill="#001018"/>
    <g class="oled-text" style="opacity:.08">
      <rect x="14" y="14" width="18" height="3" fill="#7fe7ff"/>
      <rect x="14" y="20" width="30" height="3" fill="#7fe7ff"/>
      <rect x="14" y="26" width="22" height="3" fill="#7fe7ff"/>
      <circle cx="${w-28}" cy="22" r="7" fill="none" stroke="#7fe7ff" stroke-width="1.6"/>
    </g>
    <rect x="30" y="42" width="${w-60}" height="8" fill="#1a5fb4"/>
  `)
});

/* ---- Variable Battery (adjustable-voltage power supply) ---- */
reg({
  id:"battery_variable", name:"Variable Battery (1.5–12V)", category:"Power", w:64, h:96,
  pins:[ {id:"pos",name:"+ Terminal",x:22,y:6},{id:"neg",name:"- Terminal",x:42,y:6} ],
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="18" width="52" height="74" rx="5" fill="#3a3f47"/>
    <rect x="6" y="18" width="52" height="30" fill="#22262c"/>
    <circle cx="32" cy="33" r="11" fill="#111" stroke="#555" stroke-width="1.5"/>
    <line x1="32" y1="33" x2="32" y2="25" stroke="#39ff88" stroke-width="2"/>
    <text class="voltage-label" x="32" y="72" font-size="13" fill="#39ff88" text-anchor="middle" font-family="monospace" font-weight="700">5V</text>
    <rect x="16" y="2" width="10" height="16" rx="2" fill="#ccc"/>
    <rect x="38" y="2" width="10" height="16" rx="2" fill="#ccc"/>
    <text x="21" y="13" font-size="8" fill="#333" text-anchor="middle">+</text>
    <text x="43" y="13" font-size="8" fill="#333" text-anchor="middle">-</text>
  `)
});

/* ---- Voltage Regulator (linear regulator, e.g. 7805) ---- */
reg({
  id:"voltage_regulator", name:"Voltage Regulator (7805)", category:"Power", w:56, h:64,
  pins:[ {id:"vin",name:"VIN",x:14,y:60},{id:"gnd",name:"GND",x:28,y:60},{id:"vout",name:"VOUT",x:42,y:60} ],
  regulator:{ vin:"vin", out:"vout" },
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="4" width="48" height="42" rx="3" fill="#2b2b2b"/>
    <circle cx="28" cy="14" r="4" fill="none" stroke="#666" stroke-width="1.4"/>
    <rect x="10" y="46" width="36" height="10" fill="#8a8a8a"/>
    <text x="28" y="34" font-size="8" fill="#9c9" text-anchor="middle" font-family="monospace">7805</text>
  `)
});

/* ---- Barrel Jack (DC power connector, feeds an Arduino's power input) ---- */
reg({
  id:"barrel_jack", name:"Barrel Jack (DC Power)", category:"Power", w:52, h:46,
  pins:[ {id:"pos",name:"Center Pin (+)",x:18,y:42},{id:"neg",name:"Sleeve (-)",x:34,y:42} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="10" width="44" height="26" rx="4" fill="#1c1c1c"/>
    <circle cx="26" cy="23" r="11" fill="#333"/>
    <circle cx="26" cy="23" r="5" fill="#111"/>
    <line x1="18" y1="36" x2="18" y2="42" stroke="#c0392b" stroke-width="2"/>
    <line x1="34" y1="36" x2="34" y2="42" stroke="#222" stroke-width="2"/>
  `)
});

/* ---- Raspberry Pi boards (accurate 40-pin BCM GPIO header, shared across models) ---- */
function makeRaspberryPiPins() {
  // physical pin 1..40, laid out as two 20-pin rows exactly as on the real header
  const row1 = ["3V3","GPIO2","GPIO3","GPIO4","GND","GPIO17","GPIO27","GPIO22","3V3","GPIO10","GPIO9","GPIO11","GND","ID_SD","GPIO5","GPIO6","GPIO13","GPIO19","GPIO26","GND"];
  const row2 = ["5V","5V","GND","GPIO14","GPIO15","GPIO18","GND","GPIO23","GPIO24","GND","GPIO25","GPIO8","GPIO7","ID_SC","GND","GPIO12","GND","GPIO16","GPIO20","GPIO21"];
  const pins = [];
  const marginX = 18, gap = (260 - 2*marginX) / 19;
  row1.forEach((nm,i)=> pins.push({id:"P1_"+nm+"_"+i, name:nm, x: marginX + i*gap, y: 22}));
  row2.forEach((nm,i)=> pins.push({id:"P2_"+nm+"_"+i, name:nm, x: marginX + i*gap, y: 34}));
  return pins;
}

function makeRaspberryPi(id, name, h, boardArt) {
  const pins = makeRaspberryPiPins();
  reg({
    id, name, category:"Single Board Computers", w:260, h, pins,
    busGroups:[
      pins.filter(p=>p.name==="GND").map(p=>p.id),
      pins.filter(p=>p.name==="3V3").map(p=>p.id),
      pins.filter(p=>p.name==="5V").map(p=>p.id),
    ],
    dynamic:"raspberrypi",
    art:(w,h)=> svg(w,h, `
      <rect x="2" y="42" width="${w-4}" height="${h-44}" rx="6" fill="#2e7d32"/>
      <rect x="2" y="42" width="${w-4}" height="${h-44}" rx="6" fill="none" stroke="#1b5e20" stroke-width="2"/>
      ${Array.from({length:20}).map((_,i)=>`<rect x="${17+i*12.7}" y="18" width="9" height="20" fill="#2b2b2b"/>`).join("")}
      ${boardArt(w,h)}
      <text x="${w/2}" y="${h-10}" font-size="12" fill="#eaf6ff" text-anchor="middle" font-family="'Space Grotesk',sans-serif" font-weight="700">${name.toUpperCase()}</text>
    `)
  });
}

makeRaspberryPi("rpi4b", "Raspberry Pi 4 Model B", 190, (w,h)=>`
  <rect x="14" y="${h-64}" width="30" height="20" fill="#c0c0c0"/>
  <rect x="${w-70}" y="${h-64}" width="18" height="14" fill="#333"/>
  <rect x="${w-46}" y="${h-64}" width="18" height="14" fill="#333"/>
  <circle cx="${w-20}" cy="${h-50}" r="10" fill="#888"/>
`);

makeRaspberryPi("rpi3b", "Raspberry Pi 3 Model B", 170, (w,h)=>`
  <rect x="14" y="${h-58}" width="34" height="22" fill="#c0c0c0"/>
  <rect x="${w-90}" y="${h-58}" width="24" height="18" fill="#333"/>
  <rect x="${w-60}" y="${h-58}" width="24" height="18" fill="#333"/>
  <rect x="${w-30}" y="${h-58}" width="24" height="18" fill="#333"/>
`);

makeRaspberryPi("rpizero", "Raspberry Pi Zero W", 100, (w,h)=>`
  <rect x="14" y="${h-40}" width="20" height="14" fill="#c0c0c0"/>
  <circle cx="${w-24}" cy="${h-32}" r="7" fill="#888"/>
`);

/* ---- Water Storage Tank (built-in float switch; click the tank to fill/drain it) ---- */
reg({
  id:"water_tank", name:"Water Storage Tank", category:"Water Systems", w:90, h:130,
  pins:[ {id:"a",name:"Float Switch A",x:10,y:126},{id:"b",name:"Float Switch B",x:24,y:126} ],
  dynamic:"watertank",
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="20" width="78" height="96" rx="6" fill="#dfe7ea" opacity=".9"/>
    <rect x="6" y="20" width="78" height="96" rx="6" fill="none" stroke="#9fb0b6" stroke-width="2"/>
    <clipPath id="tankClip-${w}-${h}"><rect x="8" y="22" width="74" height="92" rx="5"/></clipPath>
    <g clip-path="url(#tankClip-${w}-${h})">
      <rect class="tank-water" x="8" y="88" width="74" height="8" fill="#2f9ee0" opacity=".8"/>
    </g>
    <rect x="6" y="20" width="78" height="96" rx="6" fill="none" stroke="#9fb0b6" stroke-width="2"/>
    <rect x="30" y="8" width="30" height="14" rx="2" fill="#9fb0b6"/>
    <circle cx="16" cy="118" r="5" fill="#333"/>
    <circle cx="30" cy="118" r="5" fill="#333"/>
    <text x="45" y="14" font-size="7" fill="#456" text-anchor="middle" font-family="monospace">TANK</text>
  `)
});

/* ---- DC Power Supply (bench supply for testing, dual fixed rails) ---- */
reg({
  id:"dc_power_supply", name:"DC Power Supply (Bench)", category:"Power", w:96, h:66,
  pins:[ {id:"v5",name:"+5V OUT",x:16,y:62},{id:"gnd",name:"GND",x:48,y:62},{id:"v12",name:"+12V OUT",x:80,y:62} ],
  art:(w,h)=> svg(w,h,`
    <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="4" fill="#3a3f47"/>
    <rect x="8" y="8" width="46" height="18" rx="2" fill="#0a2e1f"/>
    <text x="31" y="21" font-size="8" fill="#39ff88" text-anchor="middle" font-family="monospace">5.00V</text>
    <circle cx="68" cy="17" r="9" fill="#111" stroke="#555" stroke-width="1.5"/>
    <circle cx="86" cy="17" r="9" fill="#111" stroke="#555" stroke-width="1.5"/>
    <line x1="16" y1="52" x2="16" y2="62" stroke="#c0392b" stroke-width="2"/>
    <line x1="48" y1="52" x2="48" y2="62" stroke="#222" stroke-width="2"/>
    <line x1="80" y1="52" x2="80" y2="62" stroke="#e07a1e" stroke-width="2"/>
    <text x="${w/2}" y="42" font-size="7" fill="#ccc" text-anchor="middle" font-family="monospace">BENCH SUPPLY</text>
  `)
});

/* ---- Toggle Switch (SPST ON/OFF; click to flip and stay) ---- */
reg({
  id:"toggle_switch", name:"Switch (ON/OFF Toggle)", category:"Power", w:54, h:50,
  pins:[ {id:"a",name:"Terminal A",x:12,y:46},{id:"b",name:"Terminal B",x:42,y:46} ],
  dynamic:"toggleswitch",
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="16" width="42" height="24" rx="4" fill="#2b2b2b"/>
    <circle cx="18" cy="28" r="5" fill="#666"/>
    <circle cx="36" cy="28" r="5" fill="#666"/>
    <line class="switch-lever" x1="18" y1="28" x2="36" y2="18" stroke="#dcdcdc" stroke-width="4" stroke-linecap="round" style="transform-origin:18px 28px;"/>
    <line x1="12" y1="40" x2="12" y2="46" stroke="#c7cdd1" stroke-width="2"/>
    <line x1="42" y1="40" x2="42" y2="46" stroke="#c7cdd1" stroke-width="2"/>
  `)
});

/* ---- Water Level Probe (3-prong resistive probe) ---- */
reg({
  id:"water_level_probe", name:"Water Level Probe", category:"Sensors", w:60, h:58,
  pins:[ {id:"vcc",name:"VCC",x:14,y:54},{id:"gnd",name:"GND",x:30,y:54},{id:"sig",name:"Signal",x:46,y:54} ],
  art:(w,h)=> svg(w,h,`
    <rect x="6" y="6" width="48" height="20" rx="3" fill="#2f7d4f"/>
    <line x1="16" y1="26" x2="16" y2="48" stroke="#c7cdd1" stroke-width="2.4"/>
    <line x1="30" y1="26" x2="30" y2="44" stroke="#c7cdd1" stroke-width="2.4"/>
    <line x1="44" y1="26" x2="44" y2="52" stroke="#c7cdd1" stroke-width="2.4"/>
    <text x="30" y="18" font-size="6" fill="#dff" text-anchor="middle" font-family="monospace">LEVEL</text>
  `)
});

/* ---- Microphone Module (sound / clap detector) ---- */
reg({
  id:"mic_module", name:"Microphone Module", category:"Sensors", w:56, h:60,
  pins:[ {id:"gnd",name:"GND",x:14,y:56},{id:"vcc",name:"VCC",x:28,y:56},{id:"out",name:"OUT (digital)",x:42,y:56} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="20" width="48" height="26" rx="3" fill="#2f7d4f"/>
    <circle cx="28" cy="16" r="14" fill="#c7cdd1"/>
    <circle cx="28" cy="16" r="14" fill="none" stroke="#8a969b" stroke-width="1.5"/>
    ${Array.from({length:6}).map((_,i)=>`<circle cx="${28+7*Math.cos(i*Math.PI/3)}" cy="${16+7*Math.sin(i*Math.PI/3)}" r="1.3" fill="#666"/>`).join("")}
    <circle cx="42" cy="34" r="5" fill="#333"/>
  `)
});

/* ---- Rain Sensor Module (raindrop detection board) ---- */
reg({
  id:"rain_sensor", name:"Rain Sensor Module", category:"Sensors", w:80, h:70,
  pins:[ {id:"vcc",name:"VCC",x:18,y:66},{id:"gnd",name:"GND",x:34,y:66},{id:"do",name:"DO (digital)",x:50,y:66},{id:"ao",name:"AO (analog)",x:66,y:66} ],
  art:(w,h)=> svg(w,h,`
    <rect x="4" y="4" width="72" height="34" rx="2" fill="#8a5a2b"/>
    ${Array.from({length:6}).map((_,r)=>`<line x1="10" y1="${10+r*5}" x2="72" y2="${10+r*5}" stroke="#c98a4b" stroke-width="1.5"/>`).join("")}
    <rect x="16" y="42" width="48" height="20" rx="2" fill="#2f7d4f"/>
    <circle cx="26" cy="52" r="4" fill="#333"/>
  `)
});

/* Sorted list for palette: category then name (or numeric sortKey when present, e.g. resistor values) */
function getSortedLibrary() {
  return Object.values(LIB).sort((a,b)=>{
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.sortKey!==undefined && b.sortKey!==undefined) return a.sortKey - b.sortKey;
    return a.name.localeCompare(b.name);
  });
}

/* ============================================================
   APPLICATION STATE
   ============================================================ */
const state = {
  components: [],   // {id,type,x,y,rot,pinHigh:{},pressed:bool}
  wires: [],        // {id,a:{c,p},b:{c,p},color}
  zoom: 1,
  gridOn: true,
  simulate: false,
  selectedComponent: null,
  selectedWire: null,
  pendingPin: null, // {compId,pinId,el}
  wireColor: "#e2453f",
  nextCompN: 1,
  nextWireN: 1,
};

const WIRE_COLORS = ["#e2453f","#1c1c1c","#e8c11c","#2f9e44","#2f6fb0","#e07a1e"];

const els = {
  world: document.getElementById("world"),
  board: document.getElementById("board"),
  wireLayer: document.getElementById("wireLayer"),
  compLayer: document.getElementById("componentLayer"),
  palette: document.getElementById("paletteList"),
  search: document.getElementById("searchBox"),
  inspectorEmpty: document.getElementById("inspectorEmpty"),
  inspectorContent: document.getElementById("inspectorContent"),
  statCounts: document.getElementById("statCounts"),
  simStatus: document.getElementById("simStatus"),
  zoomLabel: document.getElementById("zoomLabel"),
  wireColorPicker: document.getElementById("wireColorPicker"),
  boardHint: document.getElementById("boardHint"),
};

/* ---------------- palette ---------------- */
function renderPalette(filter="") {
  const items = getSortedLibrary().filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
  let lastCat = null;
  let html = "";
  items.forEach(def=>{
    if (def.category !== lastCat) {
      html += `<div class="palette-category">${def.category}</div>`;
      lastCat = def.category;
    }
    html += `<div class="palette-item" draggable="true" data-type="${def.id}">
      <div class="thumb">${def.art(Math.min(def.w,40), Math.min(def.h,40))}</div>
      <div><span class="pname">${def.name}</span><span class="pcat">${def.pins.length} pins</span></div>
    </div>`;
  });
  els.palette.innerHTML = html || `<div class="palette-footnote">No matching parts.</div>`;
  els.palette.querySelectorAll(".palette-item").forEach(it=>{
    it.addEventListener("dragstart", e=>{
      e.dataTransfer.setData("text/plain", it.dataset.type);
    });
  });
}
renderPalette();
els.search.addEventListener("input", e=> renderPalette(e.target.value));

/* wire color swatches (status bar) */
(function(){
  els.wireColorPicker.innerHTML = WIRE_COLORS.map(c=>`<span class="swatch" data-c="${c}" style="background:${c}"></span>`).join("");
  function refresh(){ els.wireColorPicker.querySelectorAll(".swatch").forEach(s=> s.classList.toggle("active", s.dataset.c===state.wireColor)); }
  els.wireColorPicker.querySelectorAll(".swatch").forEach(s=> s.addEventListener("click", ()=>{ state.wireColor = s.dataset.c; refresh(); }));
  refresh();
})();

/* ---------------- drop to place ---------------- */
els.board.addEventListener("dragover", e=> e.preventDefault());
els.board.addEventListener("drop", e=>{
  e.preventDefault();
  const type = e.dataTransfer.getData("text/plain");
  const def = LIB[type];
  if (!def) return;
  const worldRect = els.world.getBoundingClientRect();
  const x = (e.clientX - worldRect.left)/state.zoom - def.w/2;
  const y = (e.clientY - worldRect.top)/state.zoom - def.h/2;
  addComponent(type, Math.max(0,x), Math.max(0,y));
});

function ensureInstanceDefaults(inst) {
  const def = LIB[inst.type];
  if (!inst.pinHigh) inst.pinHigh = {};
  if (inst.pressed === undefined) inst.pressed = false;
  if (def.dynamic === "arduino" && inst.code === undefined) {
    inst.code =
`// Simplified Arduino-style JavaScript.
// Define an async loop() function. Use digitalWrite("D13", HIGH or LOW)
// and "await delay(ms)" to pause. Turn on Simulate, then hit Run.
async function loop() {
  digitalWrite("D13", HIGH);
  await delay(500);
  digitalWrite("D13", LOW);
  await delay(500);
}
`;
  }
  if (inst.type === "battery_variable" && inst.voltage === undefined) inst.voltage = 5;
  if (def.dynamic === "raspberrypi" && inst.pycode === undefined) {
    inst.pycode =
`# Real Python, run in your browser via Pyodide.
# Uses a small RPi.GPIO-compatible shim — GPIO.output()/GPIO.input() drive
# the pins you've wired up. Bounded loops are safest (a "while True" with
# time.sleep will keep this tab busy for as long as it runs).
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)

for i in range(10):
    GPIO.output(17, GPIO.HIGH)
    time.sleep(0.3)
    GPIO.output(17, GPIO.LOW)
    time.sleep(0.3)

GPIO.cleanup()
`;
  }
}

function addComponent(type, x, y) {
  const def = LIB[type];
  const inst = { id:"c"+(state.nextCompN++), type, x, y, rot:0, pinHigh:{}, pressed:false };
  ensureInstanceDefaults(inst);
  state.components.push(inst);
  renderComponent(inst);
  hideHint();
  persist();
  return inst;
}

function hideHint(){ if(els.boardHint) els.boardHint.style.opacity="0"; }

/* ---------------- render a component ---------------- */
function renderComponent(inst) {
  const def = LIB[inst.type];
  const wrap = document.createElement("div");
  wrap.className = "comp";
  wrap.dataset.id = inst.id;
  wrap.style.left = inst.x+"px";
  wrap.style.top = inst.y+"px";
  wrap.style.width = def.w+"px";
  wrap.style.height = def.h+"px";

  const label = document.createElement("div");
  label.className = "comp-label";
  label.textContent = def.name;
  wrap.appendChild(label);

  const rotBtn = document.createElement("div");
  rotBtn.className = "comp-rotate-btn"; rotBtn.textContent = "⟳"; rotBtn.title="Rotate 90°";
  rotBtn.addEventListener("click", e=>{ e.stopPropagation(); inst.rot=(inst.rot+90)%360; body.style.transform=`rotate(${inst.rot}deg)`; requestAnimationFrame(redrawWires); persist(); });
  wrap.appendChild(rotBtn);

  const delBtn = document.createElement("div");
  delBtn.className = "comp-del-btn"; delBtn.textContent = "×"; delBtn.title="Delete";
  delBtn.addEventListener("click", e=>{ e.stopPropagation(); removeComponent(inst.id); });
  wrap.appendChild(delBtn);

  const body = document.createElement("div");
  body.className = "comp-body";
  body.style.width = def.w+"px";
  body.style.height = def.h+"px";
  body.style.transform = `rotate(${inst.rot}deg)`;
  body.innerHTML = def.art(def.w, def.h);
  if (inst.type === "battery_variable") {
    const vl = body.querySelector(".voltage-label");
    if (vl) vl.textContent = inst.voltage + "V";
  }
  if (def.dynamic === "watertank" && inst.pressed) {
    const water = body.querySelector(".tank-water");
    if (water) { water.setAttribute("height", "70"); water.setAttribute("y", "26"); }
  }
  if (def.dynamic === "button" && inst.pressed) {
    body.querySelector(".btn-cap-inner")?.setAttribute("fill", "#39ff88");
  }
  if (def.dynamic === "toggleswitch" && inst.pressed) {
    const lever = body.querySelector(".switch-lever");
    if (lever) { lever.style.transform = "rotate(22deg)"; lever.setAttribute("stroke", "#39ff88"); }
  }
  wrap.appendChild(body);

  def.pins.forEach(p=>{
    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.left = p.x+"px";
    pin.style.top = p.y+"px";
    pin.dataset.pin = p.id;
    const tip = document.createElement("div");
    tip.className = "pin-tooltip";
    tip.textContent = p.name;
    pin.appendChild(tip);
    pin.addEventListener("click", e=>{ e.stopPropagation(); onPinClick(inst, p, pin); });
    body.appendChild(pin);
  });

  // dragging
  let dragging=false, sx=0, sy=0, ox=0, oy=0, moved=false;
  wrap.addEventListener("mousedown", e=>{
    if (e.target.classList.contains("pin") || e.target.classList.contains("comp-rotate-btn") || e.target.classList.contains("comp-del-btn")) return;
    dragging=true; moved=false; wrap.classList.add("dragging");
    sx=e.clientX; sy=e.clientY; ox=inst.x; oy=inst.y;
    e.preventDefault();
  });
  window.addEventListener("mousemove", e=>{
    if (!dragging) return;
    const dx=(e.clientX-sx)/state.zoom, dy=(e.clientY-sy)/state.zoom;
    if (Math.abs(dx)>2||Math.abs(dy)>2) moved=true;
    inst.x = Math.max(0, ox+dx); inst.y = Math.max(0, oy+dy);
    wrap.style.left = inst.x+"px"; wrap.style.top = inst.y+"px";
    redrawWires();
  });
  window.addEventListener("mouseup", ()=>{
    if (dragging) { dragging=false; wrap.classList.remove("dragging"); persist(); if(!moved) selectComponent(inst.id); }
  });

  // dynamic click behaviors (button press, etc.) on the body itself
  body.addEventListener("click", e=>{
    if (e.target.classList.contains("pin")) return;
    if (def.dynamic==="button") {
      inst.pressed = !inst.pressed;
      body.querySelector(".btn-cap-inner")?.setAttribute("fill", inst.pressed ? "#39ff88" : "#555");
      evaluateCircuit();
      persist();
    }
    if (def.dynamic==="watertank") {
      inst.pressed = !inst.pressed;
      const water = body.querySelector(".tank-water");
      if (water) water.setAttribute("height", inst.pressed ? "70" : "8");
      if (water) water.setAttribute("y", inst.pressed ? "26" : "88");
      evaluateCircuit();
      persist();
    }
    if (def.dynamic==="toggleswitch") {
      inst.pressed = !inst.pressed;
      const lever = body.querySelector(".switch-lever");
      if (lever) lever.style.transform = inst.pressed ? "rotate(22deg)" : "rotate(0deg)";
      if (lever) lever.setAttribute("stroke", inst.pressed ? "#39ff88" : "#dcdcdc");
      evaluateCircuit();
      persist();
    }
  });

  els.compLayer.appendChild(wrap);
}

function removeComponent(id) {
  stopLoop(id);
  stopPyRunner(id);
  stopBuzzerSound(id);
  state.components = state.components.filter(c=>c.id!==id);
  state.wires = state.wires.filter(w=> w.a.c!==id && w.b.c!==id);
  document.querySelector(`.comp[data-id="${id}"]`)?.remove();
  if (state.selectedComponent===id) selectComponent(null);
  redrawWires();
  evaluateCircuit();
  persist();
}

/* ---------------- selection ---------------- */
function selectComponent(id) {
  state.selectedComponent = id;
  state.selectedWire = null;
  document.querySelectorAll(".comp").forEach(el=> el.classList.toggle("selected", el.dataset.id===id));
  renderInspectorForComponent(id);
  redrawWires();
}

function renderInspectorForComponent(id) {
  if (!id) { showEmptyInspector(); return; }
  const inst = state.components.find(c=>c.id===id);
  if (!inst) { showEmptyInspector(); return; }
  const def = LIB[inst.type];
  ensureInstanceDefaults(inst);
  els.inspectorEmpty.hidden = true;
  els.inspectorContent.hidden = false;
  const connectedSet = new Set();
  state.wires.forEach(w=>{
    if (w.a.c===id) connectedSet.add(w.a.p);
    if (w.b.c===id) connectedSet.add(w.b.p);
  });

  let extra = "";
  if (inst.type === "battery_variable") {
    extra += `
      <h4>Output voltage</h4>
      <div class="inspector-field">
        <input type="range" id="voltageSlider" min="1.5" max="12" step="0.5" value="${inst.voltage}" style="width:100%">
        <div id="voltageReadout" style="text-align:center;font-family:var(--font-mono);color:var(--accent-power);margin-top:4px;">${inst.voltage}V</div>
      </div>`;
  }
  if (def.dynamic === "arduino") {
    const isRunning = !!runners[id];
    extra += `
      <h4>Sketch (simplified JS)</h4>
      <p style="margin-top:-4px;">Define an <code>async function loop()</code>. Call <code>digitalWrite("D13", HIGH/LOW)</code> and <code>await delay(ms)</code>. Turn on Simulate, then hit Run.</p>
      <textarea id="codeEditor" spellcheck="false" style="width:100%;min-height:150px;background:var(--bg-deepest);color:var(--silkscreen);font-family:var(--font-mono);font-size:11.5px;border:1px solid var(--pcb-green-light);border-radius:6px;padding:8px;">${inst.code}</textarea>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn btn-power ${isRunning ? 'active':''}" id="runCodeBtn" style="flex:1;justify-content:center;">▶ Run</button>
        <button class="btn btn-ghost" id="stopCodeBtn" style="flex:1;justify-content:center;">■ Stop</button>
      </div>
      <p style="font-size:10.5px;">${isRunning ? "Running…" : "Not running"}</p>`;
  }
  if (def.dynamic === "raspberrypi") {
    const isRunning = !!pyRunners[id];
    extra += `
      <h4>Python script</h4>
      <p style="margin-top:-4px;">Real Python via Pyodide, with a tiny <code>RPi.GPIO</code> shim wired to this board's pins. First run downloads the Python runtime (~10MB) — needs internet. Prefer bounded loops (<code>for</code> not <code>while True</code>) since <code>time.sleep</code> pauses the tab.</p>
      <textarea id="pyEditor" spellcheck="false" style="width:100%;min-height:180px;background:var(--bg-deepest);color:var(--silkscreen);font-family:var(--font-mono);font-size:11.5px;border:1px solid var(--pcb-green-light);border-radius:6px;padding:8px;">${inst.pycode}</textarea>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn btn-power ${isRunning ? 'active':''}" id="runPyBtn" style="flex:1;justify-content:center;">▶ Run</button>
        <button class="btn btn-ghost" id="stopPyBtn" style="flex:1;justify-content:center;">■ Stop</button>
      </div>
      <p style="font-size:10.5px;">${isRunning ? "Running…" : "Not running"}</p>`;
  }

  els.inspectorContent.innerHTML = `
    <h3>${def.name}</h3>
    <p>${def.pins.length} pins · category: ${def.category}</p>
    <h4>Pinout</h4>
    <div>${def.pins.map(p=>`
      <div class="pin-row ${connectedSet.has(p.id)?'connected':'unconnected'}">
        <span class="pn">${p.name}</span>
        <span class="pd">${connectedSet.has(p.id)?'connected':'free'}</span>
      </div>`).join("")}
    </div>
    ${extra}
    <button class="inspector-danger" id="delSelectedComp">Delete this component</button>
  `;
  document.getElementById("delSelectedComp").addEventListener("click", ()=> removeComponent(id));

  if (inst.type === "battery_variable") {
    const slider = document.getElementById("voltageSlider");
    const readout = document.getElementById("voltageReadout");
    slider.addEventListener("input", ()=>{
      inst.voltage = parseFloat(slider.value);
      readout.textContent = inst.voltage + "V";
      const label = document.querySelector(`.comp[data-id="${id}"] .voltage-label`);
      if (label) label.textContent = inst.voltage + "V";
      persist();
    });
  }
  if (def.dynamic === "arduino") {
    const editor = document.getElementById("codeEditor");
    editor.addEventListener("input", ()=>{ inst.code = editor.value; persist(); });
    document.getElementById("runCodeBtn").addEventListener("click", ()=>{
      inst.code = editor.value; persist(); runArduinoCode(id); renderInspectorForComponent(id);
    });
    document.getElementById("stopCodeBtn").addEventListener("click", ()=>{
      stopLoop(id); flashStatus("Code stopped"); renderInspectorForComponent(id);
    });
  }
  if (def.dynamic === "raspberrypi") {
    const editor = document.getElementById("pyEditor");
    editor.addEventListener("input", ()=>{ inst.pycode = editor.value; persist(); });
    document.getElementById("runPyBtn").addEventListener("click", ()=>{
      inst.pycode = editor.value; persist();
      renderInspectorForComponent(id);
      runRaspberryPiCode(id).then(()=> renderInspectorForComponent(id));
    });
    document.getElementById("stopPyBtn").addEventListener("click", ()=>{
      stopPyRunner(id); flashStatus("Python script stopped"); renderInspectorForComponent(id);
    });
  }
}

function showEmptyInspector() {
  els.inspectorEmpty.hidden = false;
  els.inspectorContent.hidden = true;
}

/* ---------------- pin click -> wiring ---------------- */
function onPinClick(inst, pinDef, pinEl) {
  const def = LIB[inst.type];

  // simulate-mode toggling of arduino digital pins
  if (state.simulate && def.dynamic==="arduino" && /^D/.test(pinDef.name.replace("~",""))) {
    inst.pinHigh[pinDef.id] = !inst.pinHigh[pinDef.id];
    evaluateCircuit();
    persist();
    return;
  }

  if (!state.pendingPin) {
    state.pendingPin = {compId:inst.id, pinId:pinDef.id, el:pinEl};
    pinEl.classList.add("selected-pin");
    return;
  }
  if (state.pendingPin.compId===inst.id && state.pendingPin.pinId===pinDef.id) {
    pinEl.classList.remove("selected-pin");
    state.pendingPin = null;
    return;
  }
  const wire = { id:"w"+(state.nextWireN++), a:{c:state.pendingPin.compId,p:state.pendingPin.pinId}, b:{c:inst.id,p:pinDef.id}, color: state.wireColor };
  state.wires.push(wire);
  state.pendingPin.el.classList.remove("selected-pin");
  state.pendingPin = null;
  hideHint();
  redrawWires();
  evaluateCircuit();
  if (state.selectedComponent) renderInspectorForComponent(state.selectedComponent);
  persist();
}

/* ---------------- geometry / wire drawing ---------------- */
function findPinEl(compId, pinId) {
  const comp = document.querySelector(`.comp[data-id="${compId}"]`);
  if (!comp) return null;
  return comp.querySelector(`.pin[data-pin="${pinId}"]`);
}

function pinLocalCenter(compId, pinId) {
  const el = findPinEl(compId, pinId);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const wr = els.world.getBoundingClientRect();
  return { x:(r.left + r.width/2 - wr.left)/state.zoom, y:(r.top + r.height/2 - wr.top)/state.zoom };
}

function redrawWires() {
  let html = "";
  state.wires.forEach(w=>{
    const p1 = pinLocalCenter(w.a.c, w.a.p);
    const p2 = pinLocalCenter(w.b.c, w.b.p);
    if (!p1||!p2) return;
    const dx = (p2.x - p1.x) * 0.5;
    const d = `M ${p1.x} ${p1.y} C ${p1.x+dx} ${p1.y}, ${p2.x-dx} ${p2.y}, ${p2.x} ${p2.y}`;
    const active = w._active ? "active" : "";
    const selected = state.selectedWire===w.id ? "selected" : "";
    html += `<path class="wire-hit" data-id="${w.id}" d="${d}"></path>`;
    html += `<path class="wire-path ${active} ${selected}" data-id="${w.id}" d="${d}" stroke="${w.color}" stroke-width="3" style="color:${w.color}"></path>`;
  });
  els.wireLayer.innerHTML = html;
  els.wireLayer.querySelectorAll(".wire-hit").forEach(p=>{
    p.style.pointerEvents = "stroke";
    p.addEventListener("click", ()=> selectWire(p.dataset.id));
  });
  updateStats();
}

function selectWire(id) {
  state.selectedWire = id;
  state.selectedComponent = null;
  document.querySelectorAll(".comp").forEach(el=> el.classList.remove("selected"));
  const wire = state.wires.find(w=>w.id===id);
  els.inspectorEmpty.hidden = true;
  els.inspectorContent.hidden = false;
  els.inspectorContent.innerHTML = `
    <h3>Wire</h3>
    <p>Connects ${describePin(wire.a)} to ${describePin(wire.b)}</p>
    <div class="inspector-field"><label>Color</label>
      <div class="color-swatches">${WIRE_COLORS.map(c=>`<span class="swatch ${wire.color===c?'active':''}" data-c="${c}" style="background:${c}"></span>`).join("")}</div>
    </div>
    <button class="inspector-danger" id="delSelectedWire">Delete this wire</button>
  `;
  els.inspectorContent.querySelectorAll(".swatch").forEach(s=> s.addEventListener("click", ()=>{
    wire.color = s.dataset.c; redrawWires(); selectWire(id); persist();
  }));
  document.getElementById("delSelectedWire").addEventListener("click", ()=>{
    state.wires = state.wires.filter(w=>w.id!==id);
    state.selectedWire = null;
    redrawWires(); evaluateCircuit(); showEmptyInspector(); persist();
  });
  redrawWires();
}

function describePin(ref) {
  const inst = state.components.find(c=>c.id===ref.c);
  if (!inst) return "?";
  const def = LIB[inst.type];
  const p = def.pins.find(p=>p.id===ref.p);
  return `${def.name} · ${p?p.name:ref.p}`;
}

/* click empty board = deselect */
els.board.addEventListener("mousedown", e=>{
  if (e.target===els.board || e.target===els.world) {
    if (state.pendingPin) { state.pendingPin.el.classList.remove("selected-pin"); state.pendingPin=null; }
    selectComponent(null); state.selectedWire=null; showEmptyInspector(); redrawWires();
  }
});

/* delete key */
window.addEventListener("keydown", e=>{
  if (e.key==="Delete" || e.key==="Backspace") {
    if (document.activeElement===els.search) return;
    if (state.selectedComponent) { removeComponent(state.selectedComponent); e.preventDefault(); }
    else if (state.selectedWire) {
      state.wires = state.wires.filter(w=>w.id!==state.selectedWire);
      state.selectedWire = null; redrawWires(); evaluateCircuit(); showEmptyInspector(); persist();
      e.preventDefault();
    }
  }
});

/* ---------------- stats ---------------- */
function updateStats() {
  els.statCounts.textContent = `${state.components.length} components · ${state.wires.length} wires`;
}

/* ============================================================
   SIMULATION ENGINE (union-find over pin nodes)
   ============================================================ */
class DSU {
  constructor(){ this.p = {}; }
  find(x){ if(!(x in this.p)) this.p[x]=x; while(this.p[x]!==x){ this.p[x]=this.p[this.p[x]]; x=this.p[x]; } return x; }
  union(a,b){ const ra=this.find(a), rb=this.find(b); if(ra!==rb) this.p[ra]=rb; }
}

function evaluateCircuit() {
  const dsu = new DSU();
  const nodeKey = (c,p)=> c+"::"+p;

  // wires
  state.wires.forEach(w=> dsu.union(nodeKey(w.a.c,w.a.p), nodeKey(w.b.c,w.b.p)));

  // internal component connectivity
  const highSources = new Set();
  const gndRefs = new Set();

  state.components.forEach(inst=>{
    const def = LIB[inst.type];
    (def.busGroups||[]).forEach(group=>{
      for (let i=1;i<group.length;i++) dsu.union(nodeKey(inst.id,group[0]), nodeKey(inst.id,group[i]));
    });
    (def.passThrough||[]).forEach(([a,b])=> dsu.union(nodeKey(inst.id,a), nodeKey(inst.id,b)));

    if (def.dynamic==="button" && inst.pressed) {
      // pressing shorts the two independent leg-pairs together
      const groups = def.busGroups;
      if (groups && groups.length===2) dsu.union(nodeKey(inst.id,groups[0][0]), nodeKey(inst.id,groups[1][0]));
    }

    if (def.dynamic==="watertank" && inst.pressed) {
      // "full" closes the built-in float switch between its two pins
      dsu.union(nodeKey(inst.id,"a"), nodeKey(inst.id,"b"));
    }

    if (def.dynamic==="toggleswitch" && inst.pressed) {
      // flipped ON closes the two terminals
      dsu.union(nodeKey(inst.id,"a"), nodeKey(inst.id,"b"));
    }

    if (!state.simulate) return;

    if (def.dynamic==="arduino") {
      def.pins.forEach(p=>{
        if (p.name==="GND") gndRefs.add(nodeKey(inst.id,p.id));
        if (p.name==="5V" || p.name==="3V3" || p.name==="VIN") highSources.add(nodeKey(inst.id,p.id));
        if (/^D/.test(p.name.replace("~","")) && inst.pinHigh[p.id]) highSources.add(nodeKey(inst.id,p.id));
      });
    }
    if (def.dynamic==="raspberrypi") {
      def.pins.forEach(p=>{
        if (p.name==="GND") gndRefs.add(nodeKey(inst.id,p.id));
        if (p.name==="5V" || p.name==="3V3") highSources.add(nodeKey(inst.id,p.id));
        if (/^GPIO/.test(p.name) && inst.pinHigh[p.id]) highSources.add(nodeKey(inst.id,p.id));
      });
    }
    if (inst.type==="battery9v" || inst.type==="battery_variable" || inst.type==="barrel_jack") {
      highSources.add(nodeKey(inst.id,"pos"));
      gndRefs.add(nodeKey(inst.id,"neg"));
    }
    if (inst.type==="dc_power_supply") {
      highSources.add(nodeKey(inst.id,"v5"));
      highSources.add(nodeKey(inst.id,"v12"));
      gndRefs.add(nodeKey(inst.id,"gnd"));
    }
  });

  function computeRoots() {
    return {
      high: new Set(Array.from(highSources).map(n=>dsu.find(n))),
      gnd: new Set(Array.from(gndRefs).map(n=>dsu.find(n)))
    };
  }
  let roots = computeRoots();

  // Transistors (BJT/MOSFET) act as a switch: driving the control pin (base/gate)
  // HIGH closes the collector-emitter / drain-source path. Voltage regulators pass
  // a HIGH source from VIN to VOUT once powered. Both are resolved iteratively
  // since one component's output can feed the next component's input.
  if (state.simulate) {
    for (let pass=0; pass<3; pass++) {
      let changed = false;
      state.components.forEach(inst=>{
        const def = LIB[inst.type];
        if (def.switchPins) {
          const { control, a, b, activeLow } = def.switchPins;
          const controlRoot = dsu.find(nodeKey(inst.id, control));
          const trigger = activeLow ? roots.gnd.has(controlRoot) : roots.high.has(controlRoot);
          if (trigger) {
            const ra=dsu.find(nodeKey(inst.id,a)), rb=dsu.find(nodeKey(inst.id,b));
            if (ra!==rb) { dsu.union(ra,rb); changed = true; }
          }
        }
        if (def.regulator) {
          const { vin, out } = def.regulator;
          const inputHigh = roots.high.has(dsu.find(nodeKey(inst.id, vin)));
          const key = nodeKey(inst.id, out);
          if (inputHigh && !highSources.has(key)) { highSources.add(key); changed = true; }
        }
        (def.regulators||[]).forEach(({vin,out})=>{
          const inputHigh = roots.high.has(dsu.find(nodeKey(inst.id, vin)));
          const key = nodeKey(inst.id, out);
          if (inputHigh && !highSources.has(key)) { highSources.add(key); changed = true; }
        });
        (def.gndPass||[]).forEach(({vin,out})=>{
          const inputGnd = roots.gnd.has(dsu.find(nodeKey(inst.id, vin)));
          const key = nodeKey(inst.id, out);
          if (inputGnd && !gndRefs.has(key)) { gndRefs.add(key); changed = true; }
        });
      });
      if (!changed) break;
      roots = computeRoots();
    }
  }

  const highRoots = roots.high;
  const gndRoots = roots.gnd;

  function isHigh(c,p){ return state.simulate && highRoots.has(dsu.find(nodeKey(c,p))); }
  function isGnd(c,p){ return state.simulate && gndRoots.has(dsu.find(nodeKey(c,p))); }

  // per-component visual feedback
  state.components.forEach(inst=>{
    const def = LIB[inst.type];
    const el = document.querySelector(`.comp[data-id="${inst.id}"] .comp-body`);
    if (!el) return;

    if (def.dynamic==="led") {
      const on = isHigh(inst.id,"anode") && isGnd(inst.id,"cathode");
      const dome = el.querySelector(".led-dome");
      if (dome) dome.style.filter = on ? "drop-shadow(0 0 9px #ff4242) brightness(1.6)" : "none";
    }
    if (def.dynamic==="buzzer") {
      const on = isHigh(inst.id,"vcc") && isGnd(inst.id,"gnd");
      const body = el.querySelector(".buzzer-body");
      if (body) body.style.animation = on ? "buzz .12s infinite" : "none";
      if (on) startBuzzerSound(inst.id); else stopBuzzerSound(inst.id);
    }
    if (def.dynamic==="motor") {
      const on = (isHigh(inst.id,"t1")&&isGnd(inst.id,"t2")) || (isHigh(inst.id,"t2")&&isGnd(inst.id,"t1"));
      const shaft = el.querySelector(".motor-shaft");
      if (shaft) shaft.style.animation = on ? "spin 0.6s linear infinite" : "none";
      shaft && (shaft.style.transformOrigin = "30px 30px");
    }
    if (def.dynamic==="servo") {
      const on = isHigh(inst.id,"vcc") && isGnd(inst.id,"gnd");
      const arm = el.querySelector(".servo-arm");
      if (arm) arm.style.animation = on ? "sweep 1.4s ease-in-out infinite" : "none";
    }
    if (def.dynamic==="relay") {
      const on = isHigh(inst.id,"vcc") && isGnd(inst.id,"gnd") && isHigh(inst.id,"in");
      const coil = el.querySelector(".relay-coil");
      if (coil) coil.setAttribute("fill", on ? "#39ff88" : "#2b6cb0");
      if (on) dsu.union(nodeKey(inst.id,"com"), nodeKey(inst.id,"no"));
    }
    if (def.dynamic==="lcd") {
      const on = isHigh(inst.id,"vcc") && isGnd(inst.id,"gnd");
      const scr = el.querySelector(".lcd-screen");
      const txt = el.querySelector(".lcd-text");
      if (scr) scr.setAttribute("fill", on ? "#0f5132" : "#123e2b");
      if (txt) txt.style.opacity = on ? "1" : "0.15";
    }
    if (def.dynamic==="sevenseg") {
      const commonGnd = isGnd(inst.id,"com");
      ["a","b","c","d","e","f","g","dp"].forEach(s=>{
        const on = commonGnd && isHigh(inst.id, s);
        const segEl = el.querySelector(".seg-"+s);
        if (segEl) {
          segEl.setAttribute("fill", on ? "#ff2b2b" : "#4a1414");
          segEl.style.filter = on ? "drop-shadow(0 0 4px #ff2b2b)" : "none";
        }
      });
    }
    if (def.dynamic==="oled") {
      const on = isHigh(inst.id,"vcc") && isGnd(inst.id,"gnd");
      const scr = el.querySelector(".oled-screen");
      const txt = el.querySelector(".oled-text");
      if (scr) scr.setAttribute("fill", on ? "#001827" : "#001018");
      if (txt) txt.style.opacity = on ? "1" : "0.08";
    }
    if (def.dynamic==="solenoid") {
      const on = (isHigh(inst.id,"pos")&&isGnd(inst.id,"neg")) || (isHigh(inst.id,"neg")&&isGnd(inst.id,"pos"));
      const plunger = el.querySelector(".solenoid-plunger");
      if (plunger) plunger.style.animation = on ? "solenoidPulse .5s ease-in-out infinite alternate" : "none";
    }
    if (def.dynamic==="transistor_switch") {
      const { control, activeLow } = def.switchPins;
      const on = activeLow ? isGnd(inst.id, control) : isHigh(inst.id, control);
      el.style.filter = on ? "drop-shadow(0 0 8px #39ff88)" : "none";
    }
    if (def.dynamic==="raspberrypi") {
      const powered = def.pins.some(p => p.name==="5V" && isHigh(inst.id,p.id));
      el.style.filter = powered ? "drop-shadow(0 0 6px #39ff88)" : "none";
    }
  });

  // wire active glow: a wire is "active" if either end is high or gnd-connected and simulate is on
  state.wires.forEach(w=>{
    w._active = state.simulate && (isHigh(w.a.c,w.a.p)||isGnd(w.a.c,w.a.p)||isHigh(w.b.c,w.b.p)||isGnd(w.b.c,w.b.p));
  });
  redrawWires();
}

/* ============================================================
   BUZZER SOUND (Web Audio API)
   ============================================================ */
let audioCtx = null;
function getAudioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
const activeBuzzers = {};
function startBuzzerSound(id) {
  if (activeBuzzers[id]) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 2200;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  activeBuzzers[id] = { osc, gain };
}
function stopBuzzerSound(id) {
  const b = activeBuzzers[id];
  if (!b) return;
  try {
    b.gain.gain.setTargetAtTime(0, b.osc.context.currentTime, 0.01);
    b.osc.stop(b.osc.context.currentTime + 0.05);
  } catch (e) { /* already stopped */ }
  delete activeBuzzers[id];
}
function stopAllBuzzers() { Object.keys(activeBuzzers).forEach(stopBuzzerSound); }

/* ============================================================
   ARDUINO CODE RUNNER (simplified Arduino-style JS sketches)
   ============================================================ */
const runners = {};

function pinIdFromName(def, name) {
  const clean = String(name).trim().toLowerCase();
  let p = def.pins.find(p => p.name.toLowerCase() === clean);
  if (!p) p = def.pins.find(p => p.name.replace("~", "").toLowerCase() === clean);
  if (!p) p = def.pins.find(p => p.name.toLowerCase().startsWith(clean));
  return p ? p.id : null;
}

function stopLoop(id) {
  if (runners[id]) { runners[id].running = false; delete runners[id]; }
}
function stopAllLoops() { Object.keys(runners).forEach(stopLoop); }

function runArduinoCode(id) {
  if (!state.simulate) { alert("Turn on Simulate first, then run the code."); return; }
  const inst = state.components.find(c => c.id === id);
  if (!inst) return;
  stopLoop(id);
  const def = LIB[inst.type];
  const runner = { running: true };
  runners[id] = runner;
  const HIGH = true, LOW = false;

  function digitalWrite(name, val) {
    const pid = pinIdFromName(def, name);
    if (!pid) { console.warn("CircuitLab sketch: unknown pin", name); return; }
    inst.pinHigh[pid] = !!val;
    evaluateCircuit();
  }
  function digitalRead(name) {
    const pid = pinIdFromName(def, name);
    return pid ? !!inst.pinHigh[pid] : false;
  }
  function delay(ms) {
    return new Promise(res => setTimeout(res, Math.max(0, Math.min(Number(ms) || 0, 4000))));
  }

  let loopFn;
  try {
    const factory = new Function(
      "digitalWrite", "digitalRead", "delay", "HIGH", "LOW",
      inst.code + "\nreturn (typeof loop === 'function') ? loop : null;"
    );
    loopFn = factory(digitalWrite, digitalRead, delay, HIGH, LOW);
  } catch (e) {
    alert("Code error: " + e.message);
    runner.running = false;
    return;
  }
  if (typeof loopFn !== "function") {
    alert('Define an async function called "loop()" in your code.');
    runner.running = false;
    return;
  }

  (async () => {
    while (runner.running) {
      try {
        await loopFn();
      } catch (e) {
        console.error("Arduino sketch error:", e);
        flashStatus("Code error — see browser console");
        runner.running = false;
        break;
      }
      await new Promise(r => setTimeout(r, 0));
    }
  })();
  flashStatus("Code running on " + def.name);
}

/* ============================================================
   RASPBERRY PI PYTHON RUNNER (real Python via Pyodide, in-browser)
   ============================================================ */
const pyRunners = {};
let pyodidePromise = null;

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
      s.onload = () => {
        window.loadPyodide().then(resolve).catch(reject);
      };
      s.onerror = () => reject(new Error("Couldn't load the Pyodide script from the CDN."));
      document.head.appendChild(s);
    });
  }
  return pyodidePromise;
}

const PY_GPIO_SHIM = `
import sys, types
_rpi = types.ModuleType("RPi")
_gpio = types.ModuleType("RPi.GPIO")
_gpio.BCM = "BCM"; _gpio.BOARD = "BOARD"
_gpio.OUT = "OUT"; _gpio.IN = "IN"
_gpio.HIGH = 1; _gpio.LOW = 0
def _setmode(mode): pass
def _setup(pin, mode, initial=None):
    if initial is not None:
        from js import __cl_gpio_write
        __cl_gpio_write(pin, bool(initial))
def _output(pin, value):
    from js import __cl_gpio_write
    __cl_gpio_write(pin, bool(value))
def _input(pin):
    from js import __cl_gpio_read
    return 1 if __cl_gpio_read(pin) else 0
def _cleanup(*a, **k): pass
class _PWM:
    def __init__(self, pin, freq): self.pin = pin
    def start(self, dc): pass
    def ChangeDutyCycle(self, dc): pass
    def ChangeFrequency(self, f): pass
    def stop(self): pass
def _pwm_factory(pin, freq): return _PWM(pin, freq)
_gpio.setmode = _setmode
_gpio.setup = _setup
_gpio.output = _output
_gpio.input = _input
_gpio.cleanup = _cleanup
_gpio.PWM = _pwm_factory
_rpi.GPIO = _gpio
sys.modules["RPi"] = _rpi
sys.modules["RPi.GPIO"] = _gpio

import time as _time
_orig_sleep = _time.sleep
def _patched_sleep(seconds):
    from js import __cl_should_stop
    if __cl_should_stop():
        raise SystemExit()
    _orig_sleep(seconds)
_time.sleep = _patched_sleep
`;

function stopPyRunner(id) {
  if (pyRunners[id]) pyRunners[id].stopped = true;
}
function stopAllPyRunners() { Object.keys(pyRunners).forEach(stopPyRunner); }

async function runRaspberryPiCode(id) {
  if (!state.simulate) { alert("Turn on Simulate first, then run the script."); return; }
  const inst = state.components.find(c => c.id === id);
  if (!inst) return;
  const def = LIB[inst.type];
  stopPyRunner(id);
  const runner = { stopped: false };
  pyRunners[id] = runner;

  let pyodide;
  try {
    flashStatus("Loading Python runtime… (first run only)");
    pyodide = await getPyodide();
  } catch (e) {
    alert("Couldn't load the Python runtime. Check your internet connection.");
    delete pyRunners[id];
    return;
  }
  if (runner.stopped) { delete pyRunners[id]; return; }

  function gpioNameFor(pin) {
    return pinIdFromName(def, "GPIO" + pin) || pinIdFromName(def, String(pin));
  }
  pyodide.globals.set("__cl_gpio_write", (pin, val) => {
    const pid = gpioNameFor(pin);
    if (!pid) { console.warn("CircuitLab script: unknown GPIO pin", pin); return; }
    inst.pinHigh[pid] = !!val;
    evaluateCircuit();
  });
  pyodide.globals.set("__cl_gpio_read", (pin) => {
    const pid = gpioNameFor(pin);
    return pid ? !!inst.pinHigh[pid] : false;
  });
  pyodide.globals.set("__cl_should_stop", () => runner.stopped);

  flashStatus("Running Python on " + def.name);
  try {
    await pyodide.runPythonAsync(PY_GPIO_SHIM);
    await pyodide.runPythonAsync(inst.pycode);
    if (!runner.stopped) flashStatus("Python script finished");
  } catch (e) {
    if (!runner.stopped) {
      console.error("Raspberry Pi script error:", e);
      flashStatus("Python error — see browser console");
    }
  }
  delete pyRunners[id];
}

/* keyframes injected once */
(function(){
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes buzz{0%{transform:translate(0,0)}25%{transform:translate(1px,0)}75%{transform:translate(-1px,0)}100%{transform:translate(0,0)}}
    @keyframes sweep{0%{transform:rotate(-30deg)}50%{transform:rotate(30deg)}100%{transform:rotate(-30deg)}}
    @keyframes solenoidPulse{from{transform:translateX(0)}to{transform:translateX(-8px)}}
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   TOP BAR CONTROLS
   ============================================================ */
document.getElementById("btnSimulate").addEventListener("click", (e)=>{
  state.simulate = !state.simulate;
  e.currentTarget.classList.toggle("active", state.simulate);
  if (state.simulate) {
    getAudioCtx();
  } else {
    stopAllLoops();
    stopAllPyRunners();
    stopAllBuzzers();
  }
  els.simStatus.textContent = state.simulate ? "Simulation running — click Arduino digital pins or buttons to toggle them" : "Simulation off";
  els.simStatus.classList.toggle("on", state.simulate);
  evaluateCircuit();
  if (state.selectedComponent) renderInspectorForComponent(state.selectedComponent);
});

document.getElementById("btnGrid").addEventListener("click", ()=>{
  state.gridOn = !state.gridOn;
  els.world.classList.toggle("no-grid", !state.gridOn);
});

document.getElementById("btnZoomIn").addEventListener("click", ()=> setZoom(state.zoom+0.1));
document.getElementById("btnZoomOut").addEventListener("click", ()=> setZoom(state.zoom-0.1));
function setZoom(z) {
  state.zoom = Math.min(1.6, Math.max(0.5, z));
  els.world.style.transform = `scale(${state.zoom})`;
  els.zoomLabel.textContent = Math.round(state.zoom*100)+"%";
  redrawWires();
}

document.getElementById("btnUndo").addEventListener("click", ()=>{
  if (state.wires.length) { state.wires.pop(); redrawWires(); evaluateCircuit(); persist(); }
  else if (state.components.length) { removeComponent(state.components[state.components.length-1].id); }
});

document.getElementById("btnNew").addEventListener("click", ()=>{
  if (!confirm("Clear the entire board? This can't be undone.")) return;
  stopAllLoops(); stopAllPyRunners(); stopAllBuzzers();
  state.components = []; state.wires = []; state.selectedComponent=null; state.selectedWire=null;
  els.compLayer.innerHTML=""; els.wireLayer.innerHTML="";
  showEmptyInspector(); updateStats(); persist();
  els.boardHint.style.opacity = "1";
});

document.getElementById("btnSave").addEventListener("click", ()=>{ persist(); flashStatus("Saved to browser storage ✓"); });

document.getElementById("btnExport").addEventListener("click", ()=>{
  const data = JSON.stringify({components:state.components, wires:state.wires}, null, 2);
  const blob = new Blob([data], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "circuitlab-project.json";
  a.click();
});

document.getElementById("btnImport").addEventListener("click", ()=> document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try {
      const data = JSON.parse(reader.result);
      loadState(data);
    } catch(err){ alert("Couldn't read that file — is it a CircuitLab JSON export?"); }
  };
  reader.readAsText(file);
  e.target.value = "";
});

function flashStatus(msg) {
  const old = els.simStatus.textContent;
  els.simStatus.textContent = msg;
  setTimeout(()=>{ els.simStatus.textContent = state.simulate ? "Simulation running — click Arduino digital pins or buttons to toggle them" : "Simulation off"; }, 1600);
}

/* ---------------- persistence ---------------- */
function persist() {
  localStorage.setItem("circuitlab_state", JSON.stringify({components:state.components, wires:state.wires}));
}

function loadState(data) {
  state.components = data.components||[];
  state.wires = data.wires||[];
  state.nextCompN = state.components.reduce((m,c)=>Math.max(m, parseInt(c.id.slice(1))||0), 0)+1;
  state.nextWireN = state.wires.reduce((m,w)=>Math.max(m, parseInt(w.id.slice(1))||0), 0)+1;
  els.compLayer.innerHTML = "";
  state.components.forEach(inst=>{
    ensureInstanceDefaults(inst);
    renderComponent(inst);
    const body = document.querySelector(`.comp[data-id="${inst.id}"] .comp-body`);
    if (body) body.style.transform = `rotate(${inst.rot||0}deg)`;
  });
  if (state.components.length) hideHint();
  requestAnimationFrame(()=>{ redrawWires(); evaluateCircuit(); });
  persist();
}

/* load on start */
(function init(){
  const saved = localStorage.getItem("circuitlab_state");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.components && data.components.length) loadState(data);
    } catch(e){ /* ignore corrupt save */ }
  }
  updateStats();
})();
