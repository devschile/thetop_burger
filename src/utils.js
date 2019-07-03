export const humanizeDistance = (distance) => {
  if (distance >= 1000) return `${(distance / 1000).toFixed(2)} kms`
  return `${distance} mts`
}
