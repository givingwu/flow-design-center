// import { getCycle } from './FlowGraphHelpers'

/**
 * @class FlowGraph
 * @constructor
 * @description Flow Directed-Graph Implementation
 * @inspired from the following links
 * @see
 *  + EN https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/graph/Graph.js
 *  + EN http://blog.benoitvallon.com/data-structures-in-javascript/the-graph-data-structure/
 *  + EN https://hackernoon.com/the-javascript-developers-guide-to-graphs-and-detecting-cycles-in-them-96f4f619d563
 *  + EN https://www.geeksforgeeks.org/implementation-graph-javascript/
 *  + CN https://segmentfault.com/a/1190000011216330
 *  + CN https://www.liuyiqi.cn/2017/02/19/graph/
 */
export default class FlowGraph {
  /**
   * @typedef {import('./Node').default} GraphVertex A Graph Vertex
   * @typedef {GraphVertex|GraphVertex[]} GraphEdge A Graph Edge it includes multiple vertices
   *
   * @constructor
   */
  constructor() {
    /** @type {Object<string, GraphVertex>}  */
    this.vertices = {} /* Flow Node Vertices */
    /** @type {Map<string, GraphVertex | GraphVertex[]>} */
    this.edges = new Map() /* Edges */
  }

  /**
   * @method addVertex
   * @description  It adds the vertex v as key to adjList and initialize its values with an array or null.
   * @memberof FlowGraph
   * @param {GraphVertex} v
   * @returns {FlowGraph}
   */
  addVertex(v) {
    v && (this.vertices[v.nodeId] = v)
    // in this way do not initialize the vertex with a null value
    // `GraphVertex` may called `addVertex` method more than once
    // this.edges.set(v.nodeId, null)

    return this
  }

  /**
   * @param {GraphVertex|string} v
   * @returns {string}
   */
  getVertexKey(v) {
    return typeof v === 'string' ? v : v.nodeId
  }

  /**
   * @method getVertexByKey
   * @memberof FlowGraph
   * @param {string} vertexKey
   * @returns {(GraphVertex|null)}
   */
  getVertexByKey(vertexKey) {
    return (
      this.vertices[
        typeof vertexKey === 'string' ? vertexKey : this.getVertexKey(vertexKey)
      ] || null
    )
  }

  /**
   * @method removeVertexByKey
   * @memberof FlowGraph
   * @param {string} key
   * @returns {FlowGraph}
   */
  removeVertexByKey(key) {
    const vertex = this.vertices[key]
    const vertices = this.edges.get(key)

    if (vertices) {
      if (Array.isArray(vertices)) {
        while (vertices.length) {
          /* 临近顶点 */
          const adjacentVertex = vertices.pop()
          this.removeEdge(vertex, adjacentVertex)
        }
      } else {
        this.removeEdge(vertex, vertices)
      }
    }

    if (vertex) {
      delete this.vertices[key]
    }

    return this
  }

  /**
   * @method addEdge
   * @description In order to add edge we get the adjacency list of the corresponding src vertex and add the dest to the adjacency list.
   * @memberof FlowGraph
   * @param {GraphVertex|string} v src
   * @param {GraphVertex|string} w dest
   * @returns {FlowGraph}
   */
  addEdge(v, w) {
    // Try to find start and end vertices.
    let startVertex = this.getVertexByKey(this.getVertexKey(v))
    let endVertex = this.getVertexByKey(this.getVertexKey(w))

    // Insert start vertex if it wasn't inserted.
    if (!startVertex) {
      this.addVertex(v)
      startVertex = v
    }

    // Insert end vertex if it wasn't inserted.
    if (!endVertex) {
      this.addVertex(w)
      endVertex = w
    }

    const vertices = this.edges.get(startVertex.nodeId)

    if (!vertices) {
      this.edges.set(startVertex.nodeId, endVertex)
    } else {
      // Check if edge has been already added.
      if (Array.isArray(vertices)) {
        if (
          !vertices.map((vertex) => vertex.nodeId).includes(endVertex.nodeId)
        ) {
          vertices.push(endVertex)
        } else {
          console.warn(
            `The ${endVertex.nodeId} has already been added to ${
              startVertex.nodeId
            } before`
          )
        }
      } else {
        this.edges.set(startVertex.nodeId, [vertices, endVertex])
      }
    }

    /* if (process.env.NODE_ENV === 'development') {
      this.print()
    } */

    // Since graph is undirected,
    // add an edge from w to v also
    // but in our case it is directed
    // this.edges.get(w).push(v)

    return this
  }

  /**
   * @method removeEdge for directed-graph on single way
   * @description Remove a edge from the given vertex W to vertex x
   * @param {GraphVertex} v src
   * @param {GraphVertex} w dest
   * @returns {FlowGraph}
   */
  removeEdge(v, w) {
    /* find all vertices from edges[w] */
    const vertices = this.getEdgesByKey(this.getVertexKey(v))
    const vertexV = this.getVertexByKey(this.getVertexKey(v))
    const vertexW = this.getVertexByKey(this.getVertexKey(w))

    if (vertices) {
      if (Array.isArray(vertices)) {
        const index = vertices ? vertices.indexOf(vertexW) : -1

        if (~index) {
          vertices.splice(index, 1)
        }
      } else {
        if (vertexW === vertices) {
          this.edges.delete(vertexV.nodeId)
        }
      }
    }

    /* if (process.env.NODE_ENV === 'development') {
      this.print()
    } */

    return this
  }

  /**
   * getEdgesByKey
   * @memberof FlowGraph
   * @param {string} key
   * @returns {GraphVertex|GraphVertex[]}
   */
  getEdgesByKey(key) {
    return this.edges.get(key)
  }

  /**
   * @return {GraphVertex[]}
   */
  getAllVertices() {
    return Object.values(this.vertices)
  }

  /**
   * @return {GraphEdge[]}
   */
  getAllEdges() {
    return Object.values(this.edges)
  }

  /**
   * @param {GraphVertex}
   * @returns {GraphVertex[]}
   */
  getNeighbors(v) {
    return this.edges.get(v.nodeId) || []
  }

  /**
   * @callback TraverseCallback
   * @param {GraphVertex} vertex
   * @param {GraphVertex|GraphVertex[]} neighbor
   * @returns {void}
   *
   * traverseBFS 广度优先遍历
   * @memberof FlowGraph
   * @param {GraphVertex} v
   * @param {TraverseCallback} fn
   */
  traverseBFS(v, fn) {
    if (!this.vertices[v.nodeId]) {
      return console.warn('Vertex not found')
    }

    const queue = []
    queue.push(v)

    const visited = {}
    visited[v.nodeId] = true

    while (queue.length) {
      const curr = queue.shift()
      let neighbors = this.getNeighbors(curr)

      curr && fn && fn(curr, neighbors)
      neighbors = Array.isArray(neighbors) ? neighbors : [neighbors]

      for (let i = 0; i < neighbors.length; i++) {
        const w = neighbors[i]

        if (!visited[w.nodeId]) {
          visited[w.nodeId] = true
          queue.push(w)
        }
      }
    }
  }

  /**
   * traverseDFS 深度优先遍历
   * @memberof FlowGraph
   * @param {GraphVertex} v
   * @param {TraverseCallback} fn
   */
  traverseDFS(v, fn) {
    if (!this.vertices[v.nodeId]) {
      return console.warn('Vertex not found')
    }

    const visited = {}
    traverseDFS.call(this, v, visited, fn)
  }

  getCycle() {
    // return getCycle.call(this, this)
  }

  print() {
    console.log('\n')
    for (const [key, val] of this.edges) {
      console.log(
        `${key} -> ${
          Array.isArray(val)
            ? val.map((t) => t.nodeId).join(' & ')
            : val
            ? val.nodeId
            : val
        }`
      )
    }
    console.log('\n')
  }
}

/**
 * traverseDFS
 * @this {FlowGraph}
 * @param {GraphVertex} curr
 * @param {{}} visited
 * @param {TraverseCallback} fn
 */
function traverseDFS(curr, visited, fn) {
  visited[curr.nodeId] = true
  let neighbors = this.getNeighbors(curr)

  curr && fn && fn(curr, neighbors)
  neighbors = Array.isArray(neighbors) ? neighbors : [neighbors]

  for (let i = 0; i < neighbors.length; i++) {
    const w = neighbors[i]

    if (visited[w.nodeId]) {
      console.log('It was visited as before')
    }

    if (!visited[w.nodeId]) {
      visited[w.nodeId] = true
      traverseDFS.call(this, w, visited, fn)
    }
  }
}

/* const COLOR = {
  WHITE: 0,
  GRAY: 1,
  BLACK: -1,
} */
