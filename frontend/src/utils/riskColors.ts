export const getRiskColor = (score: number): string => {
  if (score >= 8) return '#ef4444'
  if (score >= 6) return '#f97316'
  if (score >= 3) return '#fbbf24'
  return '#4ade80'
}

export const getRiskStatus = (score: number): string => {
  if (score >= 8) return 'CRITICAL'
  if (score >= 6) return 'HIGH'
  if (score >= 3) return 'MEDIUM'
  return 'LOW'
}

export const getRiskBgColor = (score: number): string => {
  if (score >= 8) return 'rgba(239, 68, 68, 0.1)'
  if (score >= 6) return 'rgba(249, 115, 22, 0.1)'
  if (score >= 3) return 'rgba(251, 191, 36, 0.1)'
  return 'rgba(74, 222, 128, 0.1)'
}

export const getRiskBorderColor = (score: number): string => {
  if (score >= 8) return 'rgba(239, 68, 68, 0.2)'
  if (score >= 6) return 'rgba(249, 115, 22, 0.2)'
  if (score >= 3) return 'rgba(251, 191, 36, 0.2)'
  return 'rgba(74, 222, 128, 0.2)'
}
