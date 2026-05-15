import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

/** Đăng ký tài khoản mới bằng email/password */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthUser> {
  // 1. Tạo tài khoản trong Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }, // metadata lưu trong auth.users
    },
  });

  if (authError) {
    console.error('❌ signUp error:', authError);
    let msg = authError.message;
    if (msg.includes('already registered')) msg = 'Email này đã được đăng ký. Vui lòng đăng nhập.';
    if (msg.includes('Password should be at least 6 characters')) msg = 'Mật khẩu phải có ít nhất 6 ký tự.';
    throw new Error(msg);
  }

  const userId = authData.user?.id;
  if (!userId) throw new Error('Không lấy được user ID sau khi đăng ký');

  console.log('✅ Supabase Auth signUp OK, userId:', userId);

  // 2. Insert vào bảng profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        avatar_url: null,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (profileError) {
    // Không fail toàn bộ flow nếu chỉ lỗi insert profile
    console.warn('⚠️ Could not insert profile:', profileError.message);
  } else {
    console.log('✅ Profile inserted:', profile);
  }

  return {
    id: userId,
    email,
    fullName,
    avatarUrl: undefined,
  };
}

/** Đăng nhập bằng email/password */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ signIn error:', error);
    let msg = error.message;
    if (msg.includes('Invalid login credentials')) msg = 'Email hoặc mật khẩu không chính xác.';
    if (msg.includes('Email not confirmed')) msg = 'Vui lòng xác nhận email trước khi đăng nhập.';
    throw new Error(msg);
  }

  const user = data.user;
  if (!user) throw new Error('Không lấy được thông tin user');

  console.log('✅ Supabase Auth signIn OK:', user.email);

  // Lấy profile từ bảng profiles
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

/** Lấy session hiện tại nếu có */
export async function getCurrentSession(): Promise<AuthUser | null> {
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

/** Đăng xuất */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
