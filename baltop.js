/* EventMC Baltop renderer — reads only the manually verified data file. */
(() => {
  const data = window.EVENTMC_BALTOP || { players: [], updatedAt: "" };
  const players = Array.isArray(data.players) ? data.players : [];
  const status = document.getElementById("baltopStatus");
  const updated = document.getElementById("baltopUpdated");
  const podium = document.querySelector(".wealth-podium");
  const rest = document.querySelector(".wealth-rest");
  const money = value => Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const valid = players.length === 8 && players.every(p => p && typeof p.name === "string" && p.name.trim() && Number.isFinite(Number(p.balance)) && Number(p.balance) >= 0);

  if (!valid) {
    if (podium) podium.hidden = true;
    if (rest) rest.hidden = true;
    if (status) status.textContent = players.length ? "Leaderboard data is incomplete. Please publish all 8 verified players." : "No leaderboard data published yet. Check the real /baltop 1 results and update baltop-data.js.";
    return;
  }

  const top = players.slice(0, 3);
  // Layout order is silver-left, champion-center, bronze-right.
  [[2, top[1]], [1, top[0]], [3, top[2]]].forEach(([slot, player]) => {
    document.getElementById(`wealthName${slot}`).textContent = player.name.trim();
    document.getElementById(`wealthBalance${slot}`).textContent = money(player.balance);
  });
  document.getElementById("wealthList").innerHTML = players.slice(3).map(player =>
    `<article class="wealth-row"><span class="wealth-player">${escapeHtml(player.name.trim())}</span><span class="wealth-row-balance">${money(player.balance)} <small>coins</small></span></article>`
  ).join("");
  if (status) status.textContent = "Showing the latest manually verified EventMC balance leaderboard.";
  if (updated) updated.textContent = data.updatedAt ? `Last updated: ${data.updatedAt}` : "Last updated time not provided.";
})();

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[char]);
}
