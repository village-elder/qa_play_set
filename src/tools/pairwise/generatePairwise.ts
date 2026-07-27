export interface PairwiseParameter {
  name: string
  values: string[]
}

export interface PairwiseResult {
  parameterNames: string[]
  testCases: string[][]
  totalPairs: number
  pairsCovered: number
  fullCombinationCount: number
}

function pairKey(i: number, vi: number, j: number, vj: number): string {
  return `${i}:${vi}|${j}:${vj}`
}

/**
 * Greedy pairwise generator: builds one test case at a time, at each step
 * picking the value for every parameter that covers the most still-uncovered
 * pairs. Not guaranteed minimal, but converges fast for the small parameter
 * sets this tool targets.
 */
export function generatePairwise(input: PairwiseParameter[]): PairwiseResult {
  const params = input.filter((p) => p.values.length > 0)
  const n = params.length
  const parameterNames = params.map((p) => p.name)
  const fullCombinationCount = params.reduce((acc, p) => acc * p.values.length, 1)

  if (n < 2) {
    return {
      parameterNames,
      testCases: [],
      totalPairs: 0,
      pairsCovered: 0,
      fullCombinationCount,
    }
  }

  const pairsToCover = new Set<string>()
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let vi = 0; vi < params[i].values.length; vi++) {
        for (let vj = 0; vj < params[j].values.length; vj++) {
          pairsToCover.add(pairKey(i, vi, j, vj))
        }
      }
    }
  }
  const totalPairs = pairsToCover.size

  const rows: number[][] = []
  const maxIterations = totalPairs + fullCombinationCount + 1000
  let iterations = 0

  while (pairsToCover.size > 0 && iterations < maxIterations) {
    iterations++
    const assignment: number[] = new Array(n).fill(0)

    for (let k = 0; k < n; k++) {
      let bestValueIndex = 0
      let bestScore = -1

      for (let vk = 0; vk < params[k].values.length; vk++) {
        let score = 0
        for (let m = 0; m < n; m++) {
          if (m === k) continue
          if (m < k) {
            if (pairsToCover.has(pairKey(m, assignment[m], k, vk))) score++
          } else {
            for (let vm = 0; vm < params[m].values.length; vm++) {
              if (pairsToCover.has(pairKey(k, vk, m, vm))) score++
            }
          }
        }
        if (score > bestScore) {
          bestScore = score
          bestValueIndex = vk
        }
      }

      assignment[k] = bestValueIndex
    }

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        pairsToCover.delete(pairKey(i, assignment[i], j, assignment[j]))
      }
    }

    rows.push(assignment)
  }

  const testCases = rows.map((row) =>
    row.map((valueIndex, paramIndex) => params[paramIndex].values[valueIndex]),
  )

  return {
    parameterNames,
    testCases,
    totalPairs,
    pairsCovered: totalPairs - pairsToCover.size,
    fullCombinationCount,
  }
}
