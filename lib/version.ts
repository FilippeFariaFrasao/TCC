/**
 * Configuração de versão do sistema
 * Este arquivo centraliza informações sobre a versão atual
 * A versão atual sempre vem do histórico (primeira entrada)
 */

import { getCurrentVersion } from './version-history'

export const VERSION_CONFIG = getCurrentVersion()

export const getVersion = () => VERSION_CONFIG.version
export const getVersionName = () => VERSION_CONFIG.name
export const getFullVersionInfo = () => VERSION_CONFIG

// Re-exportar funções do histórico para compatibilidade
export { getVersionHistory, getChangelogSummary, getMajorVersions } from './version-history'