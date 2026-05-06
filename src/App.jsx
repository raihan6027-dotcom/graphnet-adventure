import { useEffect, useState } from "react";
import CharacterIntro from "./components/CharacterIntro";
import EndScreen from "./components/EndScreen";
import GameCanvas from "./components/GameCanvas";
import StartScreen from "./components/StartScreen";
import { levels } from "./game/levels";

const STORAGE_KEY = "graphnet_progress";

function readSavedLevel() {
  const saved = Number.parseInt(localStorage.getItem(STORAGE_KEY) || "", 10);

  if (Number.isNaN(saved) || saved < 1 || saved > levels.length) {
    return null;
  }

  return saved;
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [savedLevel, setSavedLevel] = useState(() => readSavedLevel());

  useEffect(() => {
    setSavedLevel(readSavedLevel());
  }, [screen]);

  function handleNewGame() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedLevel(null);
    setCurrentLevel(1);
    setScreen("intro");
  }

  function handleContinue() {
    const saved = readSavedLevel();

    if (saved !== null) {
      setCurrentLevel(saved);
      setScreen("game");
    }
  }

  function handleSolved(levelId) {
    if (levelId < levels.length) {
      const nextLevel = levelId + 1;
      localStorage.setItem(STORAGE_KEY, String(nextLevel));
      setSavedLevel(nextLevel);
    }
  }

  function handleNextLevel() {
    if (currentLevel >= levels.length) {
      localStorage.removeItem(STORAGE_KEY);
      setSavedLevel(null);
      setScreen("end");
      return;
    }

    setCurrentLevel((level) => level + 1);
    setScreen("game");
  }

  function handlePlayAgain() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedLevel(null);
    setCurrentLevel(1);
    setScreen("game");
  }

  function handleBackToStart() {
    setScreen("start");
  }

  if (screen === "start") {
    return (
      <StartScreen
        savedLevel={savedLevel}
        onNewGame={handleNewGame}
        onContinue={handleContinue}
      />
    );
  }

  if (screen === "intro") {
    return <CharacterIntro onContinue={() => setScreen("game")} />;
  }

  if (screen === "end") {
    return <EndScreen onPlayAgain={handlePlayAgain} onBackToStart={handleBackToStart} />;
  }

  return (
    <GameCanvas
      level={levels[currentLevel - 1]}
      totalLevels={levels.length}
      onSolved={handleSolved}
      onNextLevel={handleNextLevel}
    />
  );
}
