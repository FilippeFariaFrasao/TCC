'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { createServiceClient } from '@/lib/supabase/service'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export function SupabaseTest() {
  const [testResults, setTestResults] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results: any = {
      env: {},
      client: {},
      service: {},
      database: {}
    }

    // Teste 1: Variáveis de ambiente
    results.env.url = process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ OK' : '❌ MISSING'
    results.env.anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ OK' : '❌ MISSING'
    results.env.urlValue = process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'
    results.env.anonKeyPreview = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
      : 'undefined'

    // Teste 2: Client Supabase
    try {
      const supabase = createClient()
      results.client.created = '✅ Cliente criado'
      
      // Teste de conexão simples
      const { data, error } = await supabase
        .from('agendamentos')
        .select('count(*)')
        .limit(1)
      
      if (error) {
        results.client.connection = `❌ Erro: ${error.message}`
      } else {
        results.client.connection = '✅ Conexão OK'
      }
    } catch (error: any) {
      results.client.created = `❌ Erro ao criar cliente: ${error.message}`
    }

    // Teste 3: Service Client
    try {
      const service = createServiceClient()
      if (service) {
        results.service.created = '✅ Service client criado'
        
        const { data, error } = await service
          .from('agendamentos')
          .select('count(*)')
          .limit(1)
        
        if (error) {
          results.service.connection = `❌ Erro: ${error.message}`
        } else {
          results.service.connection = '✅ Service conexão OK'
        }
      } else {
        results.service.created = '❌ Service client não criado (SUPABASE_SERVICE_ROLE_KEY missing)'
      }
    } catch (error: any) {
      results.service.created = `❌ Erro: ${error.message}`
    }

    // Teste 4: Operações de banco
    try {
      const supabase = createClient()
      
      // Teste SELECT
      const { data: selectData, error: selectError } = await supabase
        .from('agendamentos')
        .select('id')
        .limit(1)
      
      results.database.select = selectError 
        ? `❌ SELECT error: ${selectError.message}`
        : `✅ SELECT OK (${selectData?.length || 0} records)`

      // Teste INSERT (fake)
      const { error: insertError } = await supabase
        .from('agendamentos')
        .insert([{
          cliente_id: '00000000-0000-0000-0000-000000000000', // fake ID
          servico_id: '00000000-0000-0000-0000-000000000000', // fake ID
          data_agendamento: '2025-01-01',
          hora_inicio: '10:00',
          hora_fim: '10:30',
          status: 'test'
        }])
        .select()
      
      // Esperamos erro pois IDs são fake
      results.database.insert = insertError
        ? (insertError.message.includes('foreign key') 
           ? '✅ INSERT permissions OK (foreign key error expected)'
           : `❌ INSERT error: ${insertError.message}`)
        : '⚠️ INSERT worked (unexpected)'

      // Teste DELETE (fake)
      const { error: deleteError } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000') // fake ID
      
      results.database.delete = deleteError
        ? `❌ DELETE error: ${deleteError.message}`
        : '✅ DELETE permissions OK'

    } catch (error: any) {
      results.database.error = `❌ Database test error: ${error.message}`
    }

    setTestResults(results)
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    if (status.startsWith('✅')) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status.startsWith('❌')) return <XCircle className="w-4 h-4 text-red-500" />
    if (status.startsWith('⚠️')) return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    return null
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Teste de Configuração Supabase
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runTests} disabled={testing} className="mb-6">
          {testing ? 'Testando...' : 'Executar Testes'}
        </Button>

        {testResults && (
          <div className="space-y-6">
            {/* Variáveis de Ambiente */}
            <div>
              <h3 className="text-lg font-semibold mb-3">📋 Variáveis de Ambiente</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.env.url)}
                  <span>NEXT_PUBLIC_SUPABASE_URL: {testResults.env.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.env.anonKey)}
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {testResults.env.anonKey}</span>
                </div>
                <div className="ml-6 text-gray-600">
                  <p>URL: {testResults.env.urlValue}</p>
                  <p>Anon Key: {testResults.env.anonKeyPreview}</p>
                </div>
              </div>
            </div>

            {/* Client */}
            <div>
              <h3 className="text-lg font-semibold mb-3">🔌 Cliente Supabase</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.client.created)}
                  <span>{testResults.client.created}</span>
                </div>
                {testResults.client.connection && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.client.connection)}
                    <span>{testResults.client.connection}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Client */}
            <div>
              <h3 className="text-lg font-semibold mb-3">🔑 Service Client</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.service.created)}
                  <span>{testResults.service.created}</span>
                </div>
                {testResults.service.connection && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.service.connection)}
                    <span>{testResults.service.connection}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Database */}
            <div>
              <h3 className="text-lg font-semibold mb-3">💾 Operações de Banco</h3>
              <div className="space-y-2 text-sm">
                {testResults.database.select && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.database.select)}
                    <span>{testResults.database.select}</span>
                  </div>
                )}
                {testResults.database.insert && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.database.insert)}
                    <span>{testResults.database.insert}</span>
                  </div>
                )}
                {testResults.database.delete && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.database.delete)}
                    <span>{testResults.database.delete}</span>
                  </div>
                )}
                {testResults.database.error && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.database.error)}
                    <span>{testResults.database.error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnóstico */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">💡 Diagnóstico</h3>
              {testResults.env.url.includes('❌') || testResults.env.anonKey.includes('❌') ? (
                <p className="text-red-600">
                  ❌ Configure o arquivo .env.local com as chaves do Supabase
                </p>
              ) : testResults.client.connection?.includes('❌') ? (
                <p className="text-red-600">
                  ❌ Problema de conexão: verifique se as chaves estão corretas
                </p>
              ) : testResults.database.delete?.includes('invalid api key') ? (
                <p className="text-red-600">
                  ❌ API key inválida: verifique SUPABASE_SERVICE_ROLE_KEY
                </p>
              ) : (
                <p className="text-green-600">
                  ✅ Configuração parece estar correta!
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}