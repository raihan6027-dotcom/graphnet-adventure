export default function ComputerNode({ node, selected, onClick }) {
  return (
    <button
      className={`computer-node${selected ? " selected" : ""}`}
      onClick={() => onClick(node.id)}
      style={{
        left: `calc(${node.x}% - 36px)`,
        top: `calc(${node.y}% - 30px)`,
      }}
      type="button"
      aria-pressed={selected}
      aria-label={`Komputer ${node.label}`}
    >
      <span className="computer-screen">{node.label}</span>
      <span className="computer-base" />
    </button>
  );
}
