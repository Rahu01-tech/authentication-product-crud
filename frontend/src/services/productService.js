const API_URL = "http://localhost:5000/api";

export async function getProducts() {
    const response = await fetch(`${API_URL}/products`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
    }

    return data;
}

export async function createProduct(productData, accessToken, refreshToken) {
    let response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
    });

    if (response.status === 401) {
        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
            throw new Error("Session expired. Please login again.");
        }

        response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newAccessToken}`,
            },
            body: JSON.stringify(productData),
        });
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
    }

    return data;
}

export async function getProductById(productId) {
    const response = await fetch(
        `${API_URL}/products/${productId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product");
    }

    return data;
}

export async function updateProduct(
    productId,
    productData,
    accessToken,
    refreshToken
) {
    let response = await fetch(
        `${API_URL}/products/${productId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(productData),
        }
    );

    if (response.status === 401) {
        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
            throw new Error("Session expired. Please login again.");
        }

        response = await fetch(
            `${API_URL}/products/${productId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newAccessToken}`,
                },
                body: JSON.stringify(productData),
            }
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update product"
        );
    }

    return data;
}

export async function deleteProduct(
    productId,
    accessToken,
    refreshToken
) {
    let response = await fetch(
        `${API_URL}/products/${productId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (response.status === 401) {
        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
            throw new Error("Session expired. Please login again.");
        }

        response = await fetch(
            `${API_URL}/products/${productId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                },
            }
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to delete product"
        );
    }

    return data;
}