const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function postData<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function updateData<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function deleteData(endpoint: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }
  } catch (error) {
    throw error
  }
}
