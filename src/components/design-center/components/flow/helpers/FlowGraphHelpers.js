// eslint-disable-next-line no-unused-vars
// import FlowGraph from './FlowGraph'
import LinkedList from './LinkedList'
import { isBranchNode } from './NodeUtils'

/**
 * getCycle: get all cycles inside of a directed graph
 * Find all simple cycles in a directed graph using Tarjan's algorithm.
 *
 * Space complexity - O(E + V + S) where S is length of all cycles
 * Time complexity - O(E*V(C+1) where C is total number of cycles
 *
 * @see {links:
 *  1. https://en.wikipedia.org/wiki/Cycle_detection
 *  2. https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/
 *  3. https://stackoverflow.com/questions/45716526/how-should-i-found-cycle-in-the-directed-graph-and-list-out-the-node-which-formi
 *  4. https://www.youtube.com/watch?v=rKQaZuoUR4M&t=4s
 *  5. https://github.com/mission-peace/interview/blob/master/src/com/interview/graph/AllCyclesInDirectedGraphTarjan.java
 * }
 * @param {FlowGraph} graph
 * @returns {GraphVertex[][]}
 */
export const getCycle = (graph) => {
  const visited = new WeakSet()
  const pointStack = new LinkedList()
  const markedStack = new LinkedList()
  const markedSet = new WeakSet()
  const result = []

  for (const vertex of graph.getAllVertices()) {
    _findAllCycles(vertex, vertex, result)
    visited.add(vertex)

    while (!markedStack.isEmpty()) {
      markedSet.delete(markedStack.pollFirst())
    }
  }

  function _findAllCycles(start, current, result) {
    let hasCycle = false
    pointStack.offerFirst(current)
    markedSet.add(current)
    markedStack.offerFirst(current)

    let edges = graph.getEdgesByKey(graph.getVertexKey(current))
    edges = edges ? (Array.isArray(edges) ? edges : [edges]) : []

    for (const w of edges) {
      if (visited.has(w)) {
        continue
      } else if (isSameVertex(start, w)) {
        hasCycle = true
        pointStack.offerFirst(w)
        const cycle = []

        for (const point of pointStack.descendingIterator()) {
          cycle.push(point)
        }
        pointStack.pollFirst()
        result.push(cycle)
      } else if (!markedSet.has(w)) {
        hasCycle = _findAllCycles(start, w, result) || hasCycle
      }
    }

    if (hasCycle) {
      while (!markedStack.peekFirst() === current) {
        markedSet.delete(markedStack.pollFirst())
      }

      markedSet.delete(markedStack.pollFirst())
    }

    pointStack.pollFirst()

    return hasCycle
  }

  /**
   * https://github.com/mission-peace/interview/blob/master/src/com/interview/graph/Graph.java#L153
   * @param {GraphVertex} v
   * @param {GraphVertex} w
   */
  function isSameVertex(v, w) {
    if (v === w) return true

    if (w === null || w === undefined) return false

    // specific situation for our case
    if (isBranchNode(v.type)) {
      if (v.nodeId === w.prevId) return true
    }

    if (v.nodeId !== w.nodeId) return false

    return true
  }

  return result
}
