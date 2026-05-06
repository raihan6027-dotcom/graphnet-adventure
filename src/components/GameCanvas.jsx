import { useEffect, useMemo, useRef, useState } from "react";
import ComputerNode from "./ComputerNode";
import { edgeKey, findShortestPath, getDegree } from "../game/graphAlgorithms";
import { validateLevel } from "../game/levelValidator";

function getNode(nodes, nodeId) {
  return nodes.find((node) => node.id === nodeId);
}

function getAvailableEdge(level, from, to) {
  return level.availableEdges?.find((edge) => edgeKey(edge.from, edge.to) === edgeKey(from, to));
}

function edgeExists(edges, from, to) {
  return edges.some((edge) => edgeKey(edge.from, edge.to) === edgeKey(from, to));
}

function getInitialEdges(level) {
  return level.initialEdges || [];
}

export default function GameCanvas({ level, totalLevels, onSolved, onNextLevel }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [edges, setEdges] = useState(() => getInitialEdges(level));
  const [notice, setNotice] = useState("Pilih dua node berbeda untuk memasang kabel.");
  const [soundOn, setSoundOn] = useState(true);
  const bgmRef = useRef(null);
  const solvedLevelRef = useRef(null);

  useEffect(() => {
    bgmRef.current = new Audio("/audio/bgm.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.2;
    bgmRef.current.play().catch(() => {});

    return () => {
      bgmRef.current?.pause();
      bgmRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!bgmRef.current) {
      return;
    }

    if (soundOn) {
      bgmRef.current.play().catch(() => {});
    } else {
      bgmRef.current.pause();
    }
  }, [soundOn]);

  useEffect(() => {
    setSelectedNode(null);
    setEdges(getInitialEdges(level));
    setNotice("Pilih dua node berbeda untuk memasang kabel.");
    solvedLevelRef.current = null;
  }, [level]);

  const solved = useMemo(() => validateLevel(level, edges), [edges, level]);

  useEffect(() => {
    if (solved && solvedLevelRef.current !== level.id) {
      solvedLevelRef.current = level.id;
      onSolved(level.id);
      setNotice("Berhasil! Kamu menyelesaikan level ini.");
    }
  }, [level.id, onSolved, solved]);

  function playClick() {
    if (!soundOn) {
      return;
    }

    bgmRef.current?.play().catch(() => {});

    const sound = new Audio("/audio/click.mp3");
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }

  function handleNodeClick(nodeId) {
    playClick();

    if (solved) {
      return;
    }

    if (selectedNode === null) {
      setSelectedNode(nodeId);
      setNotice(`Node ${nodeId} dipilih. Pilih node kedua.`);
      return;
    }

    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setNotice("Pilihan node dibatalkan.");
      return;
    }

    const availableEdge = getAvailableEdge(level, selectedNode, nodeId);

    if (level.availableEdges && !availableEdge) {
      setSelectedNode(null);
      setNotice("Koneksi itu tidak tersedia pada level ini.");
      return;
    }

    if (edgeExists(edges, selectedNode, nodeId)) {
      setSelectedNode(null);
      setNotice("Edge sudah ada, jadi tidak ditambahkan lagi.");
      return;
    }

    const newEdge = {
      from: selectedNode,
      to: nodeId,
      weight: availableEdge?.weight,
    };

    setEdges((currentEdges) => [...currentEdges, newEdge]);
    setSelectedNode(null);
    setNotice(`Edge ${selectedNode}-${nodeId} dibuat.`);
  }

  function resetLevel() {
    setSelectedNode(null);
    setEdges(getInitialEdges(level));
    setNotice("Level direset. Pilih dua node berbeda untuk memasang kabel.");
    solvedLevelRef.current = null;
  }

  const shortestInfo = level.goals.find((goal) => goal.type === "SHORTEST_PATH");
  const degreeInfo = level.goals.find((goal) => goal.type === "DEGREE");
  const shortestResult =
    shortestInfo?.startNode && shortestInfo.endNode
      ? findShortestPath(level.nodes, edges, shortestInfo.startNode, shortestInfo.endNode)
      : null;

  const showWeights = Boolean(level.availableEdges?.some((edge) => edge.weight !== undefined));

  return (
    <main className="game-screen">
      <header className="game-header">
        <p className="level-count">
          Level {level.id} dari {totalLevels}
        </p>
        <h1>
          Level {level.id} - {level.name}
        </h1>
        <p>{level.instruction}</p>
      </header>

      <section className="game-board" aria-label={`Area game level ${level.id}`}>
        <svg className="game-edges guide-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
          {level.availableEdges?.map((edge) => {
            const from = getNode(level.nodes, edge.from);
            const to = getNode(level.nodes, edge.to);

            if (!from || !to || edgeExists(edges, edge.from, edge.to)) {
              return null;
            }

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={`guide-${edgeKey(edge.from, edge.to)}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                {edge.weight !== undefined && (
                  <text x={midX} y={midY}>
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <svg className="game-edges player-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map((edge) => {
            const from = getNode(level.nodes, edge.from);
            const to = getNode(level.nodes, edge.to);

            if (!from || !to) {
              return null;
            }

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={`edge-${edgeKey(edge.from, edge.to)}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                {showWeights && edge.weight !== undefined && (
                  <text x={midX} y={midY}>
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {level.nodes.map((node) => (
          <ComputerNode
            key={node.id}
            node={node}
            selected={selectedNode === node.id}
            onClick={handleNodeClick}
          />
        ))}
      </section>

      <section className="game-status" aria-live="polite">
        <p>{solved ? "Berhasil! Kamu menyelesaikan level ini." : notice}</p>
        {degreeInfo?.targetNode && degreeInfo.targetDegree !== undefined && (
          <p>
            Degree {degreeInfo.targetNode}: {getDegree(degreeInfo.targetNode, edges)} /{" "}
            {degreeInfo.targetDegree}
          </p>
        )}
        {shortestInfo?.startNode && shortestInfo.endNode && shortestResult && (
          <p>
            Jarak {shortestInfo.startNode}-{shortestInfo.endNode}:{" "}
            {shortestResult.distance === Number.POSITIVE_INFINITY ? "-" : shortestResult.distance}
          </p>
        )}
      </section>

      <footer className="game-actions">
        <button type="button" onClick={resetLevel}>
          Reset
        </button>
        <button
          className="sound-toggle"
          type="button"
          onClick={() => setSoundOn((current) => !current)}
          aria-pressed={soundOn}
        >
          {soundOn ? "\uD83D\uDD0A Sound On" : "\uD83D\uDD07 Sound Off"}
        </button>
        <button type="button" onClick={onNextLevel} disabled={!solved}>
          {level.id === totalLevels ? "Selesai" : "Next Level"}
        </button>
      </footer>
    </main>
  );
}
