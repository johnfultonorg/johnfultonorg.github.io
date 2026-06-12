(function () {
  const SAMPLE_WORDS = [
    { text: "Cybersecurity", weight: 10 },
    { text: "Teaching", weight: 9 },
    { text: "Python", weight: 8 },
    { text: "Networks", weight: 7 },
    { text: "Analytics", weight: 7 },
    { text: "Mentoring", weight: 6 },
    { text: "Web Development", weight: 6 },
    { text: "Leadership", weight: 5 }
  ];

  const CLOUD_COLORS = ["#1f5a8f", "#2d6f5a", "#8a5a00", "#5a3f8f", "#0d4a72", "#7a2938"];

  function parseGvizPayload(rawText) {
    const match = rawText.match(/google\.visualization\.Query\.setResponse\((.*)\);?\s*$/s);
    if (!match || !match[1]) {
      throw new Error("Unrecognized Google Visualization response format.");
    }
    return JSON.parse(match[1]);
  }

  function normalizeWords(words) {
    return words
      .map((item) => ({
        text: String(item.text || "").trim(),
        weight: Number(item.weight) || 1
      }))
      .filter((item) => item.text.length > 0 && item.weight > 0);
  }

  function hashText(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function generatedWeightFromText(text) {
    const hash = hashText(text.toLowerCase());
    // Stable pseudo-random weight in the range 3..10.
    return 3 + (hash % 8);
  }

  function rowsToWords(rows) {
    return rows
      .map((row) => {
        const cells = row.c || [];
        const text = cells[0] && cells[0].v ? String(cells[0].v).trim() : "";
        const rawWeight = cells[1] && cells[1].v ? Number(cells[1].v) : NaN;
        return {
          text: text,
          weight: Number.isFinite(rawWeight) && rawWeight > 0 ? rawWeight : generatedWeightFromText(text)
        };
      })
      .filter((word) => word.text.trim().length > 0);
  }

  function parseCsv(csvText) {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return [];
    }

    return lines
      .slice(1)
      .map((line) => {
        const pieces = line.split(",");
        const text = (pieces[0] || "").replace(/^"|"$/g, "").trim();
        const parsed = Number((pieces[1] || "").replace(/^"|"$/g, "").trim());
        return {
          text: text,
          weight: Number.isFinite(parsed) && parsed > 0 ? parsed : generatedWeightFromText(text)
        };
      })
      .filter((item) => item.text.length > 0);
  }

  function scaleWordsForLibrary(words) {
    const normalized = normalizeWords(words);
    if (normalized.length === 0) {
      return [];
    }

    const wordCount = normalized.length;
    const minFont = wordCount > 30 ? 12 : wordCount > 20 ? 13 : 15;
    const maxFont = wordCount > 30 ? 34 : wordCount > 20 ? 40 : 50;

    const maxWeight = normalized.reduce((max, item) => Math.max(max, item.weight), 1);
    const minWeight = normalized.reduce((min, item) => Math.min(min, item.weight), maxWeight);

    if (maxWeight === minWeight) {
      // If all weights are the same (common with one-column sheets), keep sizes moderate
      // so more terms can fit and remain visible.
      const pattern = [maxFont, maxFont - 4, maxFont - 7, maxFont - 10, maxFont - 13, maxFont - 16];
      return normalized.map((item, index) => [item.text, pattern[index % pattern.length]]);
    }

    return normalized.map((item) => {
      const spread = maxFont - minFont;
      const normalizedWeight = (item.weight - minWeight) / (maxWeight - minWeight);
      const scaled = Math.round(minFont + normalizedWeight * spread);
      return [item.text, scaled];
    });
  }

  function chooseColor() {
    return CLOUD_COLORS[Math.floor(Math.random() * CLOUD_COLORS.length)];
  }

  function getCloudSize(container) {
    const safePadding = window.innerWidth < 700 ? 12 : 16;
    const width = Math.max(320, Math.floor(container.clientWidth - safePadding * 2));
    const minimumHeight = window.innerWidth < 700 ? 540 : 860;
    const containerHeight = Math.floor(container.clientHeight - safePadding * 2);
    const aspectHeight = Math.floor(width * 0.62);
    const viewportHeight = Math.floor(window.innerHeight * 0.82);
    const height = Math.max(minimumHeight, aspectHeight, viewportHeight);
    return { width, height: Math.max(height, containerHeight) };
  }

  async function fetchWordsFromSheet(sheetId, gid) {
    const cacheBust = "&cb=" + Date.now();
    const jsonUrl = "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:json&gid=" + gid + cacheBust;
    const jsonResponse = await fetch(jsonUrl);

    if (!jsonResponse.ok) {
      throw new Error("Unable to fetch sheet JSON data.");
    }

    const jsonText = await jsonResponse.text();
    const parsed = parseGvizPayload(jsonText);
    const rows = parsed.table && parsed.table.rows ? parsed.table.rows : [];
    const wordsFromJson = rowsToWords(rows);

    if (wordsFromJson.length > 0) {
      return wordsFromJson;
    }

    // Fallback to CSV if the visualization endpoint is empty or restricted.
    const csvUrl = "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:csv&gid=" + gid + cacheBust;
    const csvResponse = await fetch(csvUrl);
    if (!csvResponse.ok) {
      throw new Error("Unable to fetch sheet CSV data.");
    }

    const csvText = await csvResponse.text();
    return parseCsv(csvText);
  }

  function renderCloud(canvas, container, words) {
    if (typeof WordCloud !== "function") {
      throw new Error("WordCloud2 library is not available.");
    }

    const dimensions = getCloudSize(container);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    canvas.style.height = dimensions.height + "px";

    WordCloud(canvas, {
      list: scaleWordsForLibrary(words),
      gridSize: Math.max(6, Math.round(dimensions.width / 95)),
      weightFactor: 1.1,
      fontFamily: "Georgia, Times New Roman, serif",
      color: chooseColor,
      rotateRatio: 0.2,
      minRotation: -Math.PI / 3,
      maxRotation: Math.PI / 3,
      // Keep the cloud anchored high in the canvas so it starts near the top.
      origin: [Math.floor(dimensions.width / 2), Math.floor(dimensions.height * 0.26)],
      backgroundColor: "rgba(0,0,0,0)",
      shuffle: true,
      drawOutOfBound: false,
      shrinkToFit: true
    });
  }

  async function initializeWordCloud() {
    const cloudRoot = document.getElementById("word-cloud");
    const cloudCanvas = document.getElementById("word-cloud-canvas");
    if (!cloudRoot || !cloudCanvas) {
      return;
    }

    const sheetId = cloudRoot.dataset.sheetId || "";
    const gid = cloudRoot.dataset.sheetGid || "0";
    let activeWords = SAMPLE_WORDS;
    const refreshIntervalMs = 5 * 60 * 1000;

    function setStatus(message) {
      if (!message) {
        cloudRoot.removeAttribute("data-status");
        return;
      }
      cloudRoot.setAttribute("data-status", message);
    }

    function renderCurrentWords() {
      renderCloud(cloudCanvas, cloudRoot, activeWords);
    }

    async function refreshFromSheet() {
      try {
        const words = await fetchWordsFromSheet(sheetId, gid);
        if (words.length === 0) {
          activeWords = SAMPLE_WORDS;
          setStatus("No sheet data found, using sample words.");
        } else {
          activeWords = words;
          setStatus("");
        }
      } catch (error) {
        console.error(error);
        activeWords = SAMPLE_WORDS;
        setStatus("Could not load sheet data, using sample words.");
      }

      renderCurrentWords();
    }

    if (!sheetId) {
      setStatus("Showing sample words.");
      activeWords = SAMPLE_WORDS;
      renderCurrentWords();
      return;
    }

    setStatus("Loading...");
    await refreshFromSheet();

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(function () {
        renderCurrentWords();
      });
      observer.observe(cloudRoot);
    }

    window.addEventListener("load", function () {
      renderCurrentWords();
    });

    setInterval(function () {
      refreshFromSheet();
    }, refreshIntervalMs);

    window.addEventListener("resize", function () {
      renderCurrentWords();
    });
  }

  document.addEventListener("DOMContentLoaded", initializeWordCloud);
})();
