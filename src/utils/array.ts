export const idDiff = <T>(prev: T[], next: T[]) => {
  const prevSet = new Set(prev)
  const nextSet = new Set(next)

  return {
    added: next.filter((value) => !prevSet.has(value)),
    removed: prev.filter((value) => !nextSet.has(value)),
  }
}
