import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
  shippingNote?: string;
}

function normalizeAuthUser(user: AuthUser): AuthUser {
  const email = user.email.trim();
  const fullName = user.fullName?.trim() || email.split('@')[0] || email;

  return {
    id: user.id,
    email,
    fullName,
    avatarUrl: user.avatarUrl || undefined,
    phone: user.phone?.trim() || undefined,
    address: user.address?.trim() || undefined,
    ward: user.ward?.trim() || undefined,
    district: user.district?.trim() || undefined,
    city: user.city?.trim() || undefined,
    shippingNote: user.shippingNote?.trim() || undefined,
  };
}

function mapProfileRow(profile: any, fallback: AuthUser): AuthUser {
  return {
    id: profile.id,
    email: profile.email || fallback.email,
    fullName: profile.full_name || fallback.fullName,
    avatarUrl: profile.avatar_url || undefined,
    phone: profile.phone || fallback.phone,
    address: profile.address || fallback.address,
    ward: profile.ward || fallback.ward,
    district: profile.district || fallback.district,
    city: profile.city || fallback.city,
    shippingNote: profile.shipping_note || fallback.shippingNote,
  };
}

export async function updateUserProfile(user: AuthUser): Promise<AuthUser> {
  const normalizedUser = normalizeAuthUser(user);

  if (!supabase) {
    return normalizedUser;
  }

  try {
    const { data } = await supabase.auth.getUser();
    if (data.user?.id === normalizedUser.id) {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: normalizedUser.fullName,
          avatar_url: normalizedUser.avatarUrl || null,
          phone: normalizedUser.phone || null,
          address: normalizedUser.address || null,
          ward: normalizedUser.ward || null,
          district: normalizedUser.district || null,
          city: normalizedUser.city || null,
          shipping_note: normalizedUser.shippingNote || null,
        },
      });

      if (error) {
        console.warn('Could not update Supabase auth profile metadata:', error.message);
      }
    }
  } catch (err) {
    console.warn('Could not update Supabase auth profile metadata:', err);
  }

  let syncedUser = normalizedUser;

  try {
    const profilePayload = {
      id: normalizedUser.id,
      email: normalizedUser.email,
      full_name: normalizedUser.fullName,
      avatar_url: normalizedUser.avatarUrl || null,
      phone: normalizedUser.phone || null,
      address: normalizedUser.address || null,
      ward: normalizedUser.ward || null,
      district: normalizedUser.district || null,
      city: normalizedUser.city || null,
      shipping_note: normalizedUser.shippingNote || null,
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select('id,email,full_name,avatar_url,phone,address,ward,district,city,shipping_note')
      .single();

    if (error) {
      console.warn('Could not update Supabase profile row:', error.message);
      const { data: basicProfile, error: basicError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: normalizedUser.id,
            email: normalizedUser.email,
            full_name: normalizedUser.fullName,
            avatar_url: normalizedUser.avatarUrl || null,
          },
          { onConflict: 'id' }
        )
        .select('id,email,full_name,avatar_url')
        .single();

      if (basicError) {
        console.warn('Could not update basic Supabase profile row:', basicError.message);
      } else if (basicProfile) {
        syncedUser = {
          ...normalizedUser,
          id: basicProfile.id,
          email: basicProfile.email || normalizedUser.email,
          fullName: basicProfile.full_name || normalizedUser.fullName,
          avatarUrl: basicProfile.avatar_url || undefined,
        };
      }
    } else if (profile) {
      syncedUser = mapProfileRow(profile, normalizedUser);
    }
  } catch (err) {
    console.warn('Could not update Supabase profile row:', err);
  }

  return syncedUser;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthUser> {
  const normalizedEmail = email.trim();
  const normalizedFullName = fullName.trim() || normalizedEmail.split('@')[0];

  if (!supabase) {
    console.warn('Supabase client is not initialized. Falling back to demo mode.');
    return {
      id: 'demo-user-id',
      email: normalizedEmail,
      fullName: normalizedFullName,
      avatarUrl: undefined,
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { full_name: normalizedFullName },
    },
  });

  if (authError) {
    console.error('signUp error:', authError);
    let msg = authError.message;
    if (msg.includes('already registered')) msg = 'Email này đã được đăng ký. Vui lòng đăng nhập.';
    if (msg.includes('Password should be at least 6 characters')) msg = 'Mật khẩu phải có ít nhất 6 ký tự.';
    throw new Error(msg);
  }

  const user = authData.user;
  if (!user) throw new Error('Không lấy được user ID sau khi đăng ký.');

  if (user.identities && user.identities.length === 0) {
    console.warn('signUp silent duplicate detected: email already registered:', normalizedEmail);
    throw new Error('Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.');
  }

  console.log('Supabase Auth signUp OK, userId:', user.id);

  return {
    id: user.id,
    email: normalizedEmail,
    fullName: normalizedFullName,
    avatarUrl: undefined,
  };
}

export async function verifySignupOTP(
  email: string,
  token: string,
  fullName: string
): Promise<AuthUser> {
  const normalizedEmail = email.trim();
  const normalizedFullName = fullName.trim() || normalizedEmail.split('@')[0];

  if (!supabase) {
    console.warn('Supabase client is not initialized. Falling back to demo mode.');
    return {
      id: 'demo-user-id',
      email: normalizedEmail,
      fullName: normalizedFullName,
      avatarUrl: undefined,
    };
  }

  const cleanOtp = token.trim();
  if (!/^\d{6,10}$/.test(cleanOtp)) {
    throw new Error('Mã OTP không hợp lệ, vui lòng nhập từ 6 đến 10 chữ số.');
  }

  let verifyResult = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token: cleanOtp,
    type: 'signup',
  });

  if (verifyResult.error) {
    console.warn('verifyOtp with type signup failed, trying fallback type email:', verifyResult.error.message);
    const fallbackResult = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: cleanOtp,
      type: 'email',
    });
    if (!fallbackResult.error) {
      verifyResult = fallbackResult;
      console.log('Fallback with type email succeeded.');
    }
  }

  if (verifyResult.error) {
    console.warn('verifyOtp with type email failed, trying fallback type magiclink:', verifyResult.error.message);
    const fallbackResult = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: cleanOtp,
      type: 'magiclink',
    });
    if (!fallbackResult.error) {
      verifyResult = fallbackResult;
      console.log('Fallback with type magiclink succeeded.');
    }
  }

  const { data, error } = verifyResult;

  if (error) {
    console.error('verifyOtp error after fallbacks:', error);
    let msg = error.message;
    if (msg.includes('Token has expired') || msg.includes('expired')) msg = 'Mã OTP đã hết hạn. Vui lòng bấm gửi lại.';
    if (msg.includes('Invalid token') || msg.includes('invalid')) msg = 'Mã OTP không chính xác hoặc đã hết hạn. Vui lòng nhập lại.';
    throw new Error(msg);
  }

  const user = data.user;
  if (!user) throw new Error('Không lấy được thông tin user sau khi xác thực OTP.');

  console.log('OTP verification OK, user:', user.email);

  return updateUserProfile({
    id: user.id,
    email: user.email || normalizedEmail,
    fullName: normalizedFullName,
    avatarUrl: undefined,
  });
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const normalizedEmail = email.trim();

  if (!supabase) {
    console.warn('Supabase client is not initialized. Falling back to demo mode.');
    return {
      id: 'demo-user-id',
      email: normalizedEmail,
      fullName: normalizedEmail.split('@')[0],
      avatarUrl: undefined,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    console.error('signIn error:', error);
    let msg = error.message;
    if (msg.includes('Invalid login credentials')) msg = 'Email hoặc mật khẩu không chính xác.';
    if (msg.includes('Email not confirmed')) msg = 'Vui lòng xác nhận email trước khi đăng nhập.';
    throw new Error(msg);
  }

  const user = data.user;
  if (!user) throw new Error('Không lấy được thông tin user.');

  console.log('Supabase Auth signIn OK:', user.email);

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name,avatar_url,phone,address,ward,district,city,shipping_note')
    .eq('id', user.id)
    .single();
  const metadata = user.user_metadata || {};

  return {
    id: user.id,
    email: user.email || normalizedEmail,
    fullName: profile?.full_name || metadata.full_name || normalizedEmail.split('@')[0],
    avatarUrl: profile?.avatar_url || metadata.avatar_url || undefined,
    phone: profile?.phone || metadata.phone || undefined,
    address: profile?.address || metadata.address || undefined,
    ward: profile?.ward || metadata.ward || undefined,
    district: profile?.district || metadata.district || undefined,
    city: profile?.city || metadata.city || undefined,
    shippingNote: profile?.shipping_note || metadata.shipping_note || undefined,
  };
}

export async function getCurrentSession(): Promise<AuthUser | null> {
  if (!supabase) return null;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const user = session.user;
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name,avatar_url,phone,address,ward,district,city,shipping_note')
    .eq('id', user.id)
    .single();
  const metadata = user.user_metadata || {};

  return {
    id: user.id,
    email: user.email || '',
    fullName: profile?.full_name || metadata.full_name || user.email?.split('@')[0] || '',
    avatarUrl: profile?.avatar_url || metadata.avatar_url || undefined,
    phone: profile?.phone || metadata.phone || undefined,
    address: profile?.address || metadata.address || undefined,
    ward: profile?.ward || metadata.ward || undefined,
    district: profile?.district || metadata.district || undefined,
    city: profile?.city || metadata.city || undefined,
    shippingNote: profile?.shipping_note || metadata.shipping_note || undefined,
  };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}
