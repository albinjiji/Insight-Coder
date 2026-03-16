import { createClient } from '@/lib/supabase/client';

// ─── Sessions ────────────────────────────────────────────────────────

export async function loadSessions(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`loadSessions: ${error.message} (code: ${error.code})`);
  return data;
}

export async function createSession(
  userId: string,
  session: {
    id: string;
    mode: string;
    model: string;
    preview: string;
    repoUrl?: string;
    isRepoConnected?: boolean;
  },
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      id: session.id,
      user_id: userId,
      mode: session.mode,
      model: session.model,
      preview: session.preview,
      repo_url: session.repoUrl || '',
      is_repo_connected: session.isRepoConnected || false,
    })
    .select()
    .single();

  if (error) throw new Error(`createSession: ${error.message} (code: ${error.code})`);
  return data;
}

export async function checkSessionExists(sessionId: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) throw new Error(`checkSessionExists: ${error.message} (code: ${error.code})`);
  return !!data;
}

export async function updateSession(
  sessionId: string,
  updates: {
    preview?: string;
    repoUrl?: string;
    isRepoConnected?: boolean;
  },
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('chat_sessions')
    .update({
      ...(updates.preview !== undefined && { preview: updates.preview }),
      ...(updates.repoUrl !== undefined && { repo_url: updates.repoUrl }),
      ...(updates.isRepoConnected !== undefined && { is_repo_connected: updates.isRepoConnected }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw new Error(`updateSession: ${error.message} (code: ${error.code})`);
}

export async function deleteSession(sessionId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw new Error(`deleteSession: ${error.message} (code: ${error.code})`);
}

// ─── Messages ────────────────────────────────────────────────────────

export async function saveMessage(sessionId: string, role: 'user' | 'assistant', text: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      text,
    });

  if (error) throw new Error(`saveMessage: ${error.message} (code: ${error.code})`);
}

export async function loadMessages(sessionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`loadMessages: ${error.message} (code: ${error.code})`);
  return data;
}
