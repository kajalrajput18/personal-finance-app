import { useState, useEffect } from "react";
import { apiRequest, API_PATHS } from "../../utils/api";

const VoiceInput = ({ onSuccess, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);

      try {
        const result = await apiRequest(`${API_PATHS.AI}/voice-expense`, {
          method: "POST",
          body: JSON.stringify({ text }),
        });

        if (onSuccess) {
          onSuccess(result);
        }
        setTranscript("");
      } catch (error) {
        console.error("Error adding expense:", error);
        if (onError) {
          onError(error.message || "Failed to add expense");
        }
      } finally {
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (onError) {
        onError("Speech recognition failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleManualSubmit = async () => {
    if (!transcript.trim()) {
      alert("Please enter or speak an expense description");
      return;
    }

    try {
      const result = await apiRequest(`${API_PATHS.AI}/voice-expense`, {
        method: "POST",
        body: JSON.stringify({ text: transcript }),
      });

      if (onSuccess) {
        onSuccess(result);
      }
      setTranscript("");
    } catch (error) {
      console.error("Error adding expense:", error);
      if (onError) {
        onError(error.message || "Failed to add expense");
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Voice input is not supported in your browser. You can still type your
          expense.
        </p>
        <div className="mt-3">
          <input
            type="text"
            placeholder="e.g., spent 500 on food"
            className="w-full border p-2 rounded"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <button
            onClick={handleManualSubmit}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Expense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={startListening}
          disabled={isListening}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            isListening
              ? "bg-red-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } disabled:opacity-50`}
        >
          {isListening ? (
            <>
              <span className="animate-pulse">🔴</span>
              <span>Listening...</span>
            </>
          ) : (
            <>
              <span>🎤</span>
              <span>Start Voice Input</span>
            </>
          )}
        </button>

        {transcript && (
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              <strong>Heard:</strong> {transcript}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-600 mb-2">
          Or type manually: (e.g., "spent 500 on food")
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., spent 500 on food"
            className="flex-1 border p-2 rounded"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleManualSubmit();
              }
            }}
          />
          <button
            onClick={handleManualSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
