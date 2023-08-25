
const BASE_URL = "http://localhost:8000"

async function request({ method, path, body, headers, token }) {
    const init = {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json", ...headers }
    }
    const t = token ?? localStorage.getItem("token")
    if (t) init.headers.authorization = `Bearer ${t}`
    if (method !== "GET" && body) init.body = JSON.stringify(body)

    const response = await fetch(`${BASE_URL}${path}`, init);
    const json = await response.json()
    if (response.ok) return { data: json, status: 200 }
    return { error: json, status: response.status }


}

export const api = {
    get(path, opts) {
        return request({ method: "GET", path, ...opts })
    },
    post(path, opts) {
        return request({ method: "POST", path, ...opts })
    },
    put(path, opts) {
        return request({ method: "PUT", path, ...opts })
    },
    delete(path, opts) {
        return request({ method: "DELETE", path, ...opts })
    }
}