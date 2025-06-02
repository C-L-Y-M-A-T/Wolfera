type APIResponse<T> = {
  data: T | null;
  error: any;
};

export async function request<T>(
  promise: Promise<any>,
): Promise<APIResponse<T>> {
  try {
    const res = await promise;
    return { data: res.data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err?.response?.data || err.message || "Unknown error",
    };
  }
}
