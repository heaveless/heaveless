create table whatsapp_messages (
  id bigint generated always as identity primary key,
  wa_message_id text,
  direction text not null check (direction in ('in', 'out')),
  phone text not null,
  kind text not null default 'text',
  body text,
  status text,
  created_at timestamptz not null default now()
);

create index whatsapp_messages_created_at_idx on whatsapp_messages (created_at desc);
create index whatsapp_messages_phone_idx on whatsapp_messages (phone, created_at desc);
create unique index whatsapp_messages_wa_message_id_key on whatsapp_messages (wa_message_id)
  where wa_message_id is not null;
