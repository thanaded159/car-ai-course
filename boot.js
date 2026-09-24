(async function boot() {
  const names = ["app.part1.js.txt", "app.part2.js.txt", "app.part3.js.txt"];
  const parts = await Promise.all(names.map((f) => fetch(f).then((r) => {
    if (!r.ok) throw new Error("โหลด " + f + " ไม่สำเร็จ");
    return r.text();
  })));
  const s = document.createElement("script");
  s.textContent = parts.join("");
  document.body.appendChild(s);
})().catch((err) => {
  const view = document.getElementById("view");
  if (view) view.innerHTML = "<section class='hero'><h2>โหลดบทเรียนไม่สำเร็จ</h2><p>" + err.message + "</p></section>";
});
