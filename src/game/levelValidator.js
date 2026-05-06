import {
  edgeKey,
  findShortestPath,
  getDegree,
  hasCycle,
  isConnectedGraph,
  isSpanningTree,
} from "./graphAlgorithms";

function samePath(left, right) {
  return left.length === right.length && left.every((node, index) => node === right[index]);
}

function includesOnlyPathEdges(edges, path) {
  const expected = new Set();

  for (let index = 0; index < path.length - 1; index += 1) {
    expected.add(edgeKey(path[index], path[index + 1]));
  }

  return edges.every((edge) => expected.has(edgeKey(edge.from, edge.to)));
}

export function validateLevel(level, edges) {
  return level.goals.every((goal) => {
    if (goal.type === "CONNECT_ALL") {
      return isConnectedGraph(level.nodes, edges);
    }

    if (goal.type === "NO_CYCLE") {
      const connectedEnough = goal.requireConnected ? isConnectedGraph(level.nodes, edges) : true;
      return connectedEnough && !hasCycle(level.nodes, edges);
    }

    if (goal.type === "SPANNING_TREE") {
      return isSpanningTree(level.nodes, edges);
    }

    if (goal.type === "SHORTEST_PATH") {
      if (!goal.startNode || !goal.endNode) {
        return false;
      }

      const result = findShortestPath(level.nodes, edges, goal.startNode, goal.endNode);
      const hasPath = result.path.length > 0 && result.distance !== Number.POSITIVE_INFINITY;
      const withinDistance = goal.maxDistance === undefined || result.distance <= goal.maxDistance;
      const matchesPath = goal.exactPath === undefined || samePath(result.path, goal.exactPath);
      const usesPathEdges =
        goal.exactPath === undefined ||
        (edges.length === (goal.exactEdgeCount ?? edges.length) &&
          includesOnlyPathEdges(edges, goal.exactPath));

      return hasPath && withinDistance && matchesPath && usesPathEdges;
    }

    if (goal.type === "DEGREE") {
      if (!goal.targetNode || goal.targetDegree === undefined) {
        return false;
      }

      return getDegree(goal.targetNode, edges) === goal.targetDegree;
    }

    return false;
  });
}
