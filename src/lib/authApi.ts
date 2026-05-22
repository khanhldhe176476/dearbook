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
  if (!supabase) {
    throw new Error('Chưa kết nối cơ sở dữ liệu! Vui lòng cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trên Render Dashboard.');
  }
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

  return {
    id: userId,
    email,
    fullName,
    avatarUrl: undefined,
  };
}

/** Xác minh mã OTP sau khi đăng ký */
export async function verifySignupOTP(
  email: string,
  token: string,
  fullName: string
): Promise<AuthUser> {
  if (!supabase) {
    throw new Error('Chưa kết nối cơ sở dữ liệu! Vui lòng cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trên Render Dashboard.');
  }
  // 1. Đảm bảo OTP không có khoảng trắng và đúng định dạng
  const cleanOtp = token.trim();
  if (!/^\d{6,10}$/.test(cleanOtp)) {
    throw new Error('Mã OTP không hợp lệ, vui lòng nhập từ 6 đến 10 chữ số.');
  }



  // 2. Xác thực OTP với Supabase
  let verifyResult = await supabase.auth.verifyOtp({
    email,
    token: cleanOtp,
    type: 'signup',
  });

  // Fallback 1: Nếu signup bị lỗi, thử lại bằng type: 'email' (Numeric OTP chuẩn)
  if (verifyResult.error) {
    console.warn('⚠️ verifyOtp with type: signup failed, trying fallback type: email...', verifyResult.error.message);
    const fallbackResult = await supabase.auth.verifyOtp({
      email,
      token: cleanOtp,
      type: 'email',
    });
    if (!fallbackResult.error) {
      verifyResult = fallbackResult;
      console.log('✅ Fallback with type: email succeeded!');
    }
  }

  // Fallback 2: Nếu vẫn bị lỗi, thử lại bằng type: 'magiclink'
  if (verifyResult.error) {
    console.warn('⚠️ verifyOtp with type: email failed, trying fallback type: magiclink...', verifyResult.error.message);
    const fallbackResult2 = await supabase.auth.verifyOtp({
      email,
      token: cleanOtp,
      type: 'magiclink',
    });
    if (!fallbackResult2.error) {
      verifyResult = fallbackResult2;
      console.log('✅ Fallback with type: magiclink succeeded!');
    }
  }

  const { data, error } = verifyResult;

  if (error) {
    console.error('❌ verifyOtp error after fallbacks:', error);
    let msg = error.message;
    if (msg.includes('Token has expired') || msg.includes('expired')) msg = 'Mã OTP đã hết hạn. Vui lòng bấm gửi lại.';
    if (msg.includes('Invalid token') || msg.includes('invalid')) msg = 'Mã OTP không chính xác hoặc đã hết hạn. Vui lòng nhập lại.';
    throw new Error(msg);
  }

  const user = data.user;
  if (!user) throw new Error('Không lấy được thông tin user sau khi xác thực OTP');

  console.log('✅ OTP Verification OK, user:', user.email);

  // 3. Insert vào bảng profiles sau khi tài khoản được xác minh
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
    console.warn('⚠️ Could not insert profile on OTP verify:', profileError.message);
  }

  return {
    id: user.id,
    email: user.email || email,
    fullName: profile?.full_name || fullName,
    avatarUrl: profile?.avatar_url || undefined,
  };
}

/** Đăng nhập bằng email/password */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  if (!supabase) {
    throw new Error('Chưa kết nối cơ sở dữ liệu! Vui lòng cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trên Render Dashboard.');
  }
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

/** Đăng xuất */
export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}
