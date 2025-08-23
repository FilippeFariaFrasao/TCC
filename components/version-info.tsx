'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getFullVersionInfo, getVersionHistory } from '@/lib/version'
import { Info, Calendar, Zap, History, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface VersionInfoProps {
  variant?: 'badge' | 'button' | 'text'
  showDetails?: boolean
}

export function VersionInfo({ variant = 'badge', showDetails = false }: VersionInfoProps) {
  const versionInfo = getFullVersionInfo()
  const versionHistory = getVersionHistory()
  const [showHistory, setShowHistory] = useState(false)

  const VersionTrigger = () => {
    switch (variant) {
      case 'button':
        return (
          <Button variant="ghost" size="sm" className="text-xs">
            <Info className="h-3 w-3 mr-1" />
            v{versionInfo.version}
          </Button>
        )
      case 'text':
        return (
          <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            v{versionInfo.version}
          </span>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-accent">
            v{versionInfo.version}
          </Badge>
        )
    }
  }

  if (!showDetails) {
    return <VersionTrigger />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="transition-opacity hover:opacity-80">
          <VersionTrigger />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Bárbaros Admin v{versionInfo.version}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!showHistory ? (
            // Versão atual
            <>
              <div>
                <h4 className="font-semibold text-sm mb-2">{versionInfo.name}</h4>
                <p className="text-sm text-muted-foreground">{versionInfo.description}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Lançado em {new Date(versionInfo.releaseDate).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Novidades desta versão:</h4>
                <ul className="space-y-1">
                  {versionInfo.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHistory(true)}
                className="w-full mt-4"
              >
                <History className="h-4 w-4 mr-2" />
                Ver Histórico de Versões
              </Button>
            </>
          ) : (
            // Histórico de versões
            <>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Histórico de Versões</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHistory(false)}
                >
                  Voltar
                </Button>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-4">
                {versionHistory.map((version, index) => (
                  <div key={version.version} className="border-l-2 border-muted pl-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={index === 0 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        v{version.version}
                      </Badge>
                      {version.type === 'major' && (
                        <Badge variant="destructive" className="text-xs">
                          Major
                        </Badge>
                      )}
                      {version.breaking && (
                        <Badge variant="destructive" className="text-xs">
                          Breaking
                        </Badge>
                      )}
                    </div>
                    
                    <h5 className="font-medium text-sm mb-1">{version.name}</h5>
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(version.releaseDate).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">{version.description}</p>
                    
                    <details className="text-xs">
                      <summary className="cursor-pointer text-primary hover:underline">
                        Ver {version.features.length} funcionalidades
                      </summary>
                      <ul className="mt-2 space-y-1 ml-4">
                        {version.features.map((feature, fIndex) => (
                          <li key={fIndex} className="text-muted-foreground">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}