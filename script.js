
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");
const copyMessage = document.querySelector("#copy-message");
const serverIP = "eventmc.xyz";
const discordServerID = "1376889958714970192";

// Mobile navigation
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.textContent = isOpen ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

// Copy server IP
document.querySelectorAll(".copy-ip").forEach(button => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(serverIP);
      if (copyMessage) copyMessage.textContent = "✓ Server IP copied!";
      button.textContent = "✓ IP Copied!";
    } catch {
      window.prompt("Copy EventMC server IP:", serverIP);
      if (copyMessage) copyMessage.textContent = "Server IP: " + serverIP;
    }

    setTimeout(() => {
      button.textContent =
        button.classList.contains("copy-ip") &&
        button.closest(".join") ? "Copy IP" : "Copy Server IP";
    }, 2500);
  });
});

// Copyright year
const yearElement = document.querySelector("#year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Minecraft server status and players
async function updateMinecraftPlayers() {
  const count = document.querySelector("#mc-players");
  const status = document.querySelector("#mc-status");
  const badge = document.querySelector("#mc-status-badge");

  if (!count || !status || !badge) return;

  try {
    const response = await fetch(
      "https://api.mcsrvstat.us/3/eventmc.xyz"
    );

    if (!response.ok) throw new Error("API unavailable");

    const data = await response.json();

    if (data.online === true) {
      count.textContent = data.players?.online ?? 0;
      status.textContent = "Players currently online";
      badge.className = "status-badge online";
      badge.textContent = "● ONLINE";
    } else {
      count.textContent = "0";
      status.textContent = "Server is currently offline";
      badge.className = "status-badge offline";
      badge.textContent = "● OFFLINE";
    }
  } catch {
    count.textContent = "--";
    status.textContent = "Unable to check server";
    badge.className = "status-badge checking";
    badge.textContent = "UNKNOWN";
  }
}

// Discord online members
async function updateDiscordOnline() {
  const count = document.querySelector("#discord-online");
  const status = document.querySelector("#discord-status");

  if (!count || !status) return;

  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${discordServerID}/widget.json`
    );

    if (!response.ok) throw new Error("Discord widget unavailable");

    const data = await response.json();

    if (typeof data.presence_count !== "number") {
      throw new Error("Online count unavailable");
    }

    count.textContent = `${data.presence_count} online`;
    status.textContent = "Discord online members";
  } catch {
    count.textContent = "-- online";
    status.textContent = "Discord widget unavailable";
  }
}

updateMinecraftPlayers();
updateDiscordOnline();

setInterval(updateMinecraftPlayers, 5 * 60 * 1000);
setInterval(updateDiscordOnline, 60 * 1000);
