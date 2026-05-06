export default function CharacterIntro({ onContinue }) {
  return (
    <main className="simple-screen intro-screen">
      <section className="intro-panel" aria-labelledby="intro-title">
        <div className="byte-character" aria-label="Byte, komputer kecil pemandu">
          <div className="byte-monitor">
            <div className="byte-face">
              <span />
              <span />
            </div>
          </div>
          <div className="byte-neck" />
          <div className="byte-stand" />
        </div>
        <div className="intro-copy">
          <h1 id="intro-title">Hai! Aku Byte.</h1>
          <p>Aku adalah komputer pemandu di dunia GraphNet.</p>
          <p>Di game ini, kamu akan membantu aku menghubungkan komputer-komputer lain.</p>
          <p>Setiap komputer disebut node, dan kabel penghubung disebut edge.</p>
          <p>Tugasmu adalah membuat jaringan yang benar agar data bisa terkirim.</p>
          <button type="button" onClick={onContinue}>
            Lanjut ke Game
          </button>
        </div>
      </section>
    </main>
  );
}
