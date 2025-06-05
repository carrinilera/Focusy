import React, { useState, useEffect, useRef } from "react";

// Simulasi backend async
const fakeBackend = (() => {
  let sessions = [];
  return {
    addSession: async (duration) => {
      // Simulasi delay
      await new Promise((r) => setTimeout(r, 100));
      sessions.push({
        durationMinutes: duration,
        endTime: BigInt(Date.now()) * BigInt(1_000_000), // nanoseconds
      });
    },
    getSessions: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return sessions;
    },
    clearSessions: async () => {
      await new Promise((r) => setTimeout(r, 100));
      sessions = [];
    },
  };
})();

export default function App() {
  // States utama
  const [duration, setDuration] = useState(25); // menit fokus default
  const [timeLeft, setTimeLeft] = useState(duration * 60); // detik
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);

  // Format detik ke mm:ss
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // Load history dari backend
  async function loadHistory() {
    try {
      const sessions = await fakeBackend.getSessions();
      setHistory([...sessions].reverse()); // terbaru di atas
    } catch (err) {
      console.error("Gagal load history:", err);
    }
  }

  // Simpan sesi ke backend dan reload history
  async function saveSession(mins) {
    try {
      await fakeBackend.addSession(mins);
      await loadHistory();
    } catch (err) {
      console.error("Gagal simpan sesi:", err);
    }
  }

  // Clear history
  async function clearHistory() {
    try {
      await fakeBackend.clearSessions();
      setHistory([]);
    } catch (err) {
      console.error("Gagal hapus history:", err);
    }
  }

  // Timer effect, jalan kalau isRunning true
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            saveSession(duration);
            return duration * 60; // reset waktu
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, duration]);

  // Update waktu saat durasi diubah dan timer gak jalan
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isRunning]);

  // Load history sekali saat komponen mount
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "3rem auto",
        padding: 20,
        borderRadius: 10,
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#00ffcc",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 0 20px #00ffcc",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Focusy ⏳
      </h1>

      {/* Timer display */}
      <div
        style={{
          fontSize: 64,
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "0 0 20px #00ffcc",
          marginBottom: 24,
        }}
      >
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <button
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
          style={buttonStyle}
        >
          ▶ Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
          style={buttonStyle}
        >
          ⏸ Pause
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(duration * 60);
          }}
          style={buttonStyle}
        >
          ↻ Reset
        </button>
      </div>

      {/* Settings */}
      <div style={{ marginBottom: 24 }}>
        <label>
          Focus Duration (minutes):{" "}
          <input
            type="number"
            min={1}
            max={120}
            value={duration}
            onChange={(e) =>
              setDuration(Math.max(1, Math.min(120, Number(e.target.value))))
            }
            style={{
              width: 60,
              padding: 6,
              borderRadius: 5,
              border: "1px solid #00ffcc",
              backgroundColor: "#1e1e2f",
              color: "#00ffcc",
              fontWeight: "bold",
              textAlign: "center",
            }}
            disabled={isRunning}
          />
        </label>
      </div>

      {/* History */}
      <div>
        <h3 style={{ marginBottom: 12 }}>Focus History</h3>
        {history.length === 0 ? (
          <p>No sessions yet.</p>
        ) : (
          history.map((s, i) => {
            const endDate = new Date(Number(s.endTime / BigInt(1_000_000)));
            return (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderLeft: "4px solid #00ffcc",
                  padding: "12px 16px",
                  marginBottom: 8,
                  borderRadius: 8,
                  backdropFilter: "blur(5px)",
                  boxShadow: "0 0 10px #00ffcc33",
                }}
              >
                ✅ Focused for {s.durationMinutes} minutes at{" "}
                {endDate.toLocaleString()}
              </div>
            );
          })
        )}

        <button
          onClick={clearHistory}
          style={{
            marginTop: 12,
            backgroundColor: "#ff4d4d",
            border: "none",
            padding: "8px 16px",
            borderRadius: 6,
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🗑️ Clear All History
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: "0 6px",
  padding: "10px 18px",
  borderRadius: 6,
  border: "none",
  backgroundColor: "#1e1e2f",
  color: "#00ffcc",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0,255,204,0.3)",
};

