-- init-mvp-schema.sql

create table if not exists profiles (
    id uuid primary key default gen_random_uuid(),
    email text unique,
    full_name text,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists book_categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamptz default now()
);

create table if not exists book_templates (
    id uuid primary key default gen_random_uuid(),
    category_id uuid references book_categories(id),
    name text not null,
    description text,
    cover_image_url text,
    price decimal(10,2) default 0.0,
    is_active boolean default true,
    created_at timestamptz default now()
);

create table if not exists template_pages (
    id uuid primary key default gen_random_uuid(),
    template_id uuid references book_templates(id),
    page_number int not null,
    layout_type text not null,
    default_content jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists user_books (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    template_id uuid references book_templates(id),
    title text,
    status text default 'DRAFT',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists user_book_pages (
    id uuid primary key default gen_random_uuid(),
    user_book_id uuid references user_books(id) on delete cascade,
    template_page_id uuid references template_pages(id),
    page_number int not null,
    user_content jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists user_uploads (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    file_url text not null,
    thumbnail_url text,
    file_type text,
    created_at timestamptz default now()
);

create table if not exists orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id),
    user_book_id uuid references user_books(id),
    total_amount decimal(10,2) not null,
    status text default 'PENDING',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists order_shipping (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    recipient_name text not null,
    phone text not null,
    address text not null,
    city text,
    tracking_number text,
    created_at timestamptz default now()
);

create table if not exists payments (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id),
    amount decimal(10,2) not null,
    payment_method text not null,
    status text default 'PENDING',
    transaction_id text,
    created_at timestamptz default now()
);

-- Seed Data
insert into book_categories (name, slug, description, sort_order)
values
('Tình yêu', 'love', 'Sách kỷ niệm dành cho người yêu', 1),
('Sinh nhật', 'birthday', 'Sách quà tặng sinh nhật cá nhân hóa', 2),
('Gia đình', 'family', 'Sách lưu giữ kỷ niệm gia đình', 3)
on conflict (slug) do nothing;

do $$
declare
    love_id uuid;
    bday_id uuid;
    fam_id uuid;
    tmpl_love uuid;
    tmpl_bday uuid;
    tmpl_fam uuid;
begin
    select id into love_id from book_categories where slug = 'love';
    select id into bday_id from book_categories where slug = 'birthday';
    select id into fam_id from book_categories where slug = 'family';

    if love_id is not null then
        insert into book_templates (id, category_id, name, description, cover_image_url, price)
        values (gen_random_uuid(), love_id, 'Love Story Vol 1', 'Lưu giữ khoảnh khắc ngọt ngào', 'https://via.placeholder.com/150', 350000)
        returning id into tmpl_love;
        
        insert into template_pages (template_id, page_number, layout_type, default_content)
        values 
        (tmpl_love, 1, 'COVER', '{"title": "Our Love Story", "image": ""}'),
        (tmpl_love, 2, 'TEXT_ONLY', '{"text": "Ngày đầu tiên chúng ta gặp nhau..."}'),
        (tmpl_love, 3, 'IMAGE_TEXT', '{"image": "", "text": "Kỷ niệm khó quên"}');
    end if;

    if bday_id is not null then
        insert into book_templates (id, category_id, name, description, cover_image_url, price)
        values (gen_random_uuid(), bday_id, 'Happy Birthday', 'Món quà sinh nhật ý nghĩa', 'https://via.placeholder.com/150', 299000)
        returning id into tmpl_bday;
        
        insert into template_pages (template_id, page_number, layout_type, default_content)
        values 
        (tmpl_bday, 1, 'COVER', '{"title": "Happy Birthday", "image": ""}'),
        (tmpl_bday, 2, 'IMAGE_ONLY', '{"image": ""}');
    end if;

    if fam_id is not null then
        insert into book_templates (id, category_id, name, description, cover_image_url, price)
        values (gen_random_uuid(), fam_id, 'Family Album', 'Album gia đình ấm áp', 'https://via.placeholder.com/150', 450000)
        returning id into tmpl_fam;
        
        insert into template_pages (template_id, page_number, layout_type, default_content)
        values 
        (tmpl_fam, 1, 'COVER', '{"title": "Gia Đình Là Số 1", "image": ""}'),
        (tmpl_fam, 2, 'GALLERY', '{"images": []}');
    end if;
end $$;
