class LinkedNode {
  constructor(prev = null, data = null, next = null) {
    this.prev = prev
    this.data = data
    this.next = next
  }
}

/**
 * @class LinkedList
 * @see {links:
 *    http://hg.openjdk.java.net/jdk7/jdk7/jdk/file/9b8c96f96a0f/src/share/classes/java/util/LinkedList.java
 *    http://developer.classpath.org/doc/java/util/LinkedList-source.html
 * }
 */
export default class LinkedList {
  constructor(collection) {
    collection && this.addAll(collection)

    this.first = null
    this.last = null
    this.size = 0
  }

  // 暂未/无须实现
  addAll() {}

  /**
   * Inserts the specified element at the beginning of this list.
   *
   * @param e the element to add
   */
  addFirst(e) {
    this.linkFirst(e)
  }

  /**
   * Links e as first element.
   */
  linkFirst(e) {
    const f = this.first
    const newNode = new LinkedNode(null, e, f)

    this.first = newNode
    if (f == null) this.last = newNode
    else f.prev = newNode

    this.size++
  }

  /**
   * Unlinks non-null first node f.
   */
  unlinkFirst(f) {
    const data = f.data
    const next = f.next

    f.data = null
    f.next = null

    this.first = next

    if (next === null) this.last = null
    else next.prev = null

    this.size--

    return data
  }

  // Deque operations
  /**
   * Inserts the specified element at the front of this list.
   *
   * @param e the element to insert
   * @return {@code true} (as specified by {@link Deque#offerFirst})
   * @since 1.6
   */
  offerFirst(value) {
    this.addFirst(value)
    return true
  }

  /**
   * Retrieves and removes the first element of this list,
   * or returns {@code null} if this list is empty.
   *
   * @return the first element of this list, or {@code null} if
   *     this list is empty
   * @since 1.6
   */
  pollFirst() {
    const f = this.first
    return f === null ? null : this.unlinkFirst(f)
  }

  /**
   * Retrieves, but does not remove, the first element of this list,
   * or returns {@code null} if this list is empty.
   *
   * @return the first element of this list, or {@code null}
   *         if this list is empty
   * @since 1.6
   */
  peekFirst() {
    const f = this.first
    return f === null ? null : f.data
  }

  /**
   * Retrieves, but does not remove, the last element of this list,
   * or returns {@code null} if this list is empty.
   *
   * @return the last element of this list, or {@code null}
   *         if this list is empty
   * @since 1.6
   */
  peekLast() {
    const l = this.last
    return l == null ? null : l.data
  }

  /**
   * @see {link: https://docs.oracle.com/javase/7/docs/api/java/util/Deque.html#descendingIterator()}
   * Returns an iterator over the elements in this deque in proper sequence. The elements will be returned in order from first (head) to last (tail).
   * @returns an iterator over the elements in this deque in proper sequence
   */
  *[Symbol.iterator]() {
    let node = this.first

    while (node) {
      yield node.data
      node = node.next
    }
  }

  /**
   * @see {link: https://docs.oracle.com/javase/7/docs/api/java/util/Deque.html#descendingIterator()}
   * Returns an iterator over the elements in this deque in reverse sequential order. The elements will be returned in order from last (tail) to first (head).
   * @returns an iterator over the elements in this deque in reverse sequence
   */
  *descendingIterator() {
    let node = this.last

    while (node) {
      yield node.data
      node = node.prev
    }
  }

  isEmpty() {
    return this.size === 0
  }
}
