
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");

// Mobile navigation
if (menuButton && nav) {
  menuButton.setAttribute("aria-expanded", "false");

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

// Copy Minecraft server IP
async function copyIP() {
  const message = document.getElementById("copy-message");

  try {
    await navigator.clipboard.writeText("eventmc.xyz");
    if (message) message.textContent = "✓ Server IP copied!";
  } catch (error) {
    window.prompt("Copy the EventMC server IP:", "eventmc.xyz");
    if (message) message.textContent = "Server IP: eventmc.xyz";
  }
}

// Automatic copyright year
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ===================================
// EVENTMC LIVE MINECRAFT PLAYER COUNT
// ===================================


async function updateMinecraftPlayers() {
  const count = document.getElementById("mc-players");
  const status = document.getElementById("mc-status");
  const badge = document.getElementById("mc-status-badge");

  if (!count || !status || !badge) return;

  // Default while checking
  badge.className = "status-badge checking";
  badge.textContent = "CHECKING";
  status.textContent = "Checking server...";

  try {
    const response = await fetch(
      "https://api.mcsrvstat.us/3/eventmc.xyz"
    );

    if (!response.ok) {
      throw new Error("Status API unavailable");
    }

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
  } catch (error) {
    count.textContent = "--";
    status.textContent = "Unable to check server";
    badge.className = "status-badge checking";
    badge.textContent = "UNKNOWN";
  }
}


// ===================================
// EVENTMC DISCORD ONLINE MEMBERS
// ===================================

const DISCORD_SERVER_ID = "1376889958714970192";

async function updateDiscordOnline() {
  const count = document.getElementById("discord-online");
  const status = document.getElementById("discord-status");

  if (!count || !status) return;

  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`
    );

    if (!response.ok) {
      throw new Error("Discord widget unavailable");
    }

    const data = await response.json();

    if (typeof data.presence_count !== "number") {
      throw new Error("Online count unavailable");
    }

    count.textContent = `${data.presence_count} online`;
    status.textContent = "Discord online members";
  } catch (error) {
    count.textContent = "-- online";
    status.textContent = "Enable Discord Widget";
  }
}

// Initial update
updateMinecraftPlayers();
updateDiscordOnline();

// Automatic refresh
setInterval(updateMinecraftPlayers, 5 * 60 * 1000);
setInterval(updateDiscordOnline, 60 * 1000);
