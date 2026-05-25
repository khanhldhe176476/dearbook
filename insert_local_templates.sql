-- Lệnh tạo 3 template local vào database

-- Insert Template: Phong cách Vintage
INSERT INTO public.book_templates (id, category_id, name, description, cover_image_url, price, is_active)
VALUES ('a1b2c3d4-0000-0000-0000-000000000001', 'fd28d922-2edc-3706-d6af-495b4381b988', 'Phong cách Vintage', '16 trang thiết kế phong cách vintage – hoài niệm và ấm áp, lý tưởng cho kỷ niệm đặc biệt.', '/temp1/aatbio_com_image_export_May_21_2026%20(1).png', 299000, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, cover_image_url = EXCLUDED.cover_image_url;

INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 1, 'COVER', '{"id":"page-0","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_21_2026%20(1).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 2, 'PAGE', '{"id":"page-1","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026.png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 3, 'PAGE', '{"id":"page-2","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(1).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 4, 'PAGE', '{"id":"page-3","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(2).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000001', 5, 'PAGE', '{"id":"page-4","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(3).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000001', 6, 'PAGE', '{"id":"page-5","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(4).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000007', 'a1b2c3d4-0000-0000-0000-000000000001', 7, 'PAGE', '{"id":"page-6","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(5).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000008', 'a1b2c3d4-0000-0000-0000-000000000001', 8, 'PAGE', '{"id":"page-7","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(6).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000009', 'a1b2c3d4-0000-0000-0000-000000000001', 9, 'PAGE', '{"id":"page-8","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(7).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000010', 'a1b2c3d4-0000-0000-0000-000000000001', 10, 'PAGE', '{"id":"page-9","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(8).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000011', 'a1b2c3d4-0000-0000-0000-000000000001', 11, 'PAGE', '{"id":"page-10","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(9).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000012', 'a1b2c3d4-0000-0000-0000-000000000001', 12, 'PAGE', '{"id":"page-11","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(10).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000013', 'a1b2c3d4-0000-0000-0000-000000000001', 13, 'PAGE', '{"id":"page-12","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(11).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000014', 'a1b2c3d4-0000-0000-0000-000000000001', 14, 'PAGE', '{"id":"page-13","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(12).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000015', 'a1b2c3d4-0000-0000-0000-000000000001', 15, 'PAGE', '{"id":"page-14","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(13).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0001-0000-0000-000000000016', 'a1b2c3d4-0000-0000-0000-000000000001', 16, 'PAGE', '{"id":"page-15","backgroundColor":"#ffffff","backgroundImage":"/temp1/aatbio_com_image_export_May_23_2026%20(14).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;

-- Insert Template: Phong cách Hiện đại
INSERT INTO public.book_templates (id, category_id, name, description, cover_image_url, price, is_active)
VALUES ('a1b2c3d4-0000-0000-0000-000000000002', 'fd28d922-2edc-3706-d6af-495b4381b988', 'Phong cách Hiện đại', '33 trang thiết kế hiện đại – tinh tế, sang trọng với bố cục đa dạng và đầy cảm xúc.', '/temp2/aatbio_com_image_export_May_23_2026.png', 299000, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, cover_image_url = EXCLUDED.cover_image_url;

INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000002', 1, 'COVER', '{"id":"page-0","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026.png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000002', 2, 'PAGE', '{"id":"page-1","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(1).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000002', 3, 'PAGE', '{"id":"page-2","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(2).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000002', 4, 'PAGE', '{"id":"page-3","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(3).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000002', 5, 'PAGE', '{"id":"page-4","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(4).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000002', 6, 'PAGE', '{"id":"page-5","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(5).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000007', 'a1b2c3d4-0000-0000-0000-000000000002', 7, 'PAGE', '{"id":"page-6","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(6).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000008', 'a1b2c3d4-0000-0000-0000-000000000002', 8, 'PAGE', '{"id":"page-7","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(7).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000009', 'a1b2c3d4-0000-0000-0000-000000000002', 9, 'PAGE', '{"id":"page-8","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(8).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000010', 'a1b2c3d4-0000-0000-0000-000000000002', 10, 'PAGE', '{"id":"page-9","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(9).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000011', 'a1b2c3d4-0000-0000-0000-000000000002', 11, 'PAGE', '{"id":"page-10","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(10).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000012', 'a1b2c3d4-0000-0000-0000-000000000002', 12, 'PAGE', '{"id":"page-11","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(11).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000013', 'a1b2c3d4-0000-0000-0000-000000000002', 13, 'PAGE', '{"id":"page-12","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(12).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000014', 'a1b2c3d4-0000-0000-0000-000000000002', 14, 'PAGE', '{"id":"page-13","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(13).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000015', 'a1b2c3d4-0000-0000-0000-000000000002', 15, 'PAGE', '{"id":"page-14","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(14).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000016', 'a1b2c3d4-0000-0000-0000-000000000002', 16, 'PAGE', '{"id":"page-15","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(15).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000017', 'a1b2c3d4-0000-0000-0000-000000000002', 17, 'PAGE', '{"id":"page-16","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(16).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000018', 'a1b2c3d4-0000-0000-0000-000000000002', 18, 'PAGE', '{"id":"page-17","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(17).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000019', 'a1b2c3d4-0000-0000-0000-000000000002', 19, 'PAGE', '{"id":"page-18","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(18).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000020', 'a1b2c3d4-0000-0000-0000-000000000002', 20, 'PAGE', '{"id":"page-19","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(19).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000021', 'a1b2c3d4-0000-0000-0000-000000000002', 21, 'PAGE', '{"id":"page-20","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(20).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000022', 'a1b2c3d4-0000-0000-0000-000000000002', 22, 'PAGE', '{"id":"page-21","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(21).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000023', 'a1b2c3d4-0000-0000-0000-000000000002', 23, 'PAGE', '{"id":"page-22","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(22).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000024', 'a1b2c3d4-0000-0000-0000-000000000002', 24, 'PAGE', '{"id":"page-23","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(23).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000025', 'a1b2c3d4-0000-0000-0000-000000000002', 25, 'PAGE', '{"id":"page-24","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(24).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000026', 'a1b2c3d4-0000-0000-0000-000000000002', 26, 'PAGE', '{"id":"page-25","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(25).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000027', 'a1b2c3d4-0000-0000-0000-000000000002', 27, 'PAGE', '{"id":"page-26","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(26).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000028', 'a1b2c3d4-0000-0000-0000-000000000002', 28, 'PAGE', '{"id":"page-27","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(27).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000029', 'a1b2c3d4-0000-0000-0000-000000000002', 29, 'PAGE', '{"id":"page-28","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(28).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000030', 'a1b2c3d4-0000-0000-0000-000000000002', 30, 'PAGE', '{"id":"page-29","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(29).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000031', 'a1b2c3d4-0000-0000-0000-000000000002', 31, 'PAGE', '{"id":"page-30","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(30).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000032', 'a1b2c3d4-0000-0000-0000-000000000002', 32, 'PAGE', '{"id":"page-31","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(31).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0002-0000-0000-000000000033', 'a1b2c3d4-0000-0000-0000-000000000002', 33, 'PAGE', '{"id":"page-32","backgroundColor":"#ffffff","backgroundImage":"/temp2/aatbio_com_image_export_May_23_2026%20(32).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;

-- Insert Template: Phong cách Tối giản
INSERT INTO public.book_templates (id, category_id, name, description, cover_image_url, price, is_active)
VALUES ('a1b2c3d4-0000-0000-0000-000000000003', 'fd28d922-2edc-3706-d6af-495b4381b988', 'Phong cách Tối giản', '32 trang thiết kế tối giản – tinh tế, tập trung vào nội dung và cảm xúc chính.', '/temp3/aatbio_com_image_export_May_23_2026.png', 299000, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, cover_image_url = EXCLUDED.cover_image_url;

INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000003', 1, 'COVER', '{"id":"page-0","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026.png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000003', 2, 'PAGE', '{"id":"page-1","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(1).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000003', 3, 'PAGE', '{"id":"page-2","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(2).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000003', 4, 'PAGE', '{"id":"page-3","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(3).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000003', 5, 'PAGE', '{"id":"page-4","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(4).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000003', 6, 'PAGE', '{"id":"page-5","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(5).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000007', 'a1b2c3d4-0000-0000-0000-000000000003', 7, 'PAGE', '{"id":"page-6","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(6).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000008', 'a1b2c3d4-0000-0000-0000-000000000003', 8, 'PAGE', '{"id":"page-7","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(7).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000009', 'a1b2c3d4-0000-0000-0000-000000000003', 9, 'PAGE', '{"id":"page-8","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(8).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000010', 'a1b2c3d4-0000-0000-0000-000000000003', 10, 'PAGE', '{"id":"page-9","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(9).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000011', 'a1b2c3d4-0000-0000-0000-000000000003', 11, 'PAGE', '{"id":"page-10","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(10).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000012', 'a1b2c3d4-0000-0000-0000-000000000003', 12, 'PAGE', '{"id":"page-11","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(11).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000013', 'a1b2c3d4-0000-0000-0000-000000000003', 13, 'PAGE', '{"id":"page-12","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(12).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000014', 'a1b2c3d4-0000-0000-0000-000000000003', 14, 'PAGE', '{"id":"page-13","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(13).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000015', 'a1b2c3d4-0000-0000-0000-000000000003', 15, 'PAGE', '{"id":"page-14","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(14).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000016', 'a1b2c3d4-0000-0000-0000-000000000003', 16, 'PAGE', '{"id":"page-15","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(15).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000017', 'a1b2c3d4-0000-0000-0000-000000000003', 17, 'PAGE', '{"id":"page-16","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(16).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000018', 'a1b2c3d4-0000-0000-0000-000000000003', 18, 'PAGE', '{"id":"page-17","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(17).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000019', 'a1b2c3d4-0000-0000-0000-000000000003', 19, 'PAGE', '{"id":"page-18","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(18).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000020', 'a1b2c3d4-0000-0000-0000-000000000003', 20, 'PAGE', '{"id":"page-19","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(19).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000021', 'a1b2c3d4-0000-0000-0000-000000000003', 21, 'PAGE', '{"id":"page-20","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(20).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000022', 'a1b2c3d4-0000-0000-0000-000000000003', 22, 'PAGE', '{"id":"page-21","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(21).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000023', 'a1b2c3d4-0000-0000-0000-000000000003', 23, 'PAGE', '{"id":"page-22","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(22).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000024', 'a1b2c3d4-0000-0000-0000-000000000003', 24, 'PAGE', '{"id":"page-23","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(23).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000025', 'a1b2c3d4-0000-0000-0000-000000000003', 25, 'PAGE', '{"id":"page-24","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(24).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000026', 'a1b2c3d4-0000-0000-0000-000000000003', 26, 'PAGE', '{"id":"page-25","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(25).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000027', 'a1b2c3d4-0000-0000-0000-000000000003', 27, 'PAGE', '{"id":"page-26","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(26).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000028', 'a1b2c3d4-0000-0000-0000-000000000003', 28, 'PAGE', '{"id":"page-27","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(27).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000029', 'a1b2c3d4-0000-0000-0000-000000000003', 29, 'PAGE', '{"id":"page-28","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(28).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000030', 'a1b2c3d4-0000-0000-0000-000000000003', 30, 'PAGE', '{"id":"page-29","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(29).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000031', 'a1b2c3d4-0000-0000-0000-000000000003', 31, 'PAGE', '{"id":"page-30","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(30).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;
INSERT INTO public.template_pages (id, template_id, page_number, layout_type, default_content)
VALUES ('b1b2c3d4-0003-0000-0000-000000000032', 'a1b2c3d4-0000-0000-0000-000000000003', 32, 'PAGE', '{"id":"page-31","backgroundColor":"#ffffff","backgroundImage":"/temp3/aatbio_com_image_export_May_23_2026%20(31).png","elements":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET default_content = EXCLUDED.default_content;

