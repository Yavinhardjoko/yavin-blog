const internalNavigationParameter = "__yavin_internal";
const incomingUrl = new URL(window.location.href);
let isInternalNavigation = incomingUrl.searchParams.has(internalNavigationParameter);
incomingUrl.searchParams.delete(internalNavigationParameter);
if (isInternalNavigation) {
  window.history.replaceState(window.history.state, "", incomingUrl.href);
}
try {
  if (document.referrer) {
    isInternalNavigation = isInternalNavigation ||
      new URL(document.referrer).origin === window.location.origin;
  }
} catch (error) {
  console.error("Unable to determine the page navigation source:", error);
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a[href]");
  if (!link || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      link.target === "_blank" || link.hasAttribute("download")) return;

  const targetUrl = new URL(link.href, window.location.href);
  if (targetUrl.origin !== window.location.origin ||
      (targetUrl.pathname === window.location.pathname &&
       targetUrl.search === window.location.search)) return;

  targetUrl.searchParams.set(internalNavigationParameter, "1");
  link.href = targetUrl.href;
}, { capture: true });

if (!isInternalNavigation) {
  const pageLoader = document.createElement("div");
  pageLoader.className = "site-loader";
  pageLoader.setAttribute("role", "status");
  pageLoader.setAttribute("aria-live", "polite");
  pageLoader.innerHTML = `
    <div class="site-loader-content">
      <div class="site-loader-universe" aria-hidden="true">
        <span class="site-loader-star star-one"></span>
        <span class="site-loader-star star-two"></span>
        <span class="site-loader-star star-three"></span>
        <span class="site-loader-orbit orbit-one"><span class="site-loader-planet planet-one"></span></span>
        <span class="site-loader-orbit orbit-two"><span class="site-loader-planet planet-two"></span></span>
        <span class="site-loader-orbit orbit-three"><span class="site-loader-planet planet-three"></span></span>
        <span class="site-loader-orbit orbit-four"><span class="site-loader-planet planet-four"></span></span>
        <span class="site-loader-sun"></span>
      </div>
      <p>Memuat halaman web...</p>
    </div>
  `;
  document.documentElement.classList.add("is-loading");
  document.body.prepend(pageLoader);

  const loaderStartedAt = Date.now();
  let loaderFinished = false;
  let loaderFallbackTimer;
  const finishPageLoading = () => {
    if (loaderFinished) return;
    loaderFinished = true;
    window.clearTimeout(loaderFallbackTimer);
    const remainingDisplayTime = Math.max(0, 800 - (Date.now() - loaderStartedAt));
    window.setTimeout(() => {
      pageLoader.classList.add("is-hidden");
      document.documentElement.classList.remove("is-loading");
      window.setTimeout(() => pageLoader.remove(), 400);
    }, remainingDisplayTime);
  };

  window.addEventListener("load", finishPageLoading, { once: true });
  loaderFallbackTimer = window.setTimeout(finishPageLoading, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  // Current year in the footer.
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const discordChat = document.createElement("aside");
  discordChat.className = "discord-chat";
  discordChat.setAttribute("aria-label", "Chat Yavin di Discord");
  discordChat.innerHTML = `
    <section class="discord-chat-card" data-discord-chat-card aria-labelledby="discord-chat-title" hidden>
      <button class="discord-chat-close" type="button" data-discord-chat-close aria-label="Minimalkan chat Discord">×</button>
      <div class="discord-chat-banner" aria-hidden="true">
        <video class="discord-chat-banner-media" autoplay loop muted playsinline poster="" tabindex="-1">
          <source data-discord-chat-banner-source type="video/mp4">
        </video>
        <span>YAVIN / DISCORD PROFILE</span>
      </div>
      <div class="discord-chat-profile" data-discord-chat-profile>
        <div class="discord-chat-avatar-wrap">
          <img class="discord-chat-avatar" data-discord-chat-avatar alt="Discord profile avatar" hidden>
          <span class="discord-chat-status" data-discord-chat-status></span>
        </div>
        <div class="discord-chat-profile-info">
          <h2 id="discord-chat-title" data-discord-chat-name>yppnnn</h2>
          <p data-discord-chat-handle>@yppnnn</p>
          <p class="discord-chat-presence" data-discord-chat-presence>Connecting to Discord...</p>
        </div>
      </div>
      <p class="discord-chat-activity" data-discord-chat-activity hidden></p>
      <a class="discord-chat-link" href="https://discord.com/users/682586561791131687" target="_blank" rel="noopener noreferrer">
        Chat sekarang <span aria-hidden="true">↗</span>
      </a>
    </section>
    <div class="discord-chat-online-bubble" data-discord-chat-online-bubble role="status" aria-live="polite" hidden>
      <span data-discord-chat-online-message></span><span class="discord-chat-typing-cursor" aria-hidden="true"></span>
    </div>
    <button class="discord-chat-launcher" type="button" data-discord-chat-open aria-label="Buka chat Discord Yavin" aria-expanded="false">
      <img class="discord-chat-launcher-avatar" data-discord-chat-launcher-avatar alt="" hidden>
    </button>
  `;
  document.body.append(discordChat);

  const discordChatCard = discordChat.querySelector("[data-discord-chat-card]");
  const discordChatClose = discordChat.querySelector("[data-discord-chat-close]");
  const discordChatOpen = discordChat.querySelector("[data-discord-chat-open]");
  const discordChatProfile = discordChat.querySelector("[data-discord-chat-profile]");
  const discordChatAvatar = discordChat.querySelector("[data-discord-chat-avatar]");
  const discordChatLauncherAvatar = discordChat.querySelector("[data-discord-chat-launcher-avatar]");
  const discordChatOnlineBubble = discordChat.querySelector("[data-discord-chat-online-bubble]");
  const discordChatOnlineMessage = discordChat.querySelector("[data-discord-chat-online-message]");
  const discordChatBanner = discordChat.querySelector(".discord-chat-banner-media");
  const mainScript = document.querySelector('script[src*="assets/js/main.js"]');
  if (mainScript) {
    const assetsUrl = new URL("../images/", mainScript.src);
    discordChatBanner.poster = new URL("discord-banner-poster.png", assetsUrl).href;
    discordChatBanner.querySelector("source").src = new URL("discord-banner.mp4", assetsUrl).href;
    discordChatBanner.load();
  }
  const discordChatName = discordChat.querySelector("[data-discord-chat-name]");
  const discordChatHandle = discordChat.querySelector("[data-discord-chat-handle]");
  const discordChatPresence = discordChat.querySelector("[data-discord-chat-presence]");
  const discordChatStatus = discordChat.querySelector("[data-discord-chat-status]");
  const discordChatActivity = discordChat.querySelector("[data-discord-chat-activity]");
  const discordProfile = document.querySelector("[data-discord-profile]");
  if (discordProfile) {
    const fallbackAvatar = discordProfile.querySelector(".discord-avatar").src;
    const recoverAvatarOnError = (image) => {
      image.addEventListener("error", () => {
        if (image.src === fallbackAvatar) {
          console.error("Unable to load the fallback Discord avatar:", fallbackAvatar);
          return;
        }
        image.src = fallbackAvatar;
      });
    };
    recoverAvatarOnError(discordProfile.querySelector(".discord-avatar"));
    recoverAvatarOnError(discordChatAvatar);
    recoverAvatarOnError(discordChatLauncherAvatar);
  }
  let discordChatBubbleTimer = null;
  let discordChatBubbleEnabled = true;
  let discordChatTypingTimer = null;
  let discordChatBubbleMessage = "";
  let discordChatBubblePhase = null;
  const discordChatReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const typeDiscordChatMessage = (message) => {
    if (discordChatTypingTimer !== null) {
      window.clearTimeout(discordChatTypingTimer);
      discordChatTypingTimer = null;
    }
    discordChatBubbleMessage = message;
    discordChatOnlineBubble.setAttribute("aria-label", message);
    const characters = Array.from(message);
    if (discordChatReducedMotion) {
      discordChatOnlineMessage.textContent = message;
      return;
    }

    discordChatOnlineMessage.textContent = "";
    let characterIndex = 0;
    const typeNextCharacter = () => {
      discordChatOnlineMessage.textContent += characters[characterIndex];
      characterIndex += 1;
      if (characterIndex < characters.length) {
        discordChatTypingTimer = window.setTimeout(typeNextCharacter, 65);
      } else {
        discordChatTypingTimer = null;
      }
    };
    if (characters.length > 0) typeNextCharacter();
  };
  const updateOnlineBubble = () => {
    const messages = {
      online: "Yavin sedang online sekarang!",
      idle: "Sebentar lagi Yavin kembali!",
      dnd: "Yavin sedang sibuk 😔",
      offline: "Yavin sedang offline."
    };
    const message = messages[discordChatStatus.dataset.status];
    if (!message || !discordChatCard.hidden || !discordChatBubbleEnabled) {
      if (discordChatBubbleTimer !== null) {
        window.clearTimeout(discordChatBubbleTimer);
        discordChatBubbleTimer = null;
      }
      if (discordChatTypingTimer !== null) {
        window.clearTimeout(discordChatTypingTimer);
        discordChatTypingTimer = null;
      }
      discordChatBubblePhase = null;
      discordChatBubbleMessage = "";
      discordChatOnlineMessage.textContent = "";
      discordChatOnlineBubble.hidden = true;
      return;
    }

    if (discordChatBubbleTimer !== null) {
      if (discordChatBubblePhase === "visible" && discordChatBubbleMessage !== message) {
        typeDiscordChatMessage(message);
      }
      return;
    }

    discordChatOnlineBubble.hidden = false;
    discordChatBubblePhase = "visible";
    typeDiscordChatMessage(message);
    discordChatBubbleTimer = window.setTimeout(() => {
      discordChatOnlineBubble.hidden = true;
      discordChatBubblePhase = "waiting";
      discordChatBubbleTimer = window.setTimeout(() => {
        discordChatBubbleTimer = null;
        discordChatBubblePhase = null;
        updateOnlineBubble();
      }, 5 * 1000);
    }, 5 * 1000);
  };
  if (discordProfile) {
    const syncDiscordChatProfile = () => {
      const profileAvatar = discordProfile.querySelector(".discord-avatar");
      const profileName = discordProfile.querySelector("[data-discord-name]");
      const profileHandle = discordProfile.querySelector("[data-discord-handle]");
      const profilePresence = discordProfile.querySelector("[data-discord-presence]");
      const profileStatus = discordProfile.querySelector("[data-discord-status-dot]");
      const profileActivity = discordProfile.querySelector("[data-discord-activity]");

      if (profileAvatar?.getAttribute("src")) {
        discordChatAvatar.src = profileAvatar.src;
        discordChatAvatar.hidden = false;
        discordChatLauncherAvatar.src = profileAvatar.src;
        discordChatLauncherAvatar.hidden = false;
      }
      if (profileName) discordChatName.textContent = profileName.textContent;
      if (profileHandle) discordChatHandle.textContent = profileHandle.textContent;
      if (profilePresence) {
        discordChatPresence.textContent = profilePresence.textContent;
        discordChatPresence.dataset.status = profilePresence.dataset.status || "unavailable";
      }
      if (profileStatus?.dataset.status) {
        discordChatStatus.dataset.status = profileStatus.dataset.status;
        discordChatProfile.dataset.status = profileStatus.dataset.status;
        discordChatOpen.dataset.status = profileStatus.dataset.status;
        updateOnlineBubble();
      }
      if (profileActivity) {
        discordChatActivity.textContent = profileActivity.textContent;
        discordChatActivity.hidden = profileActivity.hidden;
      }
    };

    syncDiscordChatProfile();
    const profileObserver = new MutationObserver(syncDiscordChatProfile);
    profileObserver.observe(discordProfile, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  } else {
    const userId = "682586561791131687";
    const assetsUrl = mainScript ? new URL("../images/", mainScript.src) : null;
    const fallbackAvatar = assetsUrl
      ? new URL("avatar-placeholder.svg", assetsUrl).href
      : "";
    const setWidgetAvatar = (avatarUrl) => {
      discordChatAvatar.src = avatarUrl || fallbackAvatar;
      discordChatAvatar.hidden = false;
      discordChatLauncherAvatar.src = avatarUrl || fallbackAvatar;
      discordChatLauncherAvatar.hidden = false;
    };

    setWidgetAvatar(fallbackAvatar);
    discordChatStatus.dataset.status = "unavailable";
    discordChatProfile.dataset.status = "unavailable";
    discordChatOpen.dataset.status = "unavailable";

    const updateStandaloneDiscordProfile = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${encodeURIComponent(userId)}`);
        if (response.status === 404) {
          discordChatName.textContent = "yppnnn";
          discordChatHandle.textContent = "@yppnnn";
          discordChatPresence.textContent = "Discord status unavailable";
          discordChatPresence.dataset.status = "unavailable";
          discordChatStatus.dataset.status = "unavailable";
          discordChatProfile.dataset.status = "unavailable";
          discordChatOpen.dataset.status = "unavailable";
          setWidgetAvatar(fallbackAvatar);
          discordChatActivity.hidden = true;
          updateOnlineBubble();
          return;
        }
        if (!response.ok) throw new Error(`Lanyard returned HTTP ${response.status}`);
        const result = await response.json();
        if (!result.success || !result.data?.discord_user) {
          throw new Error("Lanyard returned an invalid Discord profile.");
        }

        const { discord_user: user, discord_status: presenceStatus, activities = [] } = result.data;
        const status = ["online", "idle", "dnd", "offline"].includes(presenceStatus)
          ? presenceStatus
          : "offline";
        discordChatName.textContent = user.global_name || user.username || "Discord user";
        discordChatHandle.textContent = user.username ? `@${user.username}` : "Discord profile";
        discordChatPresence.textContent = {
          online: "Online",
          idle: "Idle",
          dnd: "Do not disturb",
          offline: "Offline"
        }[status];
        discordChatPresence.dataset.status = status;
        discordChatStatus.dataset.status = status;
        discordChatProfile.dataset.status = status;
        discordChatOpen.dataset.status = status;

        const avatarUrl = user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
          : fallbackAvatar;
        setWidgetAvatar(avatarUrl);

        const activity = activities.find((item) => item.name !== "Custom Status");
        discordChatActivity.textContent = activity ? `Playing ${activity.name}` : "";
        discordChatActivity.hidden = !activity;
        updateOnlineBubble();
      } catch (error) {
        console.error("Unable to load the Discord chat profile:", error);
        discordChatPresence.textContent = "Could not connect to Discord";
        discordChatPresence.dataset.status = "unavailable";
        discordChatStatus.dataset.status = "unavailable";
        discordChatProfile.dataset.status = "unavailable";
        discordChatOpen.dataset.status = "unavailable";
        setWidgetAvatar(fallbackAvatar);
        discordChatActivity.hidden = true;
        updateOnlineBubble();
      }
    };

    const recoverWidgetAvatar = (image) => {
      image.addEventListener("error", () => {
        if (image.src === fallbackAvatar) {
          console.error("Unable to load the fallback Discord avatar:", fallbackAvatar);
          return;
        }
        image.src = fallbackAvatar;
      });
    };
    recoverWidgetAvatar(discordChatAvatar);
    recoverWidgetAvatar(discordChatLauncherAvatar);
    updateStandaloneDiscordProfile();
    window.setInterval(() => {
      if (!document.hidden) updateStandaloneDiscordProfile();
    }, 30000);
  }
  const animateElement = (element, className, animationName, onComplete) => {
    if (discordChatReducedMotion) {
      onComplete();
      return;
    }

    const handleAnimationEnd = (event) => {
      if (event.target !== element || event.animationName !== animationName) return;
      element.removeEventListener("animationend", handleAnimationEnd);
      element.classList.remove(className);
      onComplete();
    };
    element.addEventListener("animationend", handleAnimationEnd);
    element.classList.add(className);
  };
  discordChatClose.addEventListener("click", () => {
    if (discordChatCard.classList.contains("is-closing")) return;
    animateElement(discordChatCard, "is-closing", "discord-chat-close", () => {
      discordChatCard.hidden = true;
      discordChatOpen.hidden = false;
      discordChatOpen.setAttribute("aria-expanded", "false");
      discordChatBubbleEnabled = true;
      updateOnlineBubble();
      animateElement(discordChatOpen, "is-appearing", "discord-chat-appear", () => {});
    });
  });
  discordChatOpen.addEventListener("click", () => {
    if (discordChatOpen.classList.contains("is-appearing")) return;
    discordChatOpen.hidden = true;
    discordChatOpen.setAttribute("aria-expanded", "true");
    discordChatCard.hidden = false;
    updateOnlineBubble();
    animateElement(discordChatCard, "is-opening", "discord-chat-open", () => {});
  });

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
