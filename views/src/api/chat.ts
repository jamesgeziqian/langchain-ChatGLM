import { api } from './api'

export const chat = (params: any) => {
  return api({
    url: '/chat',
    method: 'post',
    data: JSON.stringify(params),
  })
}

const streaming = (path: string, params: any, callback: (data: any, ended: boolean) => any) => {
  // connection to self would be proxied to backend by vite (dev) or nginx (prod)
  const socketConn = new WebSocket(`ws://${window.location.host}/socket${path}`)
  socketConn.onopen = () => {
    socketConn.send(JSON.stringify(params))
    socketConn.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data?.flag === 'end') {
        socketConn.close()
        callback(data, true)
        return
      }
      callback(data, false)
    }
  }
}

export const streamChat = (params: any, callback: (data: any, ended: boolean) => any) => {
  streaming('/local_doc_qa/stream_chat', params, callback)
}

export const streamBingSearch = (params: any, callback: (data: any, ended: boolean) => any) => {
  streaming('/local_doc_qa/stream_chat_bing', params, callback)
}

const fetchStream = async (url: string, params: any) => {
  const { onmessage, onclose, ...otherParams } = params

  const push = async (controller: ReadableStreamDefaultController, reader: ReadableStreamDefaultReader) => {
    const { value, done } = await reader.read()
    if (done) {
      controller.close()
      onclose?.()
    }
    else {
      const decoded = new TextDecoder().decode(value)
      // 约定使用\x03 (End of Text) 作为JSON分隔符
      // const splitted = decoded.split('\x03').filter(s => s.length > 0)
      for (const s of decoded)
        onmessage?.(s)

      // onmessage?.(JSON.parse(new TextDecoder().decode(value)).split('\u0003'))
      controller.enqueue(value)
      push(controller, reader)
    }
  }
  // 发送请求
  const response = await fetch(`/api${url}`, otherParams)
  // 以ReadableStream解析数据
  const reader = response.body!.getReader()
  const stream = new ReadableStream({
    start(controller) {
      push(controller, reader)
    },
  })
  return await new Response(stream).text()
}

export const streamFetch = (params: any) => {
  return fetchStream('/local_doc_search_stream_chat', params)
}

export const chatfile = (params: any) => {
  return api({
    url: '/local_doc_qa/local_doc_chat',
    method: 'post',
    data: JSON.stringify(params),
  })
}

export const getKbsList = () => {
  return api({
    url: '/local_doc_qa/list_knowledge_base',
    method: 'get',

  })
}

export const deleteKb = (knowledge_base_id: any) => {
  return api({
    url: '/local_doc_qa/delete_knowledge_base',
    method: 'delete',
    params: {
      knowledge_base_id,
    },
  })
}

export const getfilelist = (knowledge_base_id: any) => {
  return api({
    url: '/local_doc_qa/list_files',
    method: 'get',
    params: { knowledge_base_id },

  })
}
export const bing_search = (params: any) => {
  return api({
    url: '/local_doc_qa/bing_search_chat',
    method: 'post',
    data: JSON.stringify(params),

  })
}
export const deletefile = (params: any) => {
  return api({
    url: '/local_doc_qa/delete_file',
    method: 'delete',
    params,
  })
}
export const web_url = () => {
  return window.location.origin
}
export const setapi = () => {
  return window.baseApi
}
export const getkblist = (knowledge_base_id: any) => {
  return api({
    url: '/local_doc_qa/list_knowledge_base',
    method: 'get',
    params: {},

  })
}
export const deletekb = (params: any) => {
  return api({
    url: '/local_doc_qa/delete_knowledge_base',
    method: 'post',
    data: JSON.stringify(params),
  })
}
