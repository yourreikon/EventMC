
"use strict";

const SERVER_IP = "eventmc.xyz";
const STATUS_HOST = "gcore.eventmc.xyz:25502";
const DISCORD_SERVER_ID = "1376889958714970192";
const DISCORD_INVITE = "https://discord.gg/d8NJ4SGXV";

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("nav-open");
    menuToggle.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      menuToggle.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Copy Minecraft server IP
const copyButton = document.getElementById("copyIp");
const copyMessage = document.getElementById("copyMessage");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);

      if (copyMessage) {
        copyMessage.textContent = "Server IP copied!";
      }
    } catch {
      if (copyMessage) {
        copyMessage.textContent = "Server IP: " + SERVER_IP;
      }
    }

    window.setTimeout(() => {
      if (copyMessage) copyMessage.textContent = "";
    }, 3000);
  });
}

// Footer year
const yearElement = document.getElementById("currentYear");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Minecraft live status
async function updateMinecraftStatus() {
  const count = document.getElementById("playerCount");
  const status = document.getElementById("mcStatus");
  const dot = document.getElementById("mcStatusDot");

  if (!count || !status || !dot) return;

  try {
    const response = await fetch(
      `https://api.mcsrvstat.us/3/${encodeURIComponent(STATUS_HOST)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Minecraft status API request failed");
    }

    const data = await response.json();

    if (data.online === true) {
      count.textContent =
        (data.players?.online ?? 0).toLocaleString();

      status.textContent = "Server Online";
      dot.classList.add("status-green");
      dot.classList.remove("status-red");
    } else {
      count.textContent = "--";
      status.textContent = "Status unavailable";
      dot.classList.remove("status-green", "status-red");
    }
  } catch (error) {
    count.textContent = "--";
    status.textContent = "Status unavailable";
    dot.classList.remove("status-green", "status-red");

    console.error("Minecraft status error:", error);
  }
}

// Discord online member count
async function updateDiscordStatus() {
  const count = document.getElementById("discordCount");
  const status = document.getElementById("discordStatus");

  if (!count || !status) return;

  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Discord widget unavailable");
    }

    const data = await response.json();

    if (typeof data.presence_count !== "number") {
      throw new Error("Discord online count unavailable");
    }

    count.textContent = data.presence_count.toLocaleString();
    status.textContent = "Members currently online";
  } catch (error) {
    count.textContent = "--";
    status.textContent = "Enable Discord Server Widget";

    console.error("Discord status error:", error);
  }
}

// Staff avatar fallback
document.querySelectorAll(".staff-avatar").forEach(img => {
  img.addEventListener("error", () => {
    console.warn("Staff DP not found:", img.getAttribute("src"));
    img.classList.add("avatar-missing");
    img.alt = "Staff avatar unavailable";
  });
});

// Initial status checks
updateMinecraftStatus();
updateDiscordStatus();

// Refresh status automatically
window.setInterval(updateMinecraftStatus, 60000);
window.setInterval(updateDiscordStatus, 60000);
