import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

/** ng k ti khon mi bng email/password */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthUser> {
  if (!supabase) {
    console.warn(' Supabase client not initialized. Falling back to Demo Mode.');
    return {
      id: 'demo-user-id',
      email,
      fullName,
      avatarUrl: undefined,
    };
  }
  // 1. To ti khon trong Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }, // metadata lu trong auth.users
    },
  });

  if (authError) {
    console.error(' signUp error:', authError);
    let msg = authError.message;
    if (msg.includes('already registered')) msg = 'Email ny  c ng k. Vui lng ng nhp.';
    if (msg.includes('Password should be at least 6 characters')) msg = 'Mt khu phi c t nht 6 k t.';
    throw new Error(msg);
  }

  const userId = authData.user?.id;
  if (!userId) throw new Error('Khng ly c user ID sau khi ng k');

  console.log(' Supabase Auth signUp OK, userId:', userId);

  return {
    id: userId,
    email,
    fullName,
    avatarUrl: undefined,
  };
}

/** Xc minh m OTP sau khi ng k */
export async function verifySignupOTP(
  email: string,
  token: string,
  fullName: string
): Promise<AuthUser> {
  if (!supabase) {
    console.warn(' Supabase client not initialized. Falling back to Demo Mode.');
    return {
      id: 'demo-user-id',
      email,
      fullName,
      avatarUrl: undefined,
    };
  }
  // 1. m bo OTP khng c khong trng v ng nh dng
  const cleanOtp = token.trim();
  if (!/^\d{6,10}$/.test(cleanOtp)) {
    throw new Error('M OTP khng hp l, vui lng nhp t 6 n 10 ch s.');
  }



  // 2. Xc thc OTP vi Supabase
  let verifyResult = await supabase.auth.verifyOtp({
    email,
    token: cleanOtp,
    type: 'signup',
  });

  // Fallback 1: Nu signup b li, th li bng type: 'email' (Numeric OTP chun)
  if (verifyResult.error) {
    console.warn(' verifyOtp with type: signup failed, trying fallback type: email...', verifyResult.error.message);
    const fallbackResult = await supabase.auth.verifyOtp({
      email,
      token: cleanOtp,
      type: 'email',
    });
    if (!fallbackResult.error) {
      verifyResult = fallbackResult;
      console.log(' Fallback with type: email succeeded!');
    }
  }

  // Fallback 2: Nu vn b li, th li bng type: 'magiclink'
  if (verifyResult.error) {
    console.warn(' verifyOtp with type: email failed, trying fallback type: magiclink...', verifyResult.error.message);
    const fallbackResult2 = await supabase.auth.verifyOtp({
      email,
      token: cleanOtp,
      type: 'magiclink',
    });
    if (!fallbackResult2.error) {
      verifyResult = fallbackResult2;
      console.log(' Fallback with type: magiclink succeeded!');
    }
  }

  const { data, error } = verifyResult;

  if (error) {
    console.error(' verifyOtp error after fallbacks:', error);
    let msg = error.message;
    if (msg.includes('Token has expired') || msg.includes('expired')) msg = 'M OTP  ht hn. Vui lng bm gi li.';
    if (msg.includes('Invalid token') || msg.includes('invalid')) msg = 'M OTP khng chnh xc hoc  ht hn. Vui lng nhp li.';
    throw new Error(msg);
  }

  const user = data.user;
  if (!user) throw new Error('Khng ly c thng tin user sau khi xc thc OTP');

  console.log(' OTP Verification OK, user:', user.email);

  // 3. Insert vo bng profiles sau khi ti khon c xc minh
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email,
        full_name: fullName,
        avatar_url: null,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (profileError) {
    console.warn(' Could not insert profile on OTP verify:', profileError.message);
  }

  return {
    id: user.id,
    email: user.email || email,
    fullName: profile?.full_name || fullName,
    avatarUrl: profile?.avatar_url || undefined,
  };
}

/** ng nhp bng email/password */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  if (!supabase) {
    console.warn(' Supabase client not initialized. Falling back to Demo Mode.');
    return {
      id: 'demo-user-id',
      email: email,
      fullName: email.split('@')[0],
      avatarUrl: undefined,
    };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(' signIn error:', error);
    let msg = error.message;
    if (msg.includes('Invalid login credentials')) msg = 'Email hoc mt khu khng chnh xc.';
    if (msg.includes('Email not confirmed')) msg = 'Vui lng xc nhn email trc khi ng nhp.';
    throw new Error(msg);
  }

  const user = data.user;
  if (!user) throw new Error('Khng ly c thng tin user');

  console.log(' Supabase Auth signIn OK:', user.email);

  // Ly profile t bng profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || email,
    fullName: profile?.full_name || user.user_metadata?.full_name || email.split('@')[0],
    avatarUrl: profile?.avatar_url || undefined,
  };
}

/** Ly session hin ti nu c */
export async function getCurrentSession(): Promise<AuthUser | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const user = session.user;
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || '',
    fullName: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
    avatarUrl: profile?.avatar_url || undefined,
  };
}

/** ng xut */
export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}
