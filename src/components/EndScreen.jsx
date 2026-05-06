export default function EndScreen({ onPlayAgain, onBackToStart }) {
  return (
    <main className="simple-screen blue-screen">
      <section className="center-panel end-panel" aria-labelledby="end-title">
        <h1 id="end-title">{"\uD83C\uDF89 Selamat!"}</h1>
        <p>Kamu telah menamatkan game GraphNet Adventure.</p>
        <p>Sekarang kamu sudah memahami dasar teori graf:</p>
        <ul>
          <li>Node</li>
          <li>Edge</li>
          <li>Path</li>
          <li>Cycle</li>
          <li>Spanning Tree</li>
          <li>Shortest Path</li>
        </ul>
        <p>Keren! Kamu sekarang bisa membangun jaringan seperti engineer sungguhan.</p>
        <div className="screen-actions">
          <button type="button" onClick={onPlayAgain}>
            Main Lagi
          </button>
          <button type="button" onClick={onBackToStart}>
            Kembali ke Awal
          </button>
        </div>
      </section>
    </main>
  );
}
