document.addEventListener("DOMContentLoaded", () => {
  // Current year in the footer.
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const discordProfile = document.querySelector("[data-discord-profile]");
  if (discordProfile) {
    const userId = discordProfile.dataset.userId;
    const avatar = discordProfile.querySelector(".discord-avatar");
    const name = discordProfile.querySelector("[data-discord-name]");
    const handle = discordProfile.querySelector("[data-discord-handle]");
    const presence = discordProfile.querySelector("[data-discord-presence]");
    const activity = discordProfile.querySelector("[data-discord-activity]");
    const statusDot = discordProfile.querySelector("[data-discord-status-dot]");
    const updated = discordProfile.querySelector("[data-discord-updated]");
    const liveLabel = discordProfile.querySelector("[data-discord-live-label]");
    const liveText = discordProfile.querySelector("[data-discord-live-text]");
    const setupLink = discordProfile.querySelector("[data-discord-setup-link]");
    const fallbackAvatar = avatar.src;
    const lastOnlineStorageKey = `yavin-discord-last-online-${userId}`;
    const lastGameStorageKey = `yavin-discord-last-game-${userId}`;
    const statuses = {
      online: "Online",
      idle: "Idle",
      dnd: "Do not disturb",
      offline: "Offline"
    };
    const readLastOnline = () => {
      try {
        const timestamp = Number(localStorage.getItem(lastOnlineStorageKey));
        return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
      } catch (error) {
        console.error("Unable to read the last Discord online time:", error);
        return null;
      }
    };
    const rememberOnline = (timestamp) => {
      try {
        localStorage.setItem(lastOnlineStorageKey, String(timestamp));
      } catch (error) {
        console.error("Unable to save the last Discord online time:", error);
      }
    };
    const readLastGame = () => {
      try {
        return localStorage.getItem(lastGameStorageKey);
      } catch (error) {
        console.error("Unable to read the last Discord game:", error);
        return null;
      }
    };
    const rememberLastGame = (gameName) => {
      try {
        localStorage.setItem(lastGameStorageKey, gameName);
      } catch (error) {
        console.error("Unable to save the last Discord game:", error);
      }
    };
    const formatLastOnline = (timestamp) => {
      const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
      if (minutes < 60) return `Online ${minutes} menit lalu`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `Online ${hours} jam lalu`;
      const days = Math.floor(hours / 24);
      return `Online ${days} hari lalu`;
    };

    const updateDiscordProfile = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${encodeURIComponent(userId)}`);
        if (response.status === 404) {
          presence.textContent = "Join the Lanyard Discord server to enable live presence.";
          presence.dataset.status = "unavailable";
          statusDot.dataset.status = "unavailable";
          discordProfile.dataset.status = "unavailable";
          liveLabel.dataset.state = "unavailable";
          liveText.textContent = "NOT CONNECTED";
          setupLink.hidden = false;
          activity.hidden = true;
          updated.textContent = "Not connected to Lanyard";
          return;
        }
        if (!response.ok) throw new Error(`Lanyard returned HTTP ${response.status}`);
        const result = await response.json();
        if (!result.success || !result.data || !result.data.discord_user) {
          presence.textContent = "Join the Lanyard Discord server to enable live presence.";
          presence.dataset.status = "unavailable";
          statusDot.dataset.status = "unavailable";
          discordProfile.dataset.status = "unavailable";
          liveLabel.dataset.state = "unavailable";
          liveText.textContent = "NOT CONNECTED";
          setupLink.hidden = false;
          activity.hidden = true;
          updated.textContent = "Not connected to Lanyard";
          return;
        }

        const data = result.data;
        const user = data.discord_user;
        const status = statuses[data.discord_status] ? data.discord_status : "offline";
        const isOffline = status === "offline";
        if (status === "online") rememberOnline(Date.now());
        const lastOnline = isOffline ? readLastOnline() : null;
        discordProfile.dataset.status = status;
        liveLabel.dataset.state = status;
        liveText.textContent = status === "idle" ? "IDLE" : status === "dnd" ? "DND" : isOffline ? "OFFLINE" : "LIVE";
        setupLink.hidden = true;
        const avatarUrl = user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
          : "";
        name.textContent = user.global_name || user.username || "Discord user";
        handle.textContent = user.username ? `@${user.username}` : "Discord profile";
        presence.textContent = isOffline
          ? lastOnline ? formatLastOnline(lastOnline) : "Offline"
          : statuses[status];
        presence.dataset.status = status;
        statusDot.dataset.status = status;
        if (avatarUrl) {
          avatar.src = avatarUrl;
        } else {
          avatar.src = fallbackAvatar;
        }

        const currentActivity = (data.activities || []).find((item) => item.name !== "Custom Status");
        const currentGame = (data.activities || []).find((item) => item.type === 0 && item.name);
        const customStatus = (data.activities || []).find((item) => item.name === "Custom Status");
        if (currentGame) rememberLastGame(currentGame.name);
        const lastGame = currentGame ? currentGame.name : readLastGame();
        const activityText = isOffline
          ? lastGame ? `Last played: ${lastGame}` : "Last game: Not detected yet"
          : currentGame
            ? `Playing ${currentGame.name}`
            : currentActivity
          ? `Playing ${currentActivity.name}`
          : customStatus && (customStatus.state || customStatus.emoji?.name)
            ? `Status: ${[customStatus.emoji?.name, customStatus.state].filter(Boolean).join(" ")}`
            : "";
        activity.textContent = activityText;
        activity.hidden = !activityText;
        updated.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      } catch (error) {
        console.error("Unable to load Discord presence:", error);
        presence.textContent = "Could not connect to Lanyard. Please try again shortly.";
        presence.dataset.status = "unavailable";
        statusDot.dataset.status = "unavailable";
        discordProfile.dataset.status = "unavailable";
        liveLabel.dataset.state = "unavailable";
        liveText.textContent = "UNAVAILABLE";
        setupLink.hidden = true;
        activity.hidden = true;
        updated.textContent = "Could not refresh";
      }
    };

    avatar.addEventListener("error", () => {
      avatar.src = fallbackAvatar;
    }, { once: true });
    updateDiscordProfile();
    window.setInterval(() => {
      if (!document.hidden) updateDiscordProfile();
    }, 30000);
  }

  // Scroll progress is a tiny visual cue in the header.
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  // Reveal content as it enters the viewport. Keep everything visible if unsupported.
  const revealTargets = document.querySelectorAll(
    ".hero-copy > *, .section-heading, .article-card, .interests-inner > *, .contact-section > *, .inner-page > *, .about-layout > *, .article-page > *"
  );
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((element, index) => {
      element.classList.add("js-reveal");
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
    });
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach((element) => observer.observe(element));
  }

  // Subtle pointer-controlled 3D tilt for the profile card and article artwork.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".profile-card, .article-art").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 9;
        const rotateX = (0.5 - y) * 8;
        const base = card.classList.contains("profile-card") ? "rotate(1.2deg) " : "";
        card.style.transform = `${base}rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Water-rise transition: the current page sinks and its lettering recedes before navigation.
  const transition = document.querySelector(".page-transition");
  if (transition && !reducedMotion) {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank" ||
          link.hasAttribute("download") || href.startsWith("mailto:") ||
          href.startsWith("tel:") || link.origin !== window.location.origin) return;
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
            event.button !== 0) return;
        const targetUrl = new URL(link.href, window.location.href);
        if (targetUrl.pathname === window.location.pathname &&
            targetUrl.search === window.location.search && targetUrl.hash) return;
        event.preventDefault();
        document.body.classList.add("is-transitioning");
        transition.classList.add("is-leaving");
        window.setTimeout(() => { window.location.href = link.href; }, 680);
      });
    });
  }
});
