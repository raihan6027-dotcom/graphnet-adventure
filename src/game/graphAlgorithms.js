export function edgeKey(from, to) {
  return [from, to].sort().join("-");
}

function buildAdjacency(nodes, edges) {
  const adjacency = new Map();

  nodes.forEach((node) => {
    adjacency.set(node.id, []);
  });

  edges.forEach((edge) => {
    const weight = edge.weight ?? 1;

    adjacency.get(edge.from)?.push({ node: edge.to, weight });
    adjacency.get(edge.to)?.push({ node: edge.from, weight });
  });

  return adjacency;
}

export function isConnectedGraph(nodes, edges) {
  if (nodes.length === 0) {
    return true;
  }

  const adjacency = buildAdjacency(nodes, edges);
  const visited = new Set();
  const queue = [nodes[0].id];

  visited.add(nodes[0].id);

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = adjacency.get(current) || [];

    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor.node)) {
        visited.add(neighbor.node);
        queue.push(neighbor.node);
      }
    });
  }

  return visited.size === nodes.length;
}

export function hasCycle(nodes, edges) {
  const adjacency = buildAdjacency(nodes, edges);
  const visited = new Set();

  function dfs(node, parent) {
    visited.add(node);

    for (const neighbor of adjacency.get(node) || []) {
      if (!visited.has(neighbor.node)) {
        if (dfs(neighbor.node, node)) {
          return true;
        }
      } else if (neighbor.node !== parent) {
        return true;
      }
    }

    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id) && dfs(node.id, null)) {
      return true;
    }
  }

  return false;
}

export function isSpanningTree(nodes, edges) {
  return (
    nodes.length > 0 &&
    edges.length === nodes.length - 1 &&
    isConnectedGraph(nodes, edges) &&
    !hasCycle(nodes, edges)
  );
}

export function findShortestPath(nodes, edges, start, end) {
  const adjacency = buildAdjacency(nodes, edges);
  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set();

  nodes.forEach((node) => {
    distances.set(node.id, Number.POSITIVE_INFINITY);
    previous.set(node.id, null);
    unvisited.add(node.id);
  });

  distances.set(start, 0);

  while (unvisited.size > 0) {
    let current = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    unvisited.forEach((node) => {
      const distance = distances.get(node) ?? Number.POSITIVE_INFINITY;

      if (distance < bestDistance) {
        bestDistance = distance;
        current = node;
      }
    });

    if (current === null || bestDistance === Number.POSITIVE_INFINITY) {
      break;
    }

    unvisited.delete(current);

    if (current === end) {
      break;
    }

    for (const neighbor of adjacency.get(current) || []) {
      if (!unvisited.has(neighbor.node)) {
        continue;
      }

      const nextDistance = bestDistance + neighbor.weight;
      const oldDistance = distances.get(neighbor.node) ?? Number.POSITIVE_INFINITY;

      if (nextDistance < oldDistance) {
        distances.set(neighbor.node, nextDistance);
        previous.set(neighbor.node, current);
      }
    }
  }

  const distance = distances.get(end) ?? Number.POSITIVE_INFINITY;
  const path = [];

  if (distance !== Number.POSITIVE_INFINITY) {
    let current = end;

    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) ?? null;
    }
  }

  return { distance, path };
}

export function getDegree(nodeId, edges) {
  return edges.filter((edge) => edge.from === nodeId || edge.to === nodeId).length;
}
