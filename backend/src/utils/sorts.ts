export const mapOrder = <T>(
  originalArray: T[],
  orderArray: (string | number)[],
  key: keyof T
): T[] => {
  if (!originalArray || !orderArray || !key) return []

  const clonedArray = [...originalArray]

  const orderedArray = clonedArray.sort((a, b) => {
    const aIndex = orderArray.indexOf(a[key] as unknown as string | number)
    const bIndex = orderArray.indexOf(b[key] as unknown as string | number)

    return aIndex - bIndex
  })

  return orderedArray
}
