export default function StartScreen({ savedLevel, onNewGame, onContinue }) {
  return (
    <main className="simple-screen blue-screen">
      <section className="center-panel" aria-labelledby="start-title">
        <h1 id="start-title">GraphNet Adventure</h1>
        <p>Game Teori Graf Jaringan Komputer</p>
        <div className="screen-actions">
          <button type="button" onClick={onNewGame}>
            Mulai Baru
          </button>
          {savedLevel !== null && (
            <button type="button" onClick={onContinue}>
              Lanjutkan (Level {savedLevel})
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
