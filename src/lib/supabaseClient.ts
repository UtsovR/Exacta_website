import { createClient } from '@supabase/supabase-js';

type SupabaseErrorShape = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

type SupabaseJwtPayload = {
  ref?: unknown;
  role?: unknown;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const missingEnvVars = [
  !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
  !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null
].filter(Boolean) as string[];

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return globalThis.atob(padded);
}

function getSupabaseProjectRefFromUrl(rawUrl: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid VITE_SUPABASE_URL: "${rawUrl}" is not a valid URL.`);
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Invalid VITE_SUPABASE_URL: Supabase project URLs must use https://.');
  }

  if (parsedUrl.hostname === 'api.supabase.com' || parsedUrl.hostname === 'dashboard.supabase.com') {
    throw new Error(
      'Invalid VITE_SUPABASE_URL: use the project URL format https://PROJECT_REF.supabase.co, not api.supabase.com or dashboard URLs.'
    );
  }

  if (!parsedUrl.hostname.endsWith('.supabase.co')) {
    throw new Error(
      'Invalid VITE_SUPABASE_URL: use the project URL format https://PROJECT_REF.supabase.co.'
    );
  }

  if (parsedUrl.pathname && parsedUrl.pathname !== '/') {
    throw new Error('Invalid VITE_SUPABASE_URL: use only the project origin without /rest/v1 or dashboard paths.');
  }

  const projectRef = parsedUrl.hostname.replace(/\.supabase\.co$/u, '');
  if (!projectRef) {
    throw new Error('Invalid VITE_SUPABASE_URL: could not determine the Supabase project ref.');
  }

  return {
    projectRef,
    origin: parsedUrl.origin
  };
}

function getSupabaseProjectRefFromAnonKey(token: string) {
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) {
    throw new Error('Invalid VITE_SUPABASE_ANON_KEY: expected a JWT token.');
  }

  try {
    const payload = JSON.parse(decodeBase64Url(tokenParts[1])) as SupabaseJwtPayload;
    const ref = typeof payload.ref === 'string' ? payload.ref.trim() : '';
    const role = typeof payload.role === 'string' ? payload.role.trim() : '';

    if (!ref) {
      throw new Error('Invalid VITE_SUPABASE_ANON_KEY: token payload does not contain a project ref.');
    }

    return {
      projectRef: ref,
      role: role || 'unknown'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Invalid VITE_SUPABASE_ANON_KEY: could not decode the JWT payload.');
  }
}

function maskToken(token: string) {
  if (token.length <= 12) return token;
  return `${token.slice(0, 6)}...${token.slice(-6)}`;
}

export function debugSupabaseLog(label: string, payload: unknown) {
  if (!import.meta.env.DEV) return;
  console.info(label, payload);
}

export function getSupabaseErrorDetails(error: unknown) {
  if (!error || typeof error !== 'object') {
    return { code: 'unknown', message: 'Unknown error', details: 'none', hint: 'none' };
  }

  const parsed = error as SupabaseErrorShape;

  const code =
    typeof parsed.code === 'string' && parsed.code.trim().length > 0 ? parsed.code.trim() : 'unknown';
  const message =
    typeof parsed.message === 'string' && parsed.message.trim().length > 0
      ? parsed.message.trim()
      : String(parsed.message ?? 'Unknown error');
  const details =
    typeof parsed.details === 'string'
      ? parsed.details.trim() || 'none'
      : parsed.details == null
        ? 'none'
        : JSON.stringify(parsed.details);
  const hint =
    typeof parsed.hint === 'string'
      ? parsed.hint.trim() || 'none'
      : parsed.hint == null
        ? 'none'
        : JSON.stringify(parsed.hint);

  return { code, message, details, hint };
}

export function getSupabaseErrorMessage(error: unknown, fallbackMessage = 'Request failed. Please try again.') {
  const { code, message } = getSupabaseErrorDetails(error);
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('network request failed') ||
    normalizedMessage.includes('networkerror')
  ) {
    return 'Unable to connect to the server. Please check your internet connection or Supabase configuration.';
  }

  if (code === '42501' || normalizedMessage.includes('row-level security')) {
    return 'The request was rejected by Supabase permissions.';
  }

  if (
    normalizedMessage.includes('invalid api key') ||
    normalizedMessage.includes('invalid jwt') ||
    normalizedMessage.includes('jwt') ||
    normalizedMessage.includes('auth')
  ) {
    return 'Supabase authentication failed. Please verify the project URL and anon key.';
  }

  if (
    normalizedMessage.includes('schema cache') ||
    (normalizedMessage.includes('column') && normalizedMessage.includes('does not exist'))
  ) {
    return 'The application is sending a field that the database does not expect.';
  }

  if (normalizedMessage.includes('relation') && normalizedMessage.includes('does not exist')) {
    return 'The requested data table is not available.';
  }

  if (normalizedMessage.includes('violates') || normalizedMessage.includes('constraint')) {
    return 'The database rejected the submitted data. Please review the form and try again.';
  }

  if (message !== 'Unknown error') {
    return message;
  }

  return fallbackMessage;
}

if (missingEnvVars.length > 0) {
  const message =
    `Missing Supabase environment variables: ${missingEnvVars.join(', ')}. ` +
    'Add them in the root .env file and in your deployment environment variables.';

  console.error(message, {
    missingEnvVars,
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseAnonKey: Boolean(supabaseAnonKey)
  });

  throw new Error(message);
}

const urlConfig = getSupabaseProjectRefFromUrl(supabaseUrl);
const anonKeyConfig = getSupabaseProjectRefFromAnonKey(supabaseAnonKey);

if (urlConfig.projectRef !== anonKeyConfig.projectRef) {
  throw new Error(
    `Supabase configuration mismatch: VITE_SUPABASE_URL points to "${urlConfig.projectRef}" but VITE_SUPABASE_ANON_KEY belongs to "${anonKeyConfig.projectRef}".`
  );
}

debugSupabaseLog('Supabase client config loaded', {
  url: urlConfig.origin,
  projectRef: urlConfig.projectRef,
  anonKeyLoaded: true,
  anonKeyPreview: maskToken(supabaseAnonKey),
  anonKeyProjectRef: anonKeyConfig.projectRef,
  anonRole: anonKeyConfig.role,
  viteMode: import.meta.env.MODE
});

const supabaseFetch: typeof fetch = async (input, init) => {
  try {
    return await fetch(input, init);
  } catch (error) {
    const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    console.error('Supabase network request failed', {
      requestUrl,
      error: getSupabaseErrorDetails(error)
    });

    throw error;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: supabaseFetch
  }
});
