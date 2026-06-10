const DEEPSEEK_API_KEY_STORAGE_KEY = 'warriors15-donk-deepseek-api-key';

export function getSavedDeepSeekApiKey() {
    try {
        return window.localStorage.getItem(DEEPSEEK_API_KEY_STORAGE_KEY) ?? '';
    } catch {
        return '';
    }
}

export function saveDeepSeekApiKey(apiKey: string) {
    try {
        if (apiKey) {
            window.localStorage.setItem(DEEPSEEK_API_KEY_STORAGE_KEY, apiKey);
        } else {
            window.localStorage.removeItem(DEEPSEEK_API_KEY_STORAGE_KEY);
        }
        return true;
    } catch {
        return false;
    }
}
