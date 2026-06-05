import { useState, useCallback, useRef } from 'react'

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'https://n8n.srv1626933.hstgr.cloud/webhook/4527b82c-94d4-43aa-a9c5-80e471472ee9'

export function useAgentStream() {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [toolCalls, setToolCalls] = useState([])
  const abortRef = useRef(null)

  const sendMessage = useCallback(async (text, phone = '33782699905', audioBlob = null) => {
    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: audioBlob ? '🎙 Message vocal' : text, ts: new Date() }
    setMessages(prev => [...prev, userMsg])
    setStreaming(true)
    setToolCalls([])

    // Placeholder assistant message for streaming
    const assistantId = Date.now() + 1
    const assistantMsg = {
      id: assistantId,
      role: 'assistant',
      content: '',
      structured: null,
      streaming: true,
      ts: new Date()
    }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const ctrl = new AbortController()
      abortRef.current = ctrl

      // Build body — audio or text
      let body
      if (audioBlob) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result.split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(audioBlob)
        })
        body = { audio_base64: base64, audio_mime: 'audio/webm', phone, source: 'web' }
      } else {
        body = { message: text, phone, source: 'web' }
      }

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ctrl.signal
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const contentType = res.headers.get('content-type') || ''

      // SSE streaming mode
      if (contentType.includes('text/event-stream')) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop()

          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (data === '[DONE]') break

            try {
              const evt = JSON.parse(data)
              handleEvent(evt, assistantId)
            } catch {
              if (data) {
                setMessages(prev => prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: m.content + data }
                    : m
                ))
              }
            }
          }
        }
      } else {
        // JSON mode (non-streaming fallback)
        const json = await res.json()

        let structured = json.structured || null
        let textContent = json.output || json.text || json.response || ''

        if (!structured) {
          try {
            const parsed = JSON.parse(textContent)
            if (parsed.structured) {
              structured = parsed.structured
              textContent = parsed.output || ''
            } else if (parsed.type) {
              structured = parsed
              textContent = ''
            }
          } catch { /* keep as text */ }
        }

        if (!textContent && !structured) {
          textContent = JSON.stringify(json)
        }

        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: textContent, structured, streaming: false }
            : m
        ))
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Erreur de connexion. Réessaie.', streaming: false }
            : m
        ))
      }
    } finally {
      setStreaming(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      ))
    }
  }, [])

  function handleEvent(evt, assistantId) {
    switch (evt.type) {
      case 'TEXT_MESSAGE_CONTENT':
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: m.content + (evt.delta || '') }
            : m
        ))
        break
      case 'TOOL_CALL_START':
        setToolCalls(prev => [...prev, { id: evt.toolCallId, name: evt.toolName, status: 'running' }])
        break
      case 'TOOL_CALL_END':
        setToolCalls(prev => prev.map(t =>
          t.id === evt.toolCallId ? { ...t, status: 'done' } : t
        ))
        break
      case 'STATE_DELTA':
        if (evt.structured) {
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, structured: evt.structured } : m
          ))
        }
        break
      case 'MESSAGE_END':
        if (evt.structured) {
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, structured: evt.structured, streaming: false } : m
          ))
        }
        break
    }
  }

  const abort = useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [])

  return { messages, streaming, toolCalls, sendMessage, abort, setMessages }
}
