
async function updateMinecraftStatus() {
  const count = document.getElementById("playerCount");
  const status = document.getElementById("mcStatus");
  const dot = document.getElementById("mcStatusDot");

  if (!count || !status || !dot) return;

  status.textContent = "Checking server...";
  dot.classList.remove("status-green", "status-red");

  try {
    const response = await fetch(
      `https://api.mcsrvstat.us/3/${encodeURIComponent(SERVER_IP)}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    if (data.online === true) {
      count.textContent = (data.players?.online ?? 0).toLocaleString();
      status.textContent = "Server Online";
      dot.classList.add("status-green");
    } else if (data.online === false) {
      count.textContent = "--";
      status.textContent = "Status check failed";
    } else {
      count.textContent = "--";
      status.textContent = "Status unavailable";
    }
  } catch (error) {
    count.textContent = "--";
    status.textContent = "Status unavailable";
    console.error("Minecraft status error:", error);
  }
}
