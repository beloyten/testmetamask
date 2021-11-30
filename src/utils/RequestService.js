import Http from '@/plugin/axios.js'
export const Get = (apiUrl, query, header) => {
  return Http({
    url: apiUrl,
    method: 'GET',
    headers: header,
    params: query || null
  })
}

export const Post = (apiUrl, data, query, header) => {
  return Http({
    url: apiUrl,
    method: 'POST',
    headers: header,
    params: query || null,
    data: data
  })
}

export const Delete = (apiUrl, data) => {
  return Http({
    url: apiUrl,
    method: 'DELETE',
    data: data
  })
}

export const Mock = (apiUrl, data, query) => {
  console.log('Mock data with url: ', apiUrl)
  return new Promise(resolve => {
    resolve(data)
  })
}
