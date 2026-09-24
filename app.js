const STORAGE = "car-ai-course-v1";

const state = {
  route: "home",
  moduleId: null,
  data: loadState()
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE)) || { fields: {}, done: {} };
  } catch {
    return { fields: {}, done: {} };
  }
}
function saveState() {
  localStorage.setItem(STORAGE, JSON.stringify(state.data));
  renderProgress();
  markNavDone();
}

const modules = [
  {
    id: 1,
    day: "วันที่ 1 เช้า",
    title: "ปลดล็อกวิจัยชั้นเรียนและตั้งโจทย์",
    goal: "ครูเลิกมองว่าวิจัยเป็นภาระ และมีชื่อเรื่องวิจัยของตนเองที่สั้น ชัด ใช้ได้จริง",
    output: "ปัญหาผู้เรียน 1 เรื่อง + สาเหตุ 3 ข้อ + ชื่อเรื่องวิจัย 3 ชื่อ (เลือก 1)",
    time: "2.5–3 ชั่วโมง"
  },
  {
    id: 2,
    day: "วันที่ 1 สาย",
    title: "ถอดรหัสกระบวนการวิจัยในชั้นเรียน",
    goal: "จำวงจร PAOR ได้โดยไม่ต้องเปิดตำรา และวางแผน 1 วงจรของงานตนเองได้",
    output: "แผ่นวงจร PAOR ของงานตนเอง 1 แผ่น",
    time: "1.5–2 ชั่วโมง"
  },
  {
    id: 3,
    day: "วันที่ 1 บ่าย",
    title: "นวัตกรรมและเค้าโครงวิจัยด้วย AI",
    goal: "มีนวัตกรรมที่เล็กพอทำได้ในห้องจริง และมีเค้าโครงวิจัย CAR 1 หน้า",
    output: "แผนกิจกรรม 1 คาบ + เค้าโครง CAR 1 หน้า",
    time: "ประมาณ 3 ชั่วโมง"
  },
  {
    id: 4,
    day: "วันที่ 2 เช้า",
    title: "เก็บข้อมูลและสถิติอย่างง่ายด้วย AI",
    goal: "มีตารางข้อมูลที่อ่านเองได้ และสรุปผลเป็นภาษาคน โดยไม่ต้องจำสูตรยาก",
    output: "ตารางคะแนน + ค่าเฉลี่ย + ร้อยละความก้าวหน้า + สรุป 1 ย่อหน้า",
    time: "2.5–3 ชั่วโมง"
  },
  {
    id: 5,
    day: "วันที่ 2 สาย",
    title: "ถอดบทเรียนและเขียน Best Practice",
    goal: "มีร่างเอกสารที่คนอื่นหยิบไปใช้ต่อได้ ไม่ใช่เรียงความสวยแต่ทำซ้ำไม่ได้",
    output: "ร่าง Best Practice 5 หัวข้อ ภาษาของครู",
    time: "ประมาณ 2.5 ชั่วโมง"
  },
  {
    id: 6,
    day: "วันที่ 2 บ่ายท้าย",
    title: "เวทีแลกเปลี่ยนและประเมินผล",
    goal: "ปล่อยของได้ใน 3 นาที รับข้อเสนอจากเพื่อน และวางแผน 30 วันหลังเรียน",
    output: "Pitch 3 นาที + ข้อเสนอจากบัดดี้ + แผน 30 วัน",
    time: "ประมาณ 90 นาที"
  }
];

const prompts = [
  {
    id: "p1",
    title: "ชุดที่ 1  สกัดปัญหาและคิดชื่อเรื่องวิจัย",
    module: 1,
    text: "ฉันเป็นครูสอนวิชา [ระบุวิชา เช่น ภาษาไทย] ระดับชั้น [ระบุชั้น เช่น ป.3] พบปัญหานักเรียน [ระบุพฤติกรรมที่สังเกตได้ เช่น อ่านสะกดคำไม่คล่อง 5 คน จาก 22 คน] ช่วยวิเคราะห์สาเหตุที่เป็นไปได้ 3 ข้อ ที่ครูจัดการได้ในห้องเรียน จากนั้นเสนอแนวทางนวัตกรรมแบบ Active Learning ที่ทำได้ง่ายในคาบเรียน พร้อมตั้งชื่อหัวข้อวิจัยในชั้นเรียนสั้น ๆ สไตล์ทันสมัย จำนวน 3 ชื่อ โดยแต่ละชื่อต้องประกอบด้วย เป้าหมาย + นวัตกรรม + ตัวแปรที่พัฒนา + กลุ่มเป้าหมาย"
  },
  {
    id: "p2",
    title: "ชุดที่ 2  ออกแบบแผนกิจกรรมและนวัตกรรม",
    module: 3,
    text: "ช่วยออกแบบแผนการจัดกิจกรรมการเรียนรู้ 1 คาบ (50 นาที) เพื่อแก้ปัญหา [ระบุปัญหา] โดยใช้นวัตกรรม [ระบุนวัตกรรม เช่น เกมการ์ดคำศัพท์] โปรดระบุให้ครบ 1) วัตถุประสงค์การเรียนรู้ 2) กิจกรรมขั้นนำ ขั้นสอน ขั้นสรุป พร้อมเวลา 3) สื่ออุปกรณ์ที่ใช้ของที่มีในโรงเรียนเป็นหลัก และ 4) วิธีวัดผลสั้น ๆ เข้าใจง่าย เขียนเป็นภาษาที่ครูเอาไปสอนได้ทันที ไม่ใช้ทฤษฎียาว"
  },
  {
    id: "p3",
    title: "ชุดที่ 3  ประมวลผลคะแนนและแปลผล",
    module: 4,
    text: "นี่คือตารางคะแนนก่อนเรียนและหลังเรียนของนักเรียนจำนวน [ระบุจำนวน] คน [วางตารางหรือพิมพ์รายคน] ช่วยคำนวณ 1) คะแนนเฉลี่ยก่อนและหลังเรียน 2) ร้อยละความก้าวหน้าของแต่ละคนและค่าเฉลี่ยของกลุ่ม โดยใช้สูตร (หลัง−ก่อน)÷(เต็ม−ก่อน)×100 3) จำนวนคนที่ผ่านเกณฑ์ [ระบุเกณฑ์] และ 4) เขียนย่อหน้าสรุปผลการวิจัยเชิงประจักษ์ด้วยภาษาทางการที่สละสลวย สำหรับใส่ในรายงานวิจัย ความยาว 6–8 บรรทัด ห้ามโอ้อวดเกินข้อมูล"
  },
  {
    id: "p4",
    title: "ชุดที่ 4  เขียนร่างเอกสาร Best Practice",
    module: 5,
    text: "ช่วยเขียนโครงร่างเอกสาร Best Practice จากงานวิจัยเรื่อง [ระบุชื่อเรื่อง] มีผลสำเร็จคือ [ระบุผลลัพธ์] โดยเขียนตามหัวข้อดังนี้ 1) ความเป็นมาและความสำคัญ 2) วัตถุประสงค์ 3) ขั้นตอนการดำเนินงานตามวงจร PAOR 4) ผลลัพธ์และประโยชน์ที่ได้รับ 5) บทเรียนที่ได้ ใช้สำนวนวิชาการที่กระชับ ชัดเจน และตรงประเด็น ห้ามใส่ทฤษฎีที่ไม่เกี่ยวกับงานนี้ ห้ามสร้างตัวเลขหรือชื่อนักเรียนเพิ่มจากข้อมูลที่ให้ หลังได้ร่างแล้ว ให้สรุปเป็นข้อที่ครูต้องตรวจแก้ด้วยตนเอง 5 ข้อ"
  },
  {
    id: "g1",
    title: "ก1  ขยายสาเหตุด้วย 5 Whys",
    module: 1,
    text: "ฉันเป็นครูชั้น [ชั้น] วิชา [วิชา] เห็นปัญหานี้ซ้ำ: [พฤติกรรมที่สังเกตได้ + ความถี่ + จำนวนคน] ช่วยใช้เทคนิค 5 Whys ขุดสาเหตุเป็นข้อ ๆ จากนั้นแยกสาเหตุเป็น 2 กลุ่ม คือ สาเหตุที่ครูจัดการได้ในห้องเรียน และสาเหตุที่อยู่นอกอำนาจครู จากนั้นเสนอโจทย์วิจัยที่เล็กลงได้ 1 ข้อ"
  },
  {
    id: "g2",
    title: "ก2  ออกแบบนวัตกรรม 3 ทางเลือก",
    module: 3,
    text: "ปัญหาที่เลือกแล้วคือ [ปัญหา] สาเหตุในห้องคือ [สาเหตุ] นักเรียนจำนวน [จำนวน] คน บริบทโรงเรียนคือ [เช่น โรงเรียนขนาดเล็ก สื่อมีจำกัด] ช่วยเสนอนวัตกรรม 3 ทางเลือก ที่ใช้ของถูกหรือของที่มีในโรงเรียนได้ เปรียบเทียบแต่ละทางในด้าน เวลาเตรียม ความยากของครู และโอกาสที่เด็กกลุ่มอ่อนจะตามทัน จากนั้นแนะนำ 1 ทางที่เหมาะกับครูเริ่มต้น"
  },
  {
    id: "g3",
    title: "ก3  สร้างแบบทดสอบสั้น",
    module: 4,
    text: "ช่วยออกข้อสอบสั้น 10 ข้อ เพื่อวัด [ตัวแปร] ของนักเรียนชั้น [ชั้น] เนื้อหาครอบคลุม [บท/คำ/ทักษะ] ข้อสอบต้องสอดคล้องกับนวัตกรรม [ชื่อนวัตกรรม] ระบุเกณฑ์ให้คะแนน และแยกข้อเป็น 3 ระดับ ง่าย ปานกลาง ยาก ในสัดส่วน 3:5:2 อย่าใช้คำกำกวม"
  },
  {
    id: "g4",
    title: "ก4  สร้างแบบสังเกต",
    module: 4,
    text: "ช่วยสร้างแบบสังเกตพฤติกรรม [ระบุพฤติกรรม] สำหรับนักเรียนชั้น [ชั้น] จำนวนรายการ 5–7 ข้อ ใช้มาตร 3 ระดับ พร้อมคำอธิบายแต่ละระดับที่ครูเห็นแล้วให้คะแนนตรงกันได้ และมีช่องบันทึกหลักฐานสั้น ๆ"
  },
  {
    id: "g5",
    title: "ก5  ตรวจภาษาเค้าโครง",
    module: 3,
    text: "นี่คือเค้าโครงวิจัยชั้นเรียน 1 หน้าของฉัน [วางข้อความ] ช่วยตรวจเฉพาะ 1) ชื่อเรื่องครบ 4 ส่วนหรือไม่ 2) ปัญหามีหลักฐานหรือยังเป็นคำกว้าง 3) นวัตกรรมเล็กพอทำในห้องจริงหรือไม่ 4) เครื่องมือวัดตรงตัวแปรหรือไม่ จากนั้นเสนอประโยคแก้เป็นภาษาไทยทางการที่ยังเป็นเสียงครู"
  },
  {
    id: "g6",
    title: "ก6  ย่อ Pitch 3 นาที",
    module: 6,
    text: "ย่องานวิจัยของฉันให้พูดจบใน 3 นาที ตามจังหวะ เปิดปัญหา / นวัตกรรม / ผล 1 ตัวเลขกับ 1 เหตุการณ์เด็ก / บทเรียนและแผนต่อ ข้อมูลคือ [วางชื่อเรื่อง ผลลัพธ์ บทเรียน] ใช้ภาษาราชการที่พูดออกเสียงได้ ไม่ใช้คำอังกฤษเกินจำเป็น"
  }
];

function $(sel) { return document.querySelector(sel); }
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content;
}

function go(hash) {
  location.hash = hash;
}

function parseRoute() {
  const raw = (location.hash || "#/home").replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);
  if (parts[0] === "module") return { route: "module", moduleId: Number(parts[1] || 1) };
  if (["home", "prompts", "workbook", "plan", "about"].includes(parts[0])) {
    return { route: parts[0], moduleId: null };
  }
  return { route: "home", moduleId: null };
}

function render() {
  const r = parseRoute();
  state.route = r.route;
  state.moduleId = r.moduleId;
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.route === r.route && String(b.dataset.id || "") === String(r.moduleId || ""));
  });
  const root = $("#view");
  if (r.route === "home") root.replaceChildren(viewHome());
  else if (r.route === "module") root.replaceChildren(viewModule(r.moduleId));
  else if (r.route === "prompts") root.replaceChildren(viewPrompts());
  else if (r.route === "workbook") root.replaceChildren(viewWorkbook());
  else if (r.route === "plan") root.replaceChildren(viewPlan());
  else root.replaceChildren(viewAbout());
  $("#crumb").textContent = crumbText(r);
  closeSide();
  window.scrollTo({ top: 0, behavior: "instant" });
  bindFields();
}

function crumbText(r) {
  if (r.route === "home") return "หน้าหลัก / ภาพรวมหลักสูตร";
  if (r.route === "module") return `บทเรียน / โมดูล ${r.moduleId}`;
  if (r.route === "prompts") return "คลัง Prompt";
  if (r.route === "workbook") return "ใบงานของฉัน";
  if (r.route === "plan") return "แผน 30 วัน";
  return "เกี่ยวกับคอร์ส";
}

function doneCount() {
  return modules.filter(m => state.data.done[m.id]).length;
}
function renderProgress() {
  const n = doneCount();
  const pct = Math.round((n / modules.length) * 100);
  $("#prog-label").textContent = `${n} / 6 โมดูล`;
  $("#prog-bar").style.width = pct + "%";
}
function markNavDone() {
  document.querySelectorAll(".nav-btn[data-id]").forEach(b => {
    b.classList.toggle("completed", !!state.data.done[b.dataset.id]);
  });
}

function viewHome() {
  const cards = modules.map(m => `
    <article class="mod-card" onclick="go('#/module/${m.id}')">
      <div class="tag">${m.day} · ${m.time}</div>
      <h3>โมดูล ${m.id}  ${m.title}</h3>
      <p>${m.output}</p>
    </article>
  `).join("");
  return el(`
    <section class="hero">
      <div class="eyebrow">ONLINE COURSE · SPA</div>
      <h2>วิจัยชั้นเรียนเปลี่ยนชีวิต<br>ปั้น Best Practice ติดปีกด้วย AI</h2>
      <p>คอร์สปฏิบัติการ 6 โมดูล สำหรับครูที่อยากเปลี่ยนปัญหาในห้องเรียนให้เป็นงานวิจัยที่ใช้ได้จริง โดยให้ AI ช่วยงานเขียนและสถิติ แต่ครูยังเป็นคนตัดสินใจเรื่องเด็ก</p>
      <div class="meta">
        <span class="chip">2 วัน · 12 ชั่วโมง</span>
        <span class="chip">เน้นปฏิบัติ 80%</span>
        <span class="chip">ผลงาน: CAR 1 หน้า + Best Practice</span>
      </div>
    </section>
    <h3 class="section-title">แผนที่การเดินทาง</h3>
    <div class="grid cards">${cards}</div>
    <section class="lesson-card" style="margin-top:18px">
      <h3>หลัก 4 ข้อที่ใช้ตลอดคอร์ส</h3>
      <ul class="clean">
        <li>ปรับนิยามใหม่: วิจัยชั้นเรียนคือการสอนอย่างมีสติและบันทึกอย่างเป็นระบบ</li>
        <li>สะสมชัยชนะก้าวเล็ก: ชื่อเรื่อง → CAR 1 หน้า → Best Practice เล่มบาง</li>
        <li>เพื่อนคู่คิดและเขตปลอดภัย: ทำงานเป็นคู่ ช่วยตรวจภาษา ไม่แก้แทน</li>
        <li>ใช้ทักษะ AI ที่ครูมีอยู่แล้ว ให้เหลือเวลาไปโฟกัสปัญหาเด็ก</li>
      </ul>
    </section>
  `);
}

function field(id, label, rows = 3) {
  const val = state.data.fields[id] || "";
  return `
    <label class="field">${label}
      <textarea id="${id}" rows="${rows}">${escapeHtml(val)}</textarea>
    </label>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function promptBox(p) {
  return `
    <article class="prompt">
      <header>
        <strong>${p.title}</strong>
        <button class="btn sm gold" type="button" onclick="copyPrompt('${p.id}')">คัดลอก</button>
      </header>
      <pre id="txt-${p.id}">${escapeHtml(p.text)}</pre>
    </article>
  `;
}

function moduleChrome(m) {
  const prev = m.id > 1 ? `<button class="btn ghost" onclick="go('#/module/${m.id - 1}')">โมดูลก่อนหน้า</button>` : `<button class="btn ghost" onclick="go('#/home')">หน้าหลัก</button>`;
  const next = m.id < 6 ? `<button class="btn teal" onclick="go('#/module/${m.id + 1}')">โมดูลถัดไป</button>` : `<button class="btn teal" onclick="go('#/plan')">ไปแผน 30 วัน</button>`;
  const checked = state.data.done[m.id] ? "checked" : "";
  return `
    <div class="check-row">
      <input type="checkbox" id="done-${m.id}" ${checked} onchange="toggleDone(${m.id}, this.checked)">
      <label for="done-${m.id}">ทำเครื่องหมายว่าเรียนจบโมดูลนี้แล้ว</label>
    </div>
    <div class="footer-nav">${prev}${next}</div>
  `;
}

function viewModule(id) {
  const m = modules.find(x => x.id === id) || modules[0];
  const body = moduleBodies[m.id]();
  return el(`
    <section class="hero">
      <div class="eyebrow">${m.day} · ${m.time}</div>
      <h2>โมดูล ${m.id}  ${m.title}</h2>
      <p>${m.goal}</p>
      <div class="meta">
        <span class="chip">ผลลัพธ์: ${m.output}</span>
      </div>
    </section>
    ${body}
    ${moduleChrome(m)}
  `);
}

const moduleBodies = {
  1() {
    return `
      <article class="lesson-card">
        <h3>กิจกรรมที่ 1  ปลดล็อกใจ… วิจัยไม่ใช่เรื่องน่ากลัว</h3>
        <p>ครูจำนวนมากไม่ได้ต่อต้านการพัฒนาเด็ก แต่ต่อต้านงานเอกสารที่ดูเป็นงานวิจัย เริ่มจากปรับนิยามก่อนลงมือ</p>
        <ol class="steps">
          <li>เขียนคำแรกที่ผุดเมื่อได้ยินคำว่า “วิจัยชั้นเรียน”</li>
          <li>แยกคำบนกระดานเป็นกองกลัว กับกองอยากทำ</li>
          <li>เขียนประโยคใหม่ของตนเอง 1 ประโยค</li>
          <li>จับคู่บัดดี้ อ่านให้กันฟัง</li>
        </ol>
        <div class="callout gold">ประโยคปรับนิยาม: วิจัยชั้นเรียนไม่ใช่เล่มหนา แต่คือการสอนอย่างมีสติและบันทึกอย่างเป็นระบบ ปัญหาที่เกิดกับเด็กคือโจทย์วิจัย และการที่ครูพยายามช่วยเด็กคือการทำวิจัยแล้ว</div>
        <div class="sheet">
          <h4>ใบงาน 1.0 ประโยคในหัวของฉัน</h4>
          ${field("m1_word", "คำแรกที่นึกถึง")}
          ${field("m1_fear", "สิ่งที่ทำให้ฉันถอย")}
          ${field("m1_hope", "สิ่งที่ฉันยังอยากทำให้เด็ก")}
          ${field("m1_new", "ประโยคใหม่หลังปรับนิยาม")}
          ${field("m1_buddy", "ชื่อบัดดี้ของฉัน", 2)}
          <div class="saved" data-saved></div>
        </div>
      </article>
      <article class="lesson-card">
        <h3>กิจกรรมที่ 2  จับชีพจรห้องเรียน</h3>
        <p>โจทย์ที่ดีเกิดจากพฤติกรรมที่เห็นซ้ำ ไม่ใช่หัวข้อที่ฟังดูวิชาการ</p>
        <p><strong>สูตรชื่อเรื่อง</strong><br>{ชื่อวิจัย} = [เป้าหมาย] + [นวัตกรรม/เทคนิค] + [ตัวแปรที่พัฒนา] + [กลุ่มเป้าหมาย]</p>
        <table>
          <tr><th>ส่วน</th><th>คำถามช่วยคิด</th><th>ตัวอย่าง</th></tr>
          <tr><td>1 เป้าหมาย</td><td>พัฒนา แก้ปัญหา ส่งเสริม หรือเปรียบเทียบ</td><td>การพัฒนา / การแก้ปัญหา</td></tr>
          <tr><td>2 นวัตกรรม</td><td>ใช้สื่อ เทคนิค หรือรูปแบบอะไร</td><td>เกมการ์ดคำศัพท์ / Gamification</td></tr>
          <tr><td>3 ตัวแปรตาม</td><td>เด็กจะเปลี่ยนตรงไหน</td><td>ความคงทนในการจำคำศัพท์</td></tr>
          <tr><td>4 กลุ่มเป้าหมาย</td><td>ชั้นใด กี่คน</td><td>นักเรียนชั้น ป.3</td></tr>
        </table>
        <div class="sheet">
          <h4>ใบงาน 1.1–1.2 จับปัญหาและประกอบชื่อเรื่อง</h4>
          ${field("m1_class", "วิชา / ชั้น / จำนวนนักเรียน", 2)}
          ${field("m1_beh", "พฤติกรรมที่เห็นซ้ำ เขียนให้เห็นภาพ")}
          ${field("m1_ev", "หลักฐานที่มีอยู่แล้ว")}
          ${field("m1_why1", "Why 1")}
          ${field("m1_why2", "Why 2")}
          ${field("m1_why3", "Why 3 รากที่ครูจัดการได้ในห้อง")}
          ${field("m1_cause", "สาเหตุที่เลือกเป็นโจทย์")}
          ${field("m1_title_self", "ชื่อเรื่องที่ประกอบเอง")}
          ${field("m1_title_ai", "ชื่อที่ AI เสนอแล้วครูเลือก")}
          <div class="saved" data-saved></div>
        </div>
        ${promptBox(prompts[0])}
        <div class="callout">เกณฑ์ผ่านโมดูล 1: มีพฤติกรรมที่สังเกตได้ มีสาเหตุที่ครูควบคุมได้ และมีชื่อเรื่อง 1 ชื่อที่พูดแล้วจบในลมหายใจเดียว</div>
      </article>
    `;
  },
  2() {
    return `
      <article class="lesson-card">
        <h3>กิจกรรมที่ 3  วงจร PAOR ท่องจำง่าย</h3>
        <div class="callout">คิดให้ชัด แล้วสอน แล้วดูของจริง แล้วเขียนสิ่งที่เรียนรู้ — แค่นี้คือวิจัยชั้นเรียน</div>
        <table>
          <tr><th>ขั้น</th><th>คำถามของครู</th><th>งานที่ต้องทำให้จบ</th></tr>
          <tr><td>P Plan</td><td>จะช่วยเด็กด้วยอะไร วัดความสำเร็จอย่างไร</td><td>เป้าหมาย นวัตกรรม เครื่องมือ ระยะเวลา</td></tr>
          <tr><td>A Act</td><td>สอนและใช้นวัตกรรมตามแผนหรือยัง</td><td>ขั้นนำ ขั้นสอน ขั้นสรุป</td></tr>
          <tr><td>O Observe</td><td>เด็กเปลี่ยนอย่างไร มีหลักฐานอะไร</td><td>คะแนน บันทึกพฤติกรรม ชิ้นงาน</td></tr>
          <tr><td>R Reflect</td><td>อะไรได้ผล อะไรต้องปรับ</td><td>สรุปบทเรียน วางวงจรใหม่</td></tr>
        </table>
        <h4>ตัวอย่างวงจรสั้น ครูภาษาไทย ป.3</h4>
        <ul class="clean">
          <li><strong>Plan:</strong> กลุ่มอ่อน 8 คน สะกดคำได้เพิ่มขึ้นอย่างน้อยร้อยละ 25 ใช้เกมการ์ด 4 คาบ</li>
          <li><strong>Act:</strong> จับคู่คำ → ต่อประโยค → นักเรียนสร้างการ์ดเอง → ทบทวนรวมชั้น</li>
          <li><strong>Observe:</strong> pretest/posttest 10 ข้อ บันทึกคำที่ผิดซ้ำ นับครั้งที่อาสาตอบ</li>
          <li><strong>Reflect:</strong> เด็กที่ยังถอดเสียงไม่ได้ต้องมีขั้นสอนก่อนเล่น</li>
        </ul>
        <div class="sheet">
          <h4>ใบงาน 2.1 แผน PAOR ฉบับครู</h4>
          ${field("m2_title", "ชื่อเรื่องวิจัย จากโมดูล 1", 2)}
          ${field("m2_p", "P จะช่วยเด็กด้วยอะไร ในกี่คาบ วัดด้วยอะไร")}
          ${field("m2_a", "A จะสอนอย่างไรเป็นขั้น ๆ")}
          ${field("m2_o", "O จะเก็บหลักฐานอะไร จากใคร เมื่อไร")}
          ${field("m2_r", "R ถ้าได้ผลจะขยายอย่างไร ถ้าไม่เด็ดจะปรับตรงไหน")}
          ${field("m2_buddy", "สิ่งที่บัดดี้เตือนให้ปรับ")}
          <div class="saved" data-saved></div>
        </div>
        <div class="callout warn">กับดัก: อย่าวางนวัตกรรม 8 สัปดาห์ในวงจรแรก ให้เริ่มแค่ 3–6 คาบ และอย่าเขียนว่า “สังเกตพฤติกรรม” โดยไม่มีเครื่องมือ</div>
      </article>
    `;
  },
  3() {
    return `
      <article class="lesson-card">
        <h3>กิจกรรมที่ 4  AI ผู้ช่วยออกแบบนวัตกรรม</h3>
        <p>นวัตกรรมไม่จำเป็นต้องแพง ขอให้เป็นวิธีที่ครูยังไม่ได้ใช้เป็นระบบกับปัญหานี้ และครูคนอื่นทำซ้ำได้</p>
        <table>
          <tr><th>ส่วน</th><th>สิ่งที่ต้องระบุ</th></tr>
          <tr><td>วัตถุประสงค์</td><td>เด็กทำอะไรได้เมื่อจบคาบ</td></tr>
          <tr><td>ขั้นนำ ขั้นสอน ขั้นสรุป</td><td>รวมประมาณ 50 นาที</td></tr>
          <tr><td>สื่ออุปกรณ์</td><td>ของที่มีในโรงเรียนก่อน</td></tr>
          <tr><td>วิธีวัดผลสั้น ๆ</td><td>รู้ได้ในคาบนี้ ไม่ต้องรอ posttest อย่างเดียว</td></tr>
        </table>
        ${promptBox(prompts[1])}
        <div class="sheet">
          <h4>ใบงาน 3.1 นวัตกรรมของฉัน</h4>
          ${field("m3_name", "ชื่อนวัตกรรม", 2)}
          ${field("m3_cause", "แตะสาเหตุข้อใดของเด็ก", 2)}
          ${field("m3_obj", "วัตถุประสงค์การเรียนรู้ 1 คาบ")}
          ${field("m3_start", "ขั้นนำ")}
          ${field("m3_teach", "ขั้นสอน")}
          ${field("m3_end", "ขั้นสรุป")}
          ${field("m3_media", "สื่อที่ต้องเตรียม")}
          ${field("m3_measure", "วัดผลคาบนี้ด้วยอะไร")}
          <div class="saved" data-saved></div>
        </div>
      </article>
      <article class="lesson-card">
        <h3>กิจกรรมที่ 5  One-Page CAR</h3>
        <p>ถ้าหน้านี้ชัด งานโมดูลถัดไปจะเขียนต่อได้เร็ว</p>
        <div class="sheet">
          <h4>ใบงาน 3.2 เค้าโครงวิจัย 1 หน้า</h4>
          ${field("m3_car_title", "ชื่อเรื่อง")}
          ${field("m3_car_prob", "ปัญหาและความสำคัญ 4–6 บรรทัด มีหลักฐาน")}
          ${field("m3_car_obj", "วัตถุประสงค์")}
          ${field("m3_car_inn", "นวัตกรรมโดยย่อ")}
          ${field("m3_car_group", "กลุ่มเป้าหมายและระยะเวลา")}
          ${field("m3_car_tool", "เครื่องมือเก็บข้อมูล")}
          ${field("m3_car_ana", "แนววิเคราะห์ข้อมูล")}
          ${field("m3_car_ben", "ประโยชน์ที่คาดว่าจะได้รับ")}
          <div class="saved" data-saved></div>
        </div>
        ${promptBox(prompts.find(p => p.id === "g5"))}
      </article>
    `;
  },
  4() {
    return `
      <article class="lesson-card">
        <h3>กิจกรรมที่ 6  เตรียมข้อมูลง่าย ๆ</h3>
        <p>ไม่ต้องมีเครื่องมือ 5 ฉบับ เลือก 2 อย่างที่ตอบวัตถุประสงค์ก็พอ</p>
        <table>
          <tr><th>ถ้าตัวแปรคือ</th><th>เครื่องมือหลัก</th><th>เครื่องมือเสริม</th></tr>
          <tr><td>ความรู้ / ทักษะ</td><td>แบบทดสอบสั้น 8–15 ข้อ</td><td>ชิ้นงานหรือแบบฝึก</td></tr>
          <tr><td>ความคงทน</td><td>แบบทดสอบซ้ำหลังเว้นช่วง</td><td>บันทึกคำที่ผิดซ้ำ</td></tr>
          <tr><td>พฤติกรรมในห้อง</td><td>แบบสังเกตมีรายการชี้ชัด</td><td>บันทึกเหตุการณ์สั้น</td></tr>
          <tr><td>เจตคติ / ความมั่นใจ</td><td>มาตรประมาณค่า 5–8 ข้อ</td><td>ประโยคสะท้อนของนักเรียน</td></tr>
        </table>
        <div class="sheet">
          <h4>ใบงาน 4.1 เครื่องมือของงานนี้</h4>
          ${field("m4_var", "ตัวแปรที่วัด", 2)}
          ${field("m4_main", "เครื่องมือหลัก")}
          ${field("m4_sub", "เครื่องมือเสริม")}
          ${field("m4_when", "จะเก็บก่อนเรียนเมื่อไร หลังเรียนเมื่อไร")}
          ${field("m4_who", "ใครเป็นคนเก็บข้อมูล", 2)}
          ${field("m4_skip", "จะไม่เก็บอะไร เพราะไม่ตอบวัตถุประสงค์")}
          <div class="saved" data-saved></div>
        </div>
      </article>
      <article class="lesson-card">
        <h3>กิจกรรมที่ 7  สถิติแบบครู ไม่ต้องปวดหัว</h3>
        <div class="callout">ร้อยละความก้าวหน้า = (หลัง − ก่อน) ÷ (เต็ม − ก่อน) × 100</div>
        <table>
          <tr><th>คนที่</th><th>ก่อน</th><th>หลัง</th><th>ผลต่าง</th><th>% ความก้าวหน้า</th></tr>
          <tr><td>1</td><td>3</td><td>7</td><td>4</td><td>57.1</td></tr>
          <tr><td>2</td><td>4</td><td>8</td><td>4</td><td>66.7</td></tr>
          <tr><td>เฉลี่ย 8 คน</td><td>3.88</td><td>7.13</td><td>3.25</td><td>53.4</td></tr>
        </table>
        ${promptBox(prompts[2])}
        <div class="sheet">
          <h4>ใบงาน 4.2 สรุปตัวเลขของงานนี้</h4>
          ${field("m4_n", "จำนวนกลุ่มเป้าหมาย / คะแนนเต็ม / เกณฑ์ผ่าน", 2)}
          ${field("m4_pre", "ค่าเฉลี่ยก่อนเรียน", 2)}
          ${field("m4_post", "ค่าเฉลี่ยหลังเรียน", 2)}
          ${field("m4_gain", "ร้อยละความก้าวหน้าเฉลี่ย", 2)}
          ${field("m4_pass", "จำนวนคนที่ผ่านเกณฑ์", 2)}
          ${field("m4_need", "คนที่ยังต้องช่วยต่อ ใช้รหัส ไม่ใช้ชื่อจริง", 2)}
          ${field("m4_sum", "ย่อหน้าสรุปผลเชิงประจักษ์", 5)}
          <div class="saved" data-saved></div>
        </div>
        <div class="callout warn">อย่าใส่ชื่อจริงนักเรียนในเครื่องมือ AI สาธารณะ และห้ามให้ AI สร้างคะแนนสมมติ</div>
      </article>
    `;
  },
  5() {
    return `
      <article class="lesson-card">
        <h3>กิจกรรมที่ 8  ถอดรหัสความสำเร็จ</h3>
        <p>Best Practice คือวิธีที่ทำให้แล้วได้ผล ถอดเป็นขั้นตอนที่ครูคนอื่นทำตามได้</p>
        <ol class="steps">
          <li>อะไรคือจุดที่เด็กเริ่มเปลี่ยน</li>
          <li>ครูทำอะไรต่างจากเดิม 3 อย่าง</li>
          <li>อะไรที่คิดว่าจะได้ผล แต่จริง ๆ ไม่เด็ด</li>
          <li>ถ้าเริ่มใหม่จะตัด / เพิ่มขั้นตอนใด</li>
          <li>ครูคนอื่นต้องมีอะไรอย่างน้อยที่สุดจึงจะทำตามได้</li>
        </ol>
        <div class="sheet">
          <h4>ใบงาน 5.1 ถอดรหัสความสำเร็จ</h4>
          ${field("m5_change", "จุดที่เด็กเริ่มเปลี่ยน")}
          ${field("m5_diff", "สิ่งที่ครูทำต่างจากเดิม 3 อย่าง")}
          ${field("m5_fail", "สิ่งที่ไม่ได้ผล")}
          ${field("m5_edit", "สิ่งที่จะตัดออก / สิ่งที่จะเพิ่ม")}
          ${field("m5_min", "ของขั้นต่ำที่ครูคนอื่นต้องมี")}
          <div class="saved" data-saved></div>
        </div>
      </article>
      <article class="lesson-card">
        <h3>กิจกรรมที่ 9  พิมพ์เขียว Best Practice</h3>
        <table>
          <tr><th>หัวข้อ</th><th>ความยาวแนะนำ</th><th>ต้องมี</th></tr>
          <tr><td>1 ความเป็นมา</td><td>ครึ่งหน้าถึง 1 หน้า</td><td>บริบท ปัญหา หลักฐาน</td></tr>
          <tr><td>2 วัตถุประสงค์</td><td>3–6 บรรทัด</td><td>1–2 ข้อ ขนานกับชื่อเรื่อง</td></tr>
          <tr><td>3 ขั้นตอน PAOR</td><td>1–2 หน้า</td><td>ทำซ้ำได้</td></tr>
          <tr><td>4 ผลลัพธ์</td><td>1 หน้า</td><td>ตัวเลข + เหตุการณ์เด็ก</td></tr>
          <tr><td>5 บทเรียนที่ได้</td><td>ครึ่งหน้า</td><td>ของที่ได้ผลและที่ต้องปรับ</td></tr>
        </table>
        ${promptBox(prompts[3])}
        <div class="callout gold">AI ช่วยเรียงประโยค ไม่ใช่คนคิดปัญหาให้ ถ้าประโยคใดอธิบายต่อไม่ได้ ยังไม่ใช่ภาษาของครู</div>
        <div class="sheet">
          <h4>ใบงาน 5.2 ร่าง Best Practice</h4>
          ${field("m5_bg", "1 ความเป็นมาและความสำคัญ", 5)}
          ${field("m5_obj", "2 วัตถุประสงค์")}
          ${field("m5_paor", "3 ขั้นตอน PAOR", 5)}
          ${field("m5_result", "4 ผลลัพธ์และประโยชน์", 5)}
          ${field("m5_lesson", "5 บทเรียนที่ได้")}
          ${field("m5_fix", "ประโยคที่ต้องแก้เพราะยังไม่ใช่ภาษาของฉัน")}
          <div class="saved" data-saved></div>
        </div>
      </article>
    `;
  },
  6() {
    return `
      <article class="lesson-card">
        <h3>กิจกรรมที่ 10  Show & Share</h3>
        <table>
          <tr><th>นาที</th><th>พูดอะไร</th><th>ห้ามทำ</th></tr>
          <tr><td>0.00–0.30</td><td>ชื่อเรื่อง + ชั้น + ปัญหา 1 ประโยค</td><td>เล่าประวัติโรงเรียนยาว</td></tr>
          <tr><td>0.30–1.20</td><td>นวัตกรรมทำอะไร กี่คาบ จุดที่ต่างจากเดิม</td><td>อธิบายทฤษฎี</td></tr>
          <tr><td>1.20–2.20</td><td>ผล 1 ตัวเลข + 1 ภาพเหตุการณ์</td><td>อ่านตารางทั้งตาราง</td></tr>
          <tr><td>2.20–3.00</td><td>บทเรียน 1 ข้อ และแผน 30 วัน</td><td>ขอโทษว่ายังไม่สมบูรณ์ยาว</td></tr>
        </table>
        ${promptBox(prompts.find(p => p.id === "g6"))}
        <div class="sheet">
          <h4>ใบงาน 6.1 สคริปต์ 3 นาที</h4>
          ${field("m6_open", "ประโยคเปิด ปัญหา")}
          ${field("m6_inn", "นวัตกรรมใน 3 ประโยค")}
          ${field("m6_num", "ตัวเลข 1 ตัวที่อยากให้จำ", 2)}
          ${field("m6_scene", "เหตุการณ์เด็ก 1 ภาพ")}
          ${field("m6_next", "บทเรียนและแผน 30 วัน")}
          <div class="saved" data-saved></div>
        </div>
        <div class="sheet">
          <h4>ข้อเสนอจากกลยาณมิตรคู่คิด</h4>
          ${field("m6_peer_good", "จุดเด่นที่ควรคง")}
          ${field("m6_peer_fix", "ข้อเสนอที่ทำได้ภายใน 7 วัน")}
          <div class="saved" data-saved></div>
        </div>
        <h4>สัดส่วนประเมินทั้งคอร์ส</h4>
        <ul class="clean">
          <li>40% การมีส่วนร่วมและงานกับบัดดี้</li>
          <li>40% ชิ้นงาน CAR 1 หน้า และร่าง Best Practice</li>
          <li>20% ทัศนคติหลังเรียน เป้าหมายเชิงบวกไม่น้อยกว่าร้อยละ 85</li>
        </ul>
      </article>
    `;
  }
};

function viewPrompts() {
  return el(`
    <section class="hero">
      <div class="eyebrow">PROMPT BANK</div>
      <h2>คลังคำสั่งแม่แบบ AI</h2>
      <p>คัดลอกทั้งก้อน แล้วแทนเฉพาะข้อความในวงเล็บเหลี่ยม ด้วยของจริงของครู อย่าวางชื่อจริงนักเรียนลงในเครื่องมือสาธารณะ</p>
    </section>
    ${prompts.map(promptBox).join("")}
  `);
}

function viewWorkbook() {
  const keys = Object.keys(state.data.fields).filter(k => (state.data.fields[k] || "").trim());
  const list = keys.length
    ? keys.map(k => `<tr><td>${k}</td><td>${escapeHtml(state.data.fields[k]).slice(0, 180)}</td></tr>`).join("")
    : `<tr><td colspan="2">ยังไม่มีข้อความที่บันทึก เริ่มที่โมดูล 1 แล้วพิมพ์ในใบงานได้เลย</td></tr>`;
  return el(`
    <section class="hero">
      <div class="eyebrow">MY WORKBOOK</div>
      <h2>ใบงานของฉัน</h2>
      <p>ทุกช่องที่พิมพ์ในบทเรียนจะบันทึกอัตโนมัติในเบราว์เซอร์นี้ ไม่ถูกส่งออกเซิร์ฟเวอร์</p>
      <div class="meta">
        <button class="btn ghost" onclick="exportWorkbook()">ดาวน์โหลดข้อความทั้งหมด</button>
        <button class="btn ghost" onclick="resetWorkbook()">ล้างข้อมูลในเครื่องนี้</button>
      </div>
    </section>
    <article class="lesson-card">
      <table>
        <tr><th>รหัสช่อง</th><th>เนื้อหาที่ย่อ</th></tr>
        ${list}
      </table>
    </article>
  `);
}

function viewPlan() {
  return el(`
    <section class="hero">
      <div class="eyebrow">AFTER CLASS</div>
      <h2>แผน 30 วันสู่เวทีวิชาการ</h2>
      <p>คอร์สจบเมื่อมีเค้าโครง งานจริงเกิดหลังกลับห้องเรียน</p>
    </section>
    <article class="lesson-card">
      <table>
        <tr><th>สัปดาห์</th><th>งานที่ต้องทำให้จบ</th><th>หลักฐาน</th></tr>
        <tr><td>สัปดาห์ที่ 1</td><td>ปรับ CAR 1 หน้าตามข้อเสนอ และเตรียมสื่อวงจรแรก</td><td>ไฟล์ CAR ฉบับแก้ + รูปสื่อ</td></tr>
        <tr><td>สัปดาห์ที่ 2</td><td>เก็บ pretest และเริ่ม Act 3–6 คาบ</td><td>ตารางคะแนนก่อนเรียน + บันทึกคาบ</td></tr>
        <tr><td>สัปดาห์ที่ 3</td><td>เก็บ posttest / แบบสังเกต แล้วใช้ Prompt ชุดที่ 3</td><td>ตารางผล + ย่อหน้าสรุป</td></tr>
        <tr><td>สัปดาห์ที่ 4</td><td>เขียน Best Practice ฉบับสมบูรณ์ ให้พี่เลี้ยงอ่าน</td><td>ไฟล์ฉบับสมบูรณ์ + นัดเวทีในโรงเรียน</td></tr>
      </table>
      <div class="sheet">
        <h4>นัดกับตัวเอง</h4>
        ${field("plan_w1", "สัปดาห์ที่ 1 ฉันจะทำ")}
        ${field("plan_w2", "สัปดาห์ที่ 2 ฉันจะทำ")}
        ${field("plan_w3", "สัปดาห์ที่ 3 ฉันจะทำ")}
        ${field("plan_w4", "สัปดาห์ที่ 4 ฉันจะทำ")}
        <div class="saved" data-saved></div>
      </div>
    </article>
  `);
}

function viewAbout() {
  return el(`
    <section class="hero">
      <div class="eyebrow">ABOUT</div>
      <h2>เกี่ยวกับคอร์สนี้</h2>
      <p>เว็บแอปนี้ถอดโครงจากหลักสูตร “วิจัยชั้นเรียนเปลี่ยนชีวิต ปั้น Best Practice ติดปีกด้วย AI” เพื่อให้เรียนแบบ SPA ได้ทั้งจากคอมพิวเตอร์และโทรศัพท์</p>
    </section>
    <article class="lesson-card">
      <div class="kvs">
        <div>ระยะเวลา</div><div>2 วัน รวม 12 ชั่วโมง เน้นปฏิบัติ 80%</div>
        <div>ผลงานนำออก</div><div>เค้าโครงวิจัย CAR 1 หน้า และร่างเอกสาร Best Practice</div>
        <div>เครื่องมือ AI</div><div>Gemini, ChatGPT, NotebookLM</div>
        <div>ต้นทางแนวคิด</div><div>นายอัมดิน กะสุเฒ่า โรงเรียนบ้านปูลาเจ๊ะมูดอ สพป.นราธิวาส เขต 2</div>
      </div>
      <div class="callout">การวิจัยในชั้นเรียนคือพลังของครูในการสร้างการเปลี่ยนแปลง · นวัตกรรมวันนี้ เพื่อผู้เรียนในวันพรุ่งนี้</div>
    </article>
  `);
}

function bindFields() {
  document.querySelectorAll("textarea").forEach(t => {
    t.addEventListener("input", () => {
      state.data.fields[t.id] = t.value;
      saveState();
      document.querySelectorAll("[data-saved]").forEach(s => s.textContent = "บันทึกในเครื่องนี้แล้ว");
    });
  });
}

function toggleDone(id, checked) {
  state.data.done[id] = checked;
  saveState();
}

function copyPrompt(id) {
  const node = document.getElementById("txt-" + id);
  navigator.clipboard.writeText(node ? node.textContent : "").then(() => {
    const btn = event && event.target;
    if (btn) {
      const old = btn.textContent;
      btn.textContent = "คัดลอกแล้ว";
      setTimeout(() => btn.textContent = old, 1200);
    }
  });
}

function exportWorkbook() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "car-ai-workbook.json";
  a.click();
}

function resetWorkbook() {
  if (!confirm("ล้างใบงานและความคืบหน้าในเครื่องนี้?")) return;
  state.data = { fields: {}, done: {} };
  saveState();
  render();
}

function openSide() {
  $("#side").classList.add("open");
  $("#overlay").classList.add("show");
}
function closeSide() {
  $("#side").classList.remove("open");
  $("#overlay").classList.remove("show");
}

window.go = go;
window.copyPrompt = copyPrompt;
window.toggleDone = toggleDone;
window.exportWorkbook = exportWorkbook;
window.resetWorkbook = resetWorkbook;
window.openSide = openSide;
window.closeSide = closeSide;

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  renderProgress();
  markNavDone();
  if (!location.hash) location.hash = "#/home";
  else render();
});
