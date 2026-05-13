create table if not exists book_categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamptz default now()
);

insert into book_categories (name, slug, description, sort_order)
values
('Tình yêu', 'love', 'Sách kỷ niệm dành cho người yêu', 1),
('Sinh nhật', 'birthday', 'Sách quà tặng sinh nhật cá nhân hóa', 2),
('Gia đình', 'family', 'Sách lưu giữ kỷ niệm gia đình', 3)
on conflict (slug) do nothing;
