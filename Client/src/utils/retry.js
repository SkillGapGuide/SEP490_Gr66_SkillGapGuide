// utils/retry.js AuthCallbackPage
async function retry(fn, maxTries = 6, delayMs = 800) {
  let lastErr;
  for (let i = 0; i < maxTries; ++i) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      // Chỉ retry nếu lỗi 403 hoặc 404
      if (err?.response?.status !== 403 && err?.response?.status !== 404) throw err;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw lastErr;
}
