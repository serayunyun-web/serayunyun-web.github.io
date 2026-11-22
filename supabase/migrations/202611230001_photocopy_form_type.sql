-- 新增「一般影印」產品：manual_inquiry_items.form_type 允許 photocopy。
alter table public.manual_inquiry_items drop constraint manual_inquiry_items_form_type_check;
alter table public.manual_inquiry_items add constraint manual_inquiry_items_form_type_check
  check (form_type in ('book-binding', 'menu', 'certificate-folder', 'construction-book', 'photocopy', 'unsure'));
